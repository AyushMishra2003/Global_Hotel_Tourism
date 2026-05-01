<?php
// Delete vendor logo and update DB
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/database.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['vendorId'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing vendorId."]);
    exit();
}
$vendorId = intval($data['vendorId']);
$stmt = $conn->prepare('SELECT image_url FROM vendors WHERE id = :id');
$stmt->bindParam(':id', $vendorId);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if ($row && $row['image_url']) {
    $file = '../../public' . $row['image_url'];
    if (file_exists($file)) unlink($file);
}
$stmt = $conn->prepare('UPDATE vendors SET image_url = NULL WHERE id = :id');
$stmt->bindParam(':id', $vendorId);
$stmt->execute();
echo json_encode(["success" => true]);
