<?php
// Simulate OTP for hardcoded admin
session_start();
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$otp = '123456';
$_SESSION['otp'] = $otp;
$_SESSION['email'] = $email;
echo json_encode(['success' => true, 'data' => ['dev_debug_otp' => $otp]]);
