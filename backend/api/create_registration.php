<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

if ($conn === null) {
    http_response_code(503);
    echo json_encode(["message" => "Database connection failed."]);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// Basic validation
if (
    !isset($data->businessName) || !isset($data->category) || !isset($data->city) ||
    !isset($data->contactPersonName) || !isset($data->email) || !isset($data->phone)
) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. Please fill all required fields."]);
    exit();
}

$query = "INSERT INTO vendor_registrations SET
            business_name=:business_name, category=:category, city=:city,
            contact_person_name=:contact_person_name, email=:email, phone=:phone,
            address=:address, description=:description, established_year=:established_year,
            capacity=:capacity, price_range_min=:price_range_min, price_range_max=:price_range_max,
            amenities=:amenities, website=:website, social_media=:social_media, specializations=:specializations";

$stmt = $conn->prepare($query);

// Sanitize and bind the data
$stmt->bindParam(":business_name", $data->businessName);
$stmt->bindParam(":category", $data->category);
$stmt->bindParam(":city", $data->city);
$stmt->bindParam(":contact_person_name", $data->contactPersonName);
$stmt->bindParam(":email", $data->email);
$stmt->bindParam(":phone", $data->phone);
$stmt->bindParam(":address", $data->address);
$stmt->bindParam(":description", $data->description);
$stmt->bindParam(":established_year", $data->establishedYear);
$stmt->bindParam(":capacity", $data->capacity);
$stmt->bindParam(":price_range_min", $data->priceRangeMin);
$stmt->bindParam(":price_range_max", $data->priceRangeMax);
$stmt->bindParam(":amenities", $data->amenities);
$stmt->bindParam(":website", $data->website);
$stmt->bindParam(":social_media", $data->socialMedia);
$stmt->bindParam(":specializations", $data->specializations);

// Attempt to execute the query
if ($stmt->execute()) {
    http_response_code(201); // 201 Created
    echo json_encode(["message" => "Registration was successful."]);
} else {
    // This is the new error reporting part
    http_response_code(503); // 503 Service Unavailable
    $errorInfo = $stmt->errorInfo();
    echo json_encode([
        "message" => "Unable to create registration.",
        "error" => $errorInfo[2] // This will give the actual MySQL error message
    ]);
}
?>