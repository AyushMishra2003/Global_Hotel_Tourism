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
    echo json_encode(["message" => "Missing hotel id."]);
    exit();
}
$id = intval($_GET['id']);
try {
    $query = 'SELECT id, city, state, country, parent_company, sub_brand, hotel_name, description, website_url, hero_image_url FROM hotels WHERE id = :id';
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $hotel = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($hotel) {
        http_response_code(200);
        echo json_encode($hotel);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Hotel not found."]);
    }
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to retrieve hotel data.", "error" => $exception->getMessage()]);
}
