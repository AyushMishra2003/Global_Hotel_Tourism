<?php
/**
 * API endpoint to handle new vendor registrations.
 *
 * This script accepts POST requests with JSON data, validates and sanitizes
 * the input, and inserts it into the 'vendor_registrations' table.
 */

// Set required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Invalid request method. Only POST is accepted."]);
    exit();
}

// Include database configuration
require_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (empty($data)) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Unable to create vendor. Data is incomplete or invalid."]);
    exit();
}

try {
    // Prepare the SQL query
    $query = "INSERT INTO vendor_registrations (
                business_name, category, city, contact_person_name, email, phone, 
                address, description, established_year, capacity, price_range_min, 
                price_range_max, amenities, website, social_media, specializations
              ) VALUES (
                :business_name, :category, :city, :contact_person_name, :email, :phone, 
                :address, :description, :established_year, :capacity, :price_range_min, 
                :price_range_max, :amenities, :website, :social_media, :specializations
              )";

    $stmt = $conn->prepare($query);

    // Sanitize and bind data
    // Using null coalescing operator (??) to provide a default value if a key is missing
    $stmt->bindParam(":business_name", htmlspecialchars(strip_tags($data->business_name ?? '')));
    $stmt->bindParam(":category", htmlspecialchars(strip_tags($data->category ?? '')));
    $stmt->bindParam(":city", htmlspecialchars(strip_tags($data->city ?? '')));
    $stmt->bindParam(":contact_person_name", htmlspecialchars(strip_tags($data->contact_person_name ?? '')));
    $stmt->bindParam(":email", htmlspecialchars(strip_tags($data->email ?? '')));
    $stmt->bindParam(":phone", htmlspecialchars(strip_tags($data->phone ?? '')));
    $stmt->bindParam(":address", htmlspecialchars(strip_tags($data->address ?? '')));
    $stmt->bindParam(":description", htmlspecialchars(strip_tags($data->description ?? '')));
    $stmt->bindParam(":established_year", htmlspecialchars(strip_tags($data->established_year ?? null)));
    $stmt->bindParam(":capacity", htmlspecialchars(strip_tags($data->capacity ?? null)));
    $stmt->bindParam(":price_range_min", htmlspecialchars(strip_tags($data->price_range_min ?? null)));
    $stmt->bindParam(":price_range_max", htmlspecialchars(strip_tags($data->price_range_max ?? null)));
    $stmt->bindParam(":amenities", htmlspecialchars(strip_tags($data->amenities ?? '')));
    $stmt->bindParam(":website", htmlspecialchars(strip_tags($data->website ?? '')));
    $stmt->bindParam(":social_media", htmlspecialchars(strip_tags($data->social_media ?? '')));
    $stmt->bindParam(":specializations", htmlspecialchars(strip_tags($data->specializations ?? '')));

    // Execute the query
    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(["message" => "Vendor registration was successful."]);
    } else {
        // This part might be hard to reach if PDO is set to throw exceptions,
        // but it's good for completeness.
        http_response_code(503); // Service Unavailable
        echo json_encode(["message" => "Unable to register vendor."]);
    }
} catch (PDOException $exception) {
    http_response_code(503); // Service Unavailable
    // For a live environment, you might want to log the error message instead of echoing it.
    echo json_encode([
        "message" => "An error occurred while registering the vendor.",
        "error" => $exception->getMessage()
    ]);
}
?>