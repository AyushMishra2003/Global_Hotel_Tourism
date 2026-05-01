<?php
// Delete hotel hero image and update DB
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/database.php';
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['hotelId'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing hotelId."]);
    exit();
}
$hotelId = intval($data['hotelId']);
$stmt = $conn->prepare('SELECT hero_image_url FROM hotels WHERE id = :id');
$stmt->bindParam(':id', $hotelId);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if ($row && $row['hero_image_url']) {
    $file = '../../public' . $row['hero_image_url'];
    if (file_exists($file)) unlink($file);
}
$stmt = $conn->prepare('UPDATE hotels SET hero_image_url = NULL WHERE id = :id');
$stmt->bindParam(':id', $hotelId);
$stmt->execute();
echo json_encode(["success" => true]);
