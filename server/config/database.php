<?php

// Database credentials
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "purrqueuedb";
$db_charset = "utf8mb4";

try {
    // Create DSN (Data Source Name)
    $dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset";
    
    // Create PDO connection with error mode
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
} catch (PDOException $e) {
    // Log error in production, but don't expose details
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => $e->getMessage()
    ]);
    exit;
}
?>
