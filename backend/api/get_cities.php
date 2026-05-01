<?php
/**
 * API endpoint to fetch all cities from the new 'cities' table.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

if ($conn === null) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit();
}

try {
    $query = 'SELECT id, name, slug, hero_image_url as image, tagline FROM cities ORDER BY name ASC';

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $cities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($cities);

} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to retrieve city data.", "error" => $exception->getMessage()]);
}
?>
