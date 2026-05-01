<?php
/**
 * API endpoint to fetch all hotels from the database.
 *
 * This script connects to the database, queries the 'hotels' table,
 * and returns the data as a JSON array. It renames the columns
 * in the SQL query to match the expected frontend JSON keys.
 */

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
    // Prepare the SQL query with aliases to match frontend expectations
    // This version includes all the fields needed by the frontend.
        $query = 'SELECT 
                                id,
                                city,
                                state,
                                country,
                                parent_company,
                                sub_brand,
                                hotel_name,
                                description,
                                website_url,
                                hero_image_url
                            FROM hotels';

    $stmt = $conn->prepare($query);
    $stmt->execute();

    // Fetch all results as an associative array
    $hotels = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode($hotels);

} catch(PDOException $exception) {
    // If there is an error with the query, output a JSON error message
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Unable to retrieve data.", "error" => $exception->getMessage()]);
}
?>