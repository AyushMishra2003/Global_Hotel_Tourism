<?php
require_once '../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) {
        echo json_encode(['success' => false, 'error' => 'Missing vendor id']);
        exit;
}
$id = $data['id'];
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
    'description' => 'description',
    'featured' => 'featured',
    'aboutDescription' => 'about_description',
    'outdoorPrice' => 'outdoor_price',
    'indoorPrice' => 'indoor_price',
    'serviceAreas' => 'service_areas',
    'occasions' => 'occasions',
    'galleryImages' => 'gallery_images',
    'socialMedia' => 'social_media',
    'contactAddress' => 'contact_address',
    'yearsExperience' => 'years_experience',
    'teamSize' => 'team_size',
    'specialties' => 'specialties'
];
$fields = [];
$values = [];
foreach ($map as $camel => $snake) {
    if (isset($data[$camel])) {
        $fields[] = "$snake = ?";
        // Handle JSON fields
        if (in_array($snake, ['occasions', 'gallery_images', 'social_media'])) {
            $values[] = is_array($data[$camel]) ? json_encode($data[$camel]) : $data[$camel];
        } else if ($snake === 'featured') {
            // Ensure featured is boolean (0 or 1)
            $values[] = $data[$camel] ? 1 : 0;
        } else {
            $values[] = $data[$camel];
        }
    }
}
if (empty($fields)) {
    echo json_encode(['success' => false, 'error' => 'No fields to update']);
    exit;
}

try {
    $sql = "UPDATE vendors SET ".implode(", ", $fields)." WHERE id = ?";
    $values[] = $id;
    $stmt = $conn->prepare($sql);
    if ($stmt->execute($values)) {
        echo json_encode(['success' => true]);
    } else {
        $errorInfo = $stmt->errorInfo();
        echo json_encode(['success' => false, 'error' => $errorInfo[2]]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
