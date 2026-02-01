<?php
require_once __DIR__ . "/chat-helpers.php";

chat_set_headers();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  chat_json_response([
    "success" => false,
    "message" => "Invalid request method",
  ], 405);
}

$packageId = chat_get_int($_POST, "package_id");
$senderId = chat_get_int($_POST, "sender_id");
$receiverId = chat_get_int($_POST, "receiver_id");

if (!$packageId || !$senderId || !$receiverId) {
  chat_json_response([
    "success" => false,
    "message" => "Missing required fields",
  ], 400);
}

if (!isset($_FILES["audio"]) || $_FILES["audio"]["error"] !== UPLOAD_ERR_OK) {
  chat_json_response([
    "success" => false,
    "message" => "Audio upload failed",
  ], 400);
}

$uploadDir = __DIR__ . "/uploads";
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

$extension = pathinfo($_FILES["audio"]["name"], PATHINFO_EXTENSION);
$extension = $extension !== "" ? $extension : "webm";
$filename = "audio_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $extension;
$destination = $uploadDir . "/" . $filename;

if (!move_uploaded_file($_FILES["audio"]["tmp_name"], $destination)) {
  chat_json_response([
    "success" => false,
    "message" => "Failed to save audio",
  ], 500);
}

$session = chat_get_or_create_session($db, $packageId);
if (isset($session["error"])) {
  chat_json_response([
    "success" => false,
    "message" => $session["error"],
  ], 404);
}

$relativePath = "uploads/" . $filename;
$stmt = $db->prepare(
  "INSERT INTO chat_messages (chat_id, sender_id, receiver_id, package_id, audio_url)
   VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("iiiis", $session["chat_id"], $senderId, $receiverId, $packageId, $relativePath);

if (!$stmt->execute()) {
  $stmt->close();
  chat_json_response([
    "success" => false,
    "message" => "Failed to save audio message",
  ], 500);
}

$messageId = $stmt->insert_id;
$stmt->close();

chat_json_response([
  "success" => true,
  "message" => "Audio message sent",
  "id" => $messageId,
  "audio_url" => $relativePath,
]);
