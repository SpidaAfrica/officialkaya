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

function haversineDistance($lat1, $lon1, $lat2, $lon2) {
  $earth_radius = 6371;

  $dLat = deg2rad($lat2 - $lat1);
  $dLon = deg2rad($lon2 - $lon1);

  $a = sin($dLat / 2) * sin($dLat / 2) +
       cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
       sin($dLon / 2) * sin($dLon / 2);

  $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
  return $earth_radius * $c;
}

$pickupLat = isset($_POST['pickup_lat']) ? (float) $_POST['pickup_lat'] : null;
$pickupLng = isset($_POST['pickup_lng']) ? (float) $_POST['pickup_lng'] : null;
$userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : null;
$orderId = isset($_POST['order_id']) ? trim((string) $_POST['order_id']) : "";
$maxDistanceKm = isset($_POST['radius_km']) ? (float) $_POST['radius_km'] : 10.0;
$limit = isset($_POST['limit']) ? (int) $_POST['limit'] : 5;

if (!$pickupLat || !$pickupLng || !$userId || $orderId === "") {
  echo json_encode(["status" => "error", "message" => "Missing pickup coordinates, user_id, or order_id"]);
  exit;
}

$maxDistanceKm = max(1, $maxDistanceKm);
$limit = max(1, min($limit, 50));

$sql = "
SELECT
  rd.rider_id,
  u.fullName,
  u.image_url,
  u.phone,
  rd.rating,
  rd.latitude,
  rd.longitude,
  rr.passenger_fare,
  rr.rider_fare,
  rr.status
FROM rider_documents rd
INNER JOIN users u ON u.id = rd.rider_id
LEFT JOIN ride_requests rr ON rr.order_id = ?
WHERE rd.isAvailable = 1
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Failed to prepare statement"]);
  exit;
}
$stmt->bind_param("s", $orderId);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
  echo json_encode(["status" => "error", "message" => "Query failed", "error" => $conn->error]);
  exit;
}

$nearbyRiders = [];
while ($row = $result->fetch_assoc()) {
  $distance = haversineDistance($pickupLat, $pickupLng, (float) $row['latitude'], (float) $row['longitude']);

  if ($distance <= $maxDistanceKm) {
    $row['distance'] = round($distance, 2);
    $row['is_online'] = true;
    unset($row['latitude'], $row['longitude']);
    $nearbyRiders[] = $row;
  }
}

usort($nearbyRiders, fn($a, $b) => $a['distance'] <=> $b['distance']);
$nearbyRiders = array_slice($nearbyRiders, 0, $limit);

echo json_encode([
  "status" => "success",
  "riders" => $nearbyRiders,
  "online_count" => count($nearbyRiders),
]);
