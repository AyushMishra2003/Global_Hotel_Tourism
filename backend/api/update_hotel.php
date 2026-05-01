<?php
require_once '../config/database.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing hotel id']);
    exit;
}
$sql = "UPDATE hotels SET hotel_name=?, parent_company=?, sub_brand=?, city=?, state=?, description=?, website_url=?, hero_image_url=?, country=? WHERE id=?";
$stmt = $conn->prepare($sql);
        $id = $data['id'];
        // Accept both camelCase and snake_case keys
        $map = [
            'hotelName' => 'hotel_name', 'hotel_name' => 'hotel_name',
            'parentCompany' => 'parent_company', 'parent_company' => 'parent_company',
            'subBrand' => 'sub_brand', 'sub_brand' => 'sub_brand',
            'city' => 'city',
            'state' => 'state',
            'description' => 'description',
            'websiteUrl' => 'website_url', 'website_url' => 'website_url',
            'heroImageUrl' => 'hero_image_url', 'hero_image_url' => 'hero_image_url',
            'country' => 'country'
        ];
        $fields = [];
        $values = [];
        $used = [];
        foreach ($map as $key => $snake) {
            if (isset($data[$key]) && !in_array($snake, $used)) {
                $fields[] = "$snake = ?";
                $values[] = $data[$key];
                $used[] = $snake;
            }
        }
        if (empty($fields)) {
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            exit;
        }

        try {
            $sql = "UPDATE hotels SET ".implode(", ", $fields)." WHERE id = ?";
            $values[] = $id;
            $stmt = $conn->prepare($sql);
            $log = [
                'sql' => $sql,
                'values' => $values,
                'input' => $data
            ];
            if ($stmt->execute($values)) {
                $rowCount = $stmt->rowCount();
                echo json_encode(['success' => true, 'rows_affected' => $rowCount, 'debug' => $log]);
            } else {
                $errorInfo = $stmt->errorInfo();
                echo json_encode(['success' => false, 'error' => $errorInfo[2], 'debug' => $log]);
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage(), 'debug' => $log]);
        }
