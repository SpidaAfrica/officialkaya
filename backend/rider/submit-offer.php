<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../shared/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$rideRequestId = isset($input["order_id"]) ? (int) $input["order_id"] : 0;
$riderId = isset($input["rider_id"]) ? (int) $input["rider_id"] : 0;
$proposedFare = isset($input["proposed_fare"]) ? (int) $input["proposed_fare"] : 0;

if ($rideRequestId <= 0 || $riderId <= 0 || $proposedFare <= 0) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Missing order_id, rider_id, or proposed_fare",
  ]);
  exit;
}

$stmt = $db->prepare(
  "UPDATE ride_requests
   SET rider_id = ?, rider_fare = ?
   WHERE id = ?"
);
$stmt->bind_param("iii", $riderId, $proposedFare, $rideRequestId);
$stmt->execute();
$affectedRows = $stmt->affected_rows;
$stmt->close();

if ($affectedRows === 0) {
  http_response_code(404);
  echo json_encode([
    "success" => false,
    "message" => "Ride request not found",
  ]);
  exit;
}

echo json_encode([
  "success" => true,
  "message" => "Offer submitted",
]);
