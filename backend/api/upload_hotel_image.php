<?php
// Upload hotel hero image and update DB

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once '../config/database.php';

$debug = [];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed.", "debug" => $debug]);
    exit();
}

if (!isset($_POST['hotelId'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing hotelId.", "debug" => $debug, "_POST" => $_POST, "_FILES" => $_FILES]);
    exit();
}
if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing image file.", "debug" => $debug, "_POST" => $_POST, "_FILES" => $_FILES]);
    exit();
}

$hotelId = intval($_POST['hotelId']);
        $targetDir = '../../hotel-images/';
$debug['targetDir'] = $targetDir;

if (!is_dir($targetDir)) {
    $debug['mkdir_attempt'] = true;
    $mk = mkdir($targetDir, 0777, true);
    $debug['mkdir_result'] = $mk;
    if (!$mk) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to create target directory.", "debug" => $debug]);
        exit();
    }
}

$ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
$filename = 'hotel_' . $hotelId . '_' . time() . '.' . $ext;
$targetFile = $targetDir . $filename;
$debug['targetFile'] = $targetFile;
$debug['tmp_name'] = $_FILES['image']['tmp_name'];
$debug['file_error'] = $_FILES['image']['error'];
$debug['file_size'] = $_FILES['image']['size'];
$debug['file_type'] = $_FILES['image']['type'];

if (!is_uploaded_file($_FILES['image']['tmp_name'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "File is not a valid uploaded file.",
        "debug" => $debug,
        "_POST" => $_POST,
        "_FILES" => $_FILES
    ]);
    exit();
}

if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    http_response_code(500);
    $debug['move_uploaded_file_last_error'] = error_get_last();
    echo json_encode([
        "success" => false,
        "error" => "Failed to move uploaded file.",
        "debug" => $debug,
        "_POST" => $_POST,
        "_FILES" => $_FILES
    ]);
    exit();
}

$hero_image_url = '/hotel-images/' . $filename;
$debug['hero_image_url'] = $hero_image_url;

try {
    $stmt = $conn->prepare('UPDATE hotels SET hero_image_url = :img WHERE id = :id');
    $stmt->bindParam(':img', $hero_image_url);
    $stmt->bindParam(':id', $hotelId);
    $result = $stmt->execute();
    $debug['db_update_result'] = $result;
    if (!$result) {
        $debug['db_error_info'] = $stmt->errorInfo();
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Failed to update database.",
            "debug" => $debug
        ]);
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    $debug['db_exception'] = $e->getMessage();
    echo json_encode([
        "success" => false,
        "error" => "Exception during DB update.",
        "debug" => $debug
    ]);
    exit();
}

echo json_encode(["success" => true, "hero_image_url" => $hero_image_url, "debug" => $debug]);
