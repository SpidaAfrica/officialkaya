<?php
$dbHost = getenv("KAYA_DB_HOST") ?: "127.0.0.1";
$dbName = getenv("KAYA_DB_NAME") ?: "kaya";
$dbUser = getenv("KAYA_DB_USER") ?: "kaya_user";
$dbPass = getenv("KAYA_DB_PASS") ?: "kaya_pass";
$dbPort = getenv("KAYA_DB_PORT") ?: 3306;

$db = new mysqli($dbHost, $dbUser, $dbPass, $dbName, (int) $dbPort);

if ($db->connect_error) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed",
  ]);
  exit;
}

$db->set_charset("utf8mb4");
