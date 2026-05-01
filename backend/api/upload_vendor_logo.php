<?php
// Upload vendor logo and update DB
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/database.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed."]);
    exit();
}
if (!isset($_POST['vendorId']) || !isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing vendorId or image."]);
    exit();
}
$vendorId = intval($_POST['vendorId']);
$targetDir = '../../public/logos/';
if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
$ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
$filename = 'vendor_' . $vendorId . '_' . time() . '.' . $ext;
$targetFile = $targetDir . $filename;
if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to move uploaded file."]);
    exit();
}
$imageUrl = '/logos/' . $filename;
$stmt = $conn->prepare('UPDATE vendors SET image_url = :imageUrl WHERE id = :id');
$stmt->bindParam(':imageUrl', $imageUrl);
$stmt->bindParam(':id', $vendorId);
$stmt->execute();
echo json_encode(["success" => true, "imageUrl" => $imageUrl]);
