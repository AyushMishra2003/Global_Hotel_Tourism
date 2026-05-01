<?php
// GHT_main/backend/config/database.php

$host = "localhost";
$db_name = "u492245504_global_hotel";
$username = "u492245504_global_hotel";
$password = "Global@2312";
$conn = null;

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    // On a live site, you might want to log this error instead of echoing it
    echo "Connection error: " . $exception->getMessage();
}
?>