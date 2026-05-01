<?php
session_start();
if (isset($_SESSION['authenticated']) && $_SESSION['authenticated']) {
    echo json_encode(['success' => true, 'data' => [
        'email' => $_SESSION['email'] ?? '',
        'role' => $_SESSION['role'] ?? 'admin',
        'authenticated' => true
    ]]);
} else {
    echo json_encode(['success' => true, 'data' => ['authenticated' => false]]);
}
