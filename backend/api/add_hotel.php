<?php
require_once '../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data provided']);
    exit;
}
// Map camelCase to snake_case
$map = [
    'hotel_name' => 'hotel_name',
    'parent_company' => 'parent_company',
    'sub_brand' => 'sub_brand',
    'city' => 'city',
    'state' => 'state',
    'description' => 'description',
    'website_url' => 'website_url',
    'hero_image_url' => 'hero_image_url',
    'country' => 'country'
];
$fields = [];
$values = [];
foreach ($map as $camel => $snake) {
    if (isset($data[$camel])) {
        $fields[] = $snake;
        $values[] = $data[$camel];
    }
}
if (empty($fields)) {
    echo json_encode(['success' => false, 'error' => 'No fields to insert']);
    exit;
}
$placeholders = rtrim(str_repeat('?,', count($fields)), ',');
$sql = "INSERT INTO hotels (".implode(",", $fields).") VALUES ($placeholders)";
try {
    $stmt = $conn->prepare($sql);
    if ($stmt->execute($values)) {
        echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
    } else {
        $errorInfo = $stmt->errorInfo();
        echo json_encode(['success' => false, 'error' => $errorInfo[2]]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
