<?php
// Hardcoded admin login for demonstration
session_start();

$admins = [
    'admin@example.com' => 'global#123',
    'superuser@example.com' => 'supersecret'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    if (isset($admins[$email]) && $admins[$email] === $password) {
        $_SESSION['authenticated'] = true;
        $_SESSION['email'] = $email;
        $_SESSION['role'] = 'admin';
        echo json_encode(['success' => true, 'data' => ['email' => $email, 'role' => 'admin', 'authenticated' => true]]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);
