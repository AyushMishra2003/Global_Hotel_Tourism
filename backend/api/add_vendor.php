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
    'vendorName' => 'vendor_name',
    'contactPersonName' => 'contact_person_name',
    'category' => 'category',
    'city' => 'city',
    'phone' => 'phone',
    'email' => 'email',
    'websiteUrl' => 'website_url',
    'imageUrl' => 'image_url',
    'description' => 'description'
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
$sql = "INSERT INTO vendors (".implode(",", $fields).") VALUES ($placeholders)";
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
