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
require_once '../src/CatRepository.php';

try {
    // Initialize repository
    $catRepository = new CatRepository($pdo);
    
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Get request path
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Extract ID from query string if present
    $cat_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    // ==================== GET REQUESTS ====================
    if ($method === 'GET') {
        // Route: GET /api/cats.php?id={id} - Get single cat
        if ($cat_id) {
            $cat = $catRepository->getCatById($cat_id);
            
            if ($cat) {
                http_response_code(200);
                echo json_encode($cat);
            } else {
                http_response_code(404);
                echo json_encode([
                    'error' => 'Not found',
                    'message' => "Cat with ID $cat_id not found"
                ]);
            }
        } 
        // Route: GET /api/cats.php - Get all cats
        else {
            $cats = $catRepository->getAllCats();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'count' => count($cats),
                'data' => $cats
            ]);
        }
    }
    
    // ==================== POST REQUESTS ====================
    else if ($method === 'POST') {
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
        
        // Create cat
        try {
            $new_cat = $catRepository->createCat($data);
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Cat created successfully',
                'data' => $new_cat
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Validation error',
                'message' => $e->getMessage()
            ]);
        }
    }
    
    // ==================== PUT REQUESTS ====================
    else if ($method === 'PUT') {
        // Cat ID is required for update
        if (!$cat_id) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Cat ID is required (use ?id={id})'
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
        
        // Update cat
        try {
            $updated_cat = $catRepository->updateCat($cat_id, $data);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Cat updated successfully',
                'data' => $updated_cat
            ]);
        } catch (Exception $e) {
            // Check if cat not found
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
    
    // ==================== DELETE REQUESTS ====================
    else if ($method === 'DELETE') {
        // Cat ID is required for delete
        if (!$cat_id) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Bad request',
                'message' => 'Cat ID is required (use ?id={id})'
            ]);
            exit;
        }
        
        // Delete cat
        try {
            $catRepository->deleteCat($cat_id);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => "Cat with ID $cat_id deleted successfully"
            ]);
        } catch (Exception $e) {
            // Check if cat not found
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
            'message' => 'Only GET, POST, PUT, and DELETE requests are supported'
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
