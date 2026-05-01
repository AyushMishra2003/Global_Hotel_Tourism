<?php
require_once '../config/database.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing hotel id']);
    exit;
}
$sql = "DELETE FROM hotels WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $data['id']);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conn->close();
