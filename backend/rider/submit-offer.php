<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require './config.php';

$input = json_decode(file_get_contents("php://input"), true);
$rideRequestId = isset($input["order_id"]) ? (int) $input["order_id"] : 0;
if ($rideRequestId <= 0 && isset($input["ride_request_id"])) {
  $rideRequestId = (int) $input["ride_request_id"];
}
$riderId = isset($input["rider_id"]) ? (int) $input["rider_id"] : 0;
$proposedFare = isset($input["proposed_fare"]) ? (int) $input["proposed_fare"] : 0;

if ($rideRequestId <= 0 && isset($_POST["order_id"])) {
  $rideRequestId = (int) $_POST["order_id"];
}
if ($rideRequestId <= 0 && isset($_POST["ride_request_id"])) {
  $rideRequestId = (int) $_POST["ride_request_id"];
}
if ($riderId <= 0 && isset($_POST["rider_id"])) {
  $riderId = (int) $_POST["rider_id"];
}
if ($proposedFare <= 0 && isset($_POST["proposed_fare"])) {
  $proposedFare = (int) $_POST["proposed_fare"];
}
if ($rideRequestId <= 0 || $riderId <= 0 || $proposedFare <= 0) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Missing order_id, rider_id, or proposed_fare",
  ]);
  exit;
}

$checkStmt = $conn->prepare("SELECT id FROM ride_requests WHERE id = ? LIMIT 1");
if (!$checkStmt) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Failed to prepare lookup statement",
  ]);
  exit;
}
$checkStmt->bind_param("i", $rideRequestId);
$checkStmt->execute();
$checkStmt->store_result();
$exists = $checkStmt->num_rows > 0;
$checkStmt->close();

if (!$exists) {
  http_response_code(404);
  echo json_encode([
    "success" => false,
    "message" => "Ride request not found",
  ]);
  exit;
}

$stmt = $conn->prepare(
  "UPDATE ride_requests
   SET rider_id = ?, rider_fare = ?
   WHERE id = ?"
);
if (!$stmt) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Failed to prepare update statement",
  ]);
  exit;
}

$stmt->bind_param("iii", $riderId, $proposedFare, $rideRequestId);
$stmt->execute();
$stmt->close();

echo json_encode([
  "success" => true,
  "message" => "Offer submitted",
]);
