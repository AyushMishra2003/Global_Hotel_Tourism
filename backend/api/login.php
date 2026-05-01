<?php
// backend/api/login.php
// Handles login and session (hardcoded user)
session_start();
header('Content-Type: application/json');

// Hardcoded credentials
$HARDCODED_USER = 'admin';
$HARDCODED_HASH = '$2y$10$wH1Qw6Qw6Qw6Qw6Qw6Qw6uQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6'; // Replace with your password hash

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username === $HARDCODED_USER && password_verify($password, $HARDCODED_HASH)) {
    $_SESSION['user_id'] = $HARDCODED_USER;
    echo json_encode(['success' => true]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
}
