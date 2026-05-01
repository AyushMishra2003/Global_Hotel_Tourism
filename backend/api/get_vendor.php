<?php
// Set headers for CORS and JSON content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/database.php';
if ($conn === null) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit();
}
if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Missing vendor id."]);
    exit();
}
$id = intval($_GET['id']);
try {
    $query = 'SELECT id, vendor_name AS vendorName, contact_person_name AS contactPersonName, website_url AS websiteUrl, category, city, phone, email, image_url AS imageUrl, description FROM vendors WHERE id = :id';
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $vendor = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($vendor) {
        http_response_code(200);
        echo json_encode($vendor);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Vendor not found."]);
    }
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to retrieve vendor data.", "error" => $exception->getMessage()]);
}
