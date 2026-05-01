<?php
/**
 * API endpoint to fetch all vendors from the database.
 *
 * This script connects to the database, queries the 'vendors' table,
 * and returns the data as a JSON array. It uses SQL aliases to
 * rename columns to a camelCase format for the frontend.
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
    // If connection failed, output a JSON error message and exit
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database connection failed."]);
    exit(); // Stop script execution
}

try {
    // Prepare the SQL query with aliases for frontend consumption
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
                            FROM vendors';

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Debug: Output vendor count
    if (isset($_GET['debug'])) {
        echo json_encode(['debug_count' => count($vendors), 'vendors' => $vendors]);
        exit();
    }

    http_response_code(200); // OK
    echo json_encode($vendors);
    exit();

} catch(PDOException $exception) {
    // If there is an error with the query, output a JSON error message
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Unable to retrieve vendor data.", "error" => $exception->getMessage()]);
    exit();
}
?>