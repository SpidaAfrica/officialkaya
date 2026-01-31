<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../shared/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$riderId = isset($input["rider_id"]) ? (int) $input["rider_id"] : 0;

if ($riderId <= 0) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Missing rider_id"]);
  exit;
}

$stmt = $db->prepare("UPDATE rider_documents SET onboarding_completed = 1, onboarding_completed_at = NOW() WHERE rider_id = ?");
$stmt->bind_param("i", $riderId);
$stmt->execute();
$stmt->close();

echo json_encode([
  "success" => true,
  "message" => "Onboarding marked as completed",
]);
