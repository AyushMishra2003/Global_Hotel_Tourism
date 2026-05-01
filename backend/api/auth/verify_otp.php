<?php
session_start();
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$otp = $data['otp'] ?? '';
if (isset($_SESSION['otp']) && $_SESSION['otp'] === $otp && $_SESSION['email'] === $email) {
    $_SESSION['authenticated'] = true;
    $_SESSION['role'] = 'admin';
    echo json_encode(['success' => true, 'data' => ['email' => $email, 'role' => 'admin', 'authenticated' => true]]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid OTP']);
}
