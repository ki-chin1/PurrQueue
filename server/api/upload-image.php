<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

// Include dependencies
require_once '../config/database.php';
require_once '../src/ImageRepository.php';

try {
    // Initialize repository
    $imageRepository = new ImageRepository($pdo);
    
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
        
        // Check if cat_id is provided
        if (!isset($data['cat_id']) || (int)$data['cat_id'] === 0) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Cat ID is required'
            ]);
            exit;
        }
        
        // Check if image_url is provided
        if (!isset($data['image_url']) || trim($data['image_url']) === '') {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Image URL is required'
            ]);
            exit;
        }
        
        $cat_id = (int)$data['cat_id'];
        $image_url = trim($data['image_url']);
        
        // Validate image URL format
        if (!filter_var($image_url, FILTER_VALIDATE_URL)) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Invalid image URL format'
            ]);
            exit;
        }
        
        // Upload image to database
        try {
            $image_record = $imageRepository->uploadImage($cat_id, $image_url);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Image added successfully',
                'data' => $image_record
            ]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Validation error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ==================== GET REQUESTS ====================
    else if ($method === 'GET') {
        // Extract cat_id from query string
        $cat_id = isset($_GET['cat_id']) ? (int)$_GET['cat_id'] : null;
        
        if (!$cat_id) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Cat ID is required (use ?cat_id={id})'
            ]);
            exit;
        }
        
        try {
            // Check if cat exists
            if (!$imageRepository->catExists($cat_id)) {
                http_response_code(404);
                echo json_encode([
                    'error' => 'Not found',
                    'message' => "Cat with ID $cat_id not found"
                ]);
                exit;
            }
            
            // Get all images for cat
            $images = $imageRepository->getImagesByCat($cat_id);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'count' => count($images),
                'data' => $images
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
            'message' => 'Only GET and POST requests are supported'
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
