CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  image_url VARCHAR(512) NULL,
  phone VARCHAR(32) NULL
);

CREATE TABLE rider_documents (
  rider_id INT UNSIGNED NOT NULL PRIMARY KEY,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  isAvailable TINYINT(1) NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_rider_documents_available (isAvailable)
);

CREATE TABLE packages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_packages_user (user_id)
);

CREATE TABLE ride_requests (
  id INT(11) NOT NULL AUTO_INCREMENT,
  order_id VARCHAR(64) DEFAULT NULL,
  passenger_id INT(11) NOT NULL,
  rider_id INT(11) DEFAULT NULL,
  passenger_fare INT(11) DEFAULT 0,
  rider_fare INT(11) DEFAULT NULL,
  final_fare INT(11) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ride_requests_order (order_id),
  KEY idx_ride_requests_passenger (passenger_id),
  KEY idx_ride_requests_rider (rider_id),
  KEY idx_ride_requests_status (status)
);

CREATE TABLE chat_sessions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  package_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  rider_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_chat_sessions_package (package_id),
  KEY idx_chat_sessions_user (user_id),
  KEY idx_chat_sessions_rider (rider_id)
);

CREATE TABLE chat_messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  chat_id INT UNSIGNED NOT NULL,
  sender_id INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  package_id INT UNSIGNED NOT NULL,
  content TEXT NULL,
  audio_url VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_chat_messages_chat (chat_id),
  KEY idx_chat_messages_package (package_id)
);
