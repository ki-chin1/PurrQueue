<?php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

try {
    // Get the HTTP request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // ==================== POST REQUESTS ====================
    if ($method === 'POST') {
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Destroy session
        $_SESSION = [];
        
        if (ini_get('session.use_cookies') !== false) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }
        
        session_destroy();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Logout successful'
        ]);
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
    // Error
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
    exit;
}
?>
