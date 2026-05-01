<?php
/**
 * API endpoint to fetch detailed vendor profile by ID
 * Used for public vendor profile pages
 */

// Hide PHP errors from output
ini_set('display_errors', 0);
error_reporting(E_ERROR);

// Set headers for CORS and JSON content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database configuration
require_once '../config/database.php';

// Check if the database connection is established
if ($conn === null) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database connection failed."]);
    exit();
}

// Get vendor ID from query parameter
$vendor_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($vendor_id <= 0) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Valid vendor ID is required."]);
    exit();
}

try {
    // Prepare the SQL query for single vendor with all fields
    $query = 'SELECT 
                    id,
                    vendor_name AS vendorName,
                    contact_person_name AS contactPersonName,
                    website_url AS websiteUrl,
                    category,
                    city,
                    phone,
                    email,
                    image_url AS imageUrl,
                    description,
                    featured,
                    about_description AS aboutDescription,
                    outdoor_price AS outdoorPrice,
                    indoor_price AS indoorPrice,
                    service_areas AS serviceAreas,
                    occasions,
                    gallery_images AS galleryImages,
                    social_media AS socialMedia,
                    contact_address AS contactAddress,
                    years_experience AS yearsExperience,
                    team_size AS teamSize,
                    specialties,
                    created_at AS createdAt
                FROM vendors 
                WHERE id = ?';

    $stmt = $conn->prepare($query);
    $stmt->execute([$vendor_id]);

    $vendor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$vendor) {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "Vendor not found."]);
        exit();
    }

    // Parse JSON fields if they exist
    if ($vendor['occasions']) {
        $vendor['occasions'] = json_decode($vendor['occasions'], true) ?: [];
    } else {
        $vendor['occasions'] = [];
    }

    if ($vendor['galleryImages']) {
        $vendor['galleryImages'] = json_decode($vendor['galleryImages'], true) ?: [];
    } else {
        $vendor['galleryImages'] = [];
    }

    if ($vendor['socialMedia']) {
        $vendor['socialMedia'] = json_decode($vendor['socialMedia'], true) ?: [];
    } else {
        $vendor['socialMedia'] = [];
    }

    // Convert featured to boolean
    $vendor['featured'] = (bool) $vendor['featured'];

    http_response_code(200); // OK
    echo json_encode($vendor);
    exit();

} catch(PDOException $exception) {
    // If there is an error with the query, output a JSON error message
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Unable to retrieve vendor data.", "error" => $exception->getMessage()]);
    exit();
}
?>