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

$stmt = $db->prepare("SELECT onboarding_completed FROM rider_documents WHERE rider_id = ? LIMIT 1");
$stmt->bind_param("i", $riderId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result ? $result->fetch_assoc() : null;
$stmt->close();

if (!$row) {
  http_response_code(404);
  echo json_encode(["success" => false, "message" => "Rider documents not found"]);
  exit;
}

echo json_encode([
  "success" => true,
  "completed" => (bool) $row["onboarding_completed"],
]);
