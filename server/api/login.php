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
    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
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
        
        // Validate required fields
        if (!isset($data['email']) || trim($data['email']) === '') {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Email is required'
            ]);
            exit;
        }
        
        if (!isset($data['password']) || trim($data['password']) === '') {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Password is required'
            ]);
            exit;
        }
        
        // Login user
        try {
            $user = $userRepository->login($data['email'], $data['password']);
            
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['role'] = $user['role'];
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'data' => $user
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                'error' => 'Authentication error',
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
