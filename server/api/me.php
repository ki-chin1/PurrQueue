<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

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
    
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // ==================== GET REQUESTS ====================
    if ($method === 'GET') {
        // Check if user is authenticated (has session user_id)
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'error' => 'Unauthorized',
                'message' => 'User is not authenticated. Please login first.'
            ]);
            exit;
        }
        
        // Initialize repository
        $userRepository = new UserRepository($pdo);
        
        try {
            // Get current user from database
            $user = $userRepository->getUserById($_SESSION['user_id']);
            
            if (!$user) {
                http_response_code(401);
                echo json_encode([
                    'error' => 'Unauthorized',
                    'message' => 'User not found. Session may be invalid.'
                ]);
                exit;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $user
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ==================== UNSUPPORTED METHODS ====================
    else {
        http_response_code(405);
        echo json_encode([
            'error' => 'Method not allowed',
            'message' => 'Only GET requests are supported'
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
