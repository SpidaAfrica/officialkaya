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

$pickup_lat = isset($_POST['pickup_lat']) ? (float) $_POST['pickup_lat'] : null;
$pickup_lng = isset($_POST['pickup_lng']) ? (float) $_POST['pickup_lng'] : null;
$user_id = isset($_POST['user_id']) ? (int) $_POST['user_id'] : null;
$max_distance_km = isset($_POST['radius_km']) ? (float) $_POST['radius_km'] : 10.0;
$limit = isset($_POST['limit']) ? (int) $_POST['limit'] : 5;

if (!$pickup_lat || !$pickup_lng || !$user_id) {
  echo json_encode(["status" => "error", "message" => "Missing pickup coordinates or user ID"]);
  exit;
}

$max_distance_km = max(1, $max_distance_km);
$limit = max(1, min($limit, 50));

$sql = "
SELECT 
  (SELECT id FROM packages WHERE user_id = ? ORDER BY id DESC LIMIT 1) AS package_id,
  rd.rider_id, 
  u.fullName, 
  u.image_url, 
  u.phone,
  rd.rating, 
  rd.latitude,
  rd.longitude
FROM rider_documents rd
INNER JOIN users u ON u.id = rd.rider_id
WHERE rd.isAvailable = 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
  echo json_encode(["status" => "error", "message" => "Query failed", "error" => $conn->error]);
  exit;
}

$nearby_riders = [];

while ($row = $result->fetch_assoc()) {
  $distance = haversineDistance($pickup_lat, $pickup_lng, (float) $row['latitude'], (float) $row['longitude']);

  if ($distance <= $max_distance_km) {
    $row['distance'] = round($distance, 2);
    $row['is_online'] = true;
    unset($row['latitude'], $row['longitude']);
    $nearby_riders[] = $row;
  }
}

usort($nearby_riders, fn($a, $b) => $a['distance'] <=> $b['distance']);
$nearby_riders = array_slice($nearby_riders, 0, $limit);

echo json_encode([
  "status" => "success",
  "riders" => $nearby_riders,
  "online_count" => count($nearby_riders),
]);
