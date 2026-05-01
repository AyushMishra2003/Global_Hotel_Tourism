<?php
// backend/api/blogs.php
// Handles blog CRUD and listing
session_start();
header('Content-Type: application/json');
require_once '../config/database.php';

function isAuthenticated() {
    return isset($_SESSION['user_id']);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List or detail
    if (isset($_GET['id'])) {
        // Get single blog
        $stmt = $pdo->prepare('SELECT * FROM blogs WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($blog) {
            echo json_encode(['success' => true, 'blog' => $blog]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Blog not found']);
        }
    } else {
        // List all blogs
        $stmt = $pdo->query('SELECT id, title, excerpt, created_at FROM blogs ORDER BY created_at DESC');
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'blogs' => $blogs]);
    }
    exit;
}

if (!isAuthenticated()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($method === 'POST') {
    // Create blog
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare('INSERT INTO blogs (title, excerpt, content) VALUES (?, ?, ?)');
    $stmt->execute([$data['title'], $data['excerpt'], $data['content']]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}
if ($method === 'PUT') {
    // Edit blog
    parse_str(file_get_contents('php://input'), $data);
    $stmt = $pdo->prepare('UPDATE blogs SET title=?, excerpt=?, content=? WHERE id=?');
    $stmt->execute([$data['title'], $data['excerpt'], $data['content'], $data['id']]);
    echo json_encode(['success' => true]);
    exit;
}
if ($method === 'DELETE') {
    // Delete blog
    parse_str(file_get_contents('php://input'), $data);
    $stmt = $pdo->prepare('DELETE FROM blogs WHERE id=?');
    $stmt->execute([$data['id']]);
    echo json_encode(['success' => true]);
    exit;
}
