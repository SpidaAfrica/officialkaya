<?php
require_once __DIR__ . "/../shared/db.php";

function chat_set_headers(): void {
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");

  if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
  }
}

function chat_json_response(array $payload, int $statusCode = 200): void {
  http_response_code($statusCode);
  echo json_encode($payload);
  exit;
}

function chat_request_body(): array {
  $contentType = $_SERVER["CONTENT_TYPE"] ?? "";
  if (stripos($contentType, "application/json") !== false) {
    $raw = file_get_contents("php://input");
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
      return $decoded;
    }
  }

  return $_POST;
}

function chat_get_int(array $source, string $key): ?int {
  if (!isset($source[$key])) {
    return null;
  }
  $value = (int) $source[$key];
  return $value > 0 ? $value : null;
}

function chat_get_package_id(): ?int {
  if (isset($_GET["package_id"])) {
    $value = (int) $_GET["package_id"];
    return $value > 0 ? $value : null;
  }

  $body = chat_request_body();
  return chat_get_int($body, "package_id");
}

function chat_fetch_participants(mysqli $db, int $packageId): array {
  $stmt = $db->prepare("SELECT user_id FROM packages WHERE id = ? LIMIT 1");
  $stmt->bind_param("i", $packageId);
  $stmt->execute();
  $stmt->bind_result($userId);
  if (!$stmt->fetch()) {
    $stmt->close();
    return ["error" => "Package not found."];
  }
  $stmt->close();

  $stmt = $db->prepare(
    "SELECT rider_id FROM ride_requests WHERE passenger_id = ? AND rider_id IS NOT NULL ORDER BY created_at DESC LIMIT 1"
  );
  $stmt->bind_param("i", $userId);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result ? $result->fetch_assoc() : null;
  $stmt->close();

  if (!$row || empty($row["rider_id"])) {
    return ["error" => "No accepted rider found for this passenger."];
  }

  return [
    "user_id" => (int) $userId,
    "rider_id" => (int) $row["rider_id"],
  ];
}

function chat_get_or_create_session(mysqli $db, int $packageId): array {
  $stmt = $db->prepare("SELECT id, user_id, rider_id FROM chat_sessions WHERE package_id = ? LIMIT 1");
  $stmt->bind_param("i", $packageId);
  $stmt->execute();
  $result = $stmt->get_result();
  $existing = $result ? $result->fetch_assoc() : null;
  $stmt->close();

  if ($existing) {
    return [
      "chat_id" => (int) $existing["id"],
      "user_id" => (int) $existing["user_id"],
      "rider_id" => (int) $existing["rider_id"],
    ];
  }

  $participants = chat_fetch_participants($db, $packageId);
  if (isset($participants["error"])) {
    return $participants;
  }

  $stmt = $db->prepare("INSERT INTO chat_sessions (package_id, user_id, rider_id) VALUES (?, ?, ?)");
  $stmt->bind_param("iii", $packageId, $participants["user_id"], $participants["rider_id"]);
  if (!$stmt->execute()) {
    $stmt->close();
    return ["error" => "Unable to create chat session."];
  }
  $chatId = $stmt->insert_id;
  $stmt->close();

  return [
    "chat_id" => (int) $chatId,
    "user_id" => $participants["user_id"],
    "rider_id" => $participants["rider_id"],
  ];
}
?>
