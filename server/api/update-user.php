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
    
    // ==================== PUT REQUESTS ====================
    if ($method === 'PUT') {
        // User ID is required for update
        if (!$user_id) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'User ID is required (use ?id={id})'
            ]);
            exit;
        }
        
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
        
        // Update user
        try {
            $updated_user = $userRepository->updateUser($user_id, $data);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $updated_user
            ]);
        } catch (Exception $e) {
            // Check if user not found
            if (strpos($e->getMessage(), 'not found') !== false) {
                http_response_code(404);
            } else {
                http_response_code(400);
            }
            
            echo json_encode([
                'error' => 'Error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ==================== UNSUPPORTED METHODS ====================
    else {
        http_response_code(405);
        echo json_encode([
            'error' => 'Method not allowed',
            'message' => 'Only PUT requests are supported'
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
