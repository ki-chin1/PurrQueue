<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

// Include dependencies
require_once '../config/database.php';
require_once '../src/ApplicationRepository.php';

try {
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Extract ID from query string
    $application_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    // ==================== GET REQUESTS ====================
    if ($method === 'GET') {
        // Check if application ID is provided
        if (!$application_id) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Application ID is required (use ?id={id})'
            ]);
            exit;
        }
        
        // Initialize repository
        $applicationRepository = new ApplicationRepository($pdo);
        
        try {
            // Get application by ID
            $application = $applicationRepository->getApplicationById($application_id);
            
            if (!$application) {
                http_response_code(404);
                echo json_encode([
                    'error' => 'Not found',
                    'message' => "Application with ID $application_id not found"
                ]);
                exit;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $application
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
