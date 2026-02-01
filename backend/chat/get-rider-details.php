<?php
require_once __DIR__ . "/chat-helpers.php";

chat_set_headers();

$packageId = chat_get_package_id();
if (!$packageId) {
  chat_json_response([
    "status" => "error",
    "message" => "Missing package_id",
  ], 400);
}

$participants = chat_fetch_participants($db, $packageId);
if (isset($participants["error"])) {
  chat_json_response([
    "status" => "error",
    "message" => $participants["error"],
  ], 404);
}

$stmt = $db->prepare(
  "SELECT u.id AS rider_id, u.fullName AS full_name, u.phone, u.image_url, rd.rating
   FROM users u
   LEFT JOIN rider_documents rd ON rd.rider_id = u.id
   WHERE u.id = ?");
$stmt->bind_param("i", $participants["rider_id"]);
$stmt->execute();
$result = $stmt->get_result();
$rider = $result ? $result->fetch_assoc() : null;
$stmt->close();

if (!$rider) {
  chat_json_response([
    "status" => "error",
    "message" => "Rider not found",
  ], 404);
}

chat_json_response([
  "status" => "success",
  "rider" => $rider,
]);
