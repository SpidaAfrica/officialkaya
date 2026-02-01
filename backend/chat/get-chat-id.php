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

$session = chat_get_or_create_session($db, $packageId);
if (isset($session["error"])) {
  chat_json_response([
    "status" => "error",
    "message" => $session["error"],
  ], 404);
}

chat_json_response([
  "status" => "success",
  "chat_id" => $session["chat_id"],
  "user_id" => $session["user_id"],
  "rider_id" => $session["rider_id"],
]);
