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
$passengerId = isset($input["user_id"]) ? (int) $input["user_id"] : 0;
$fare = isset($input["fare"]) ? (int) $input["fare"] : 0;
$orderId = isset($input["order_id"]) ? trim((string) $input["order_id"]) : "";

if ($passengerId <= 0 && isset($_POST["user_id"])) {
  $passengerId = (int) $_POST["user_id"];
}
if ($fare <= 0 && isset($_POST["fare"])) {
  $fare = (int) $_POST["fare"];
}
if ($orderId === "" && isset($_POST["order_id"])) {
  $orderId = trim((string) $_POST["order_id"]);
}

if ($passengerId <= 0 || $fare <= 0 || $orderId === "") {
  echo json_encode(["status" => "error", "message" => "Missing data"]);
  exit;
}

$checkStmt = $conn->prepare("SELECT id FROM ride_requests WHERE order_id = ? LIMIT 1");
if (!$checkStmt) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Failed to prepare lookup statement"]);
  exit;
}
$checkStmt->bind_param("s", $orderId);
$checkStmt->execute();
$checkStmt->store_result();
$exists = $checkStmt->num_rows > 0;
$checkStmt->close();

if ($exists) {
  $stmt = $conn->prepare(
    "UPDATE ride_requests
     SET passenger_id = ?, passenger_fare = ?
     WHERE order_id = ?"
  );
  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare update statement"]);
    exit;
  }
  $stmt->bind_param("iis", $passengerId, $fare, $orderId);
  $stmt->execute();
  $stmt->close();
} else {
  $stmt = $conn->prepare(
    "INSERT INTO ride_requests (order_id, passenger_id, passenger_fare)
     VALUES (?, ?, ?)"
  );
  if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare insert statement"]);
    exit;
  }
  $stmt->bind_param("sii", $orderId, $passengerId, $fare);
  $stmt->execute();
  $stmt->close();
}

echo json_encode([
  "status" => "success",
  "message" => "Passenger fare inserted or updated.",
]);
