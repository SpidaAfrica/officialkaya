<?php
require_once __DIR__ . "/chat-helpers.php";

chat_set_headers();

$packageId = chat_get_package_id();
$chatId = null;

if (isset($_GET["chat_id"])) {
  $chatId = (int) $_GET["chat_id"];
}

if (!$chatId && $packageId) {
  $session = chat_get_or_create_session($db, $packageId);
  if (isset($session["error"])) {
    chat_json_response([
      "success" => false,
      "error" => $session["error"],
    ], 404);
  }
  $chatId = $session["chat_id"];
}

if (!$chatId) {
  chat_json_response([
    "success" => false,
    "error" => "Missing chat_id or package_id",
  ], 400);
}

$stmt = $db->prepare(
  "SELECT id, sender_id, receiver_id, package_id, content, audio_url, created_at
   FROM chat_messages
   WHERE chat_id = ?
   ORDER BY created_at ASC"
);
$stmt->bind_param("i", $chatId);
$stmt->execute();
$result = $stmt->get_result();

$messages = [];
while ($row = $result->fetch_assoc()) {
  $row["timestamp"] = $row["created_at"];
  if (!$row["content"] && $row["audio_url"]) {
    $row["content"] = "[Voice message]";
  }
  $messages[] = $row;
}
$stmt->close();

chat_json_response([
  "success" => true,
  "data" => $messages,
]);
