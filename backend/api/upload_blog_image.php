<?php
// upload_blog_image.php - PHP version for uploading blog images

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Length');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration - Fix path to public/blogs directory
$uploadDir = __DIR__ . '/../../public/blogs/'; // Absolute path to public/blogs
$maxFileSize = 5 * 1024 * 1024; // 5MB
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Removed sendResponse function - using direct JSON responses

function generateFileName($originalName) {
    $timestamp = time();
    $cleanName = preg_replace('/[^a-z0-9.-]/i', '-', strtolower($originalName));
    return "blog-{$timestamp}-{$cleanName}";
}

// Handle POST request - Upload image
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // Debug: Log the request
        error_log("Upload request received");
        error_log("Files: " . print_r($_FILES, true));
        
        // Check if file was uploaded
        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No file field named "image" found']);
            exit();
        }
        
        if ($_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $errorMsg = 'Upload error: ';
            switch ($_FILES['image']['error']) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $errorMsg .= 'File too large';
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $errorMsg .= 'File partially uploaded';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $errorMsg .= 'No file uploaded';
                    break;
                default:
                    $errorMsg .= 'Unknown error (' . $_FILES['image']['error'] . ')';
            }
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $errorMsg]);
            exit();
        }

        $file = $_FILES['image'];
        
        // Validate file size
        if ($file['size'] > $maxFileSize) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'File size too large. Maximum 5MB allowed.']);
            exit();
        }
        
        // Validate file type
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.']);
            exit();
        }
        
        // Create upload directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to create upload directory']);
                exit();
            }
        }
        
        // Generate unique filename
        $fileName = generateFileName($file['name']);
        $filePath = $uploadDir . $fileName;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $imageUrl = "/blogs/{$fileName}";
            
            echo json_encode([
                'success' => true,
                'imageUrl' => $imageUrl,
                'fileName' => $fileName,
                'originalName' => $file['name'],
                'size' => $file['size']
            ]);
            exit();
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to save uploaded file'
            ]);
            exit();
        }
        
    } catch (Exception $e) {
        sendResponse(false, null, 'Internal server error: ' . $e->getMessage(), 500);
    }
}

// Handle DELETE request - Delete image
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    try {
        // Get filename from URL path
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', $path);
        $fileName = end($pathParts);
        
        // Validate filename (security)
        if (empty($fileName) || strpos($fileName, '..') !== false || strpos($fileName, 'blog-') !== 0) {
            sendResponse(false, null, 'Invalid filename', 400);
        }
        
        $filePath = $uploadDir . $fileName;
        
        // Check if file exists and delete it
        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                sendResponse(true, ['message' => 'Image deleted successfully']);
            } else {
                sendResponse(false, null, 'Failed to delete image', 500);
            }
        } else {
            sendResponse(false, null, 'Image not found', 404);
        }
        
    } catch (Exception $e) {
        sendResponse(false, null, 'Internal server error: ' . $e->getMessage(), 500);
    }
}

// Invalid method
sendResponse(false, null, 'Method not allowed', 405);
?>