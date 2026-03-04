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
require_once '../src/ApplicationRepository.php';

try {
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Extract cat ID from query string
    $cat_id = isset($_GET['cat_id']) ? (int)$_GET['cat_id'] : null;
    
    // ==================== GET REQUESTS ====================
    if ($method === 'GET') {
        // Check if cat ID is provided
        if (!$cat_id) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Cat ID is required (use ?cat_id={id})'
            ]);
            exit;
        }
        
        // Initialize repository
        $applicationRepository = new ApplicationRepository($pdo);
        
        try {
            // Check if cat exists
            if (!$applicationRepository->catExists($cat_id)) {
                http_response_code(404);
                echo json_encode([
                    'error' => 'Not found',
                    'message' => "Cat with ID $cat_id not found"
                ]);
                exit;
            }
            
            // Get applications for this cat
            $applications = $applicationRepository->getApplicationsByCat($cat_id);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'count' => count($applications),
                'data' => $applications
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
