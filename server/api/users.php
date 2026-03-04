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
    // Initialize repository
    $userRepository = new UserRepository($pdo);
    
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Extract ID from query string
    $user_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    // ==================== GET REQUESTS ====================
    if ($method === 'GET') {
        // Route: GET /api/users.php?id={id} - Get single user detail
        if ($user_id) {
            try {
                $user = $userRepository->getUserById($user_id);
                
                if (!$user) {
                    http_response_code(404);
                    echo json_encode([
                        'error' => 'Not found',
                        'message' => "User with ID $user_id not found"
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
        // Route: GET /api/users.php - Get all users
        else {
            try {
                $users = $userRepository->getAllUsers();
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'count' => count($users),
                    'data' => $users
                ]);
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
            }
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
