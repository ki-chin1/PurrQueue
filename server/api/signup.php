<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

// Include dependencies
require_once '../config/database.php';
require_once '../src/UserRepository.php';

try {
    // Initialize repository
    $userRepository = new UserRepository($pdo);
    
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // ==================== POST REQUESTS ====================
    if ($method === 'POST') {
        // Get JSON body
        $json_input = file_get_contents('php://input');
        $data = json_decode($json_input, true);
        
        // Validate JSON
        if ($data === null) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Invalid JSON format'
            ]);
            exit;
        }
        
        // Create user (signup)
        try {
            $new_user = $userRepository->signup($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => $new_user
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Validation error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ==================== UNSUPPORTED METHODS ====================
    else {
        http_response_code(405);
        echo json_encode([
            'error' => 'Method not allowed',
            'message' => 'Only POST requests are supported'
        ]);
    }
    
} catch (Exception $e) {
    // Database or application error
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
    exit;
}
?>
