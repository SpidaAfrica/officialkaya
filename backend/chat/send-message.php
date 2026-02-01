<?php
require_once __DIR__ . "/chat-helpers.php";

chat_set_headers();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  chat_json_response([
    "success" => false,
    "message" => "Invalid request method",
  ], 405);
}

$body = chat_request_body();
$packageId = chat_get_int($body, "package_id");
$senderId = chat_get_int($body, "sender_id");
$receiverId = chat_get_int($body, "receiver_id");
$content = isset($body["content"]) ? trim((string) $body["content"]) : "";

if (!$packageId || !$senderId || !$receiverId || $content === "") {
  chat_json_response([
    "success" => false,
    "message" => "Missing required message fields",
  ], 400);
}

$session = chat_get_or_create_session($db, $packageId);
if (isset($session["error"])) {
  chat_json_response([
    "success" => false,
    "message" => $session["error"],
  ], 404);
}

$stmt = $db->prepare(
  "INSERT INTO chat_messages (chat_id, sender_id, receiver_id, package_id, content)
   VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("iiiis", $session["chat_id"], $senderId, $receiverId, $packageId, $content);

if (!$stmt->execute()) {
  $stmt->close();
  chat_json_response([
    "success" => false,
    "message" => "Failed to send message",
  ], 500);
}

$messageId = $stmt->insert_id;
$stmt->close();

chat_json_response([
  "success" => true,
  "message" => "Message sent",
  "id" => $messageId,
]);
