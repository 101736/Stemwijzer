<?php
function sanitizeHTML($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

function setCORSHeaders() {
    $allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1',
    ];
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        if (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            header('Access-Control-Allow-Origin: *');
        }
    }
    
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
}

function verifyCSRF($input) {
    require_once 'auth.php';
    
    $token = null;
    if (isset($input['csrf_token'])) {
        $token = $input['csrf_token'];
    } elseif (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'];
    }
    
    if (!$token || !Auth::verifyCSRFToken($token)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Ongeldige CSRF token'
        ]);
        exit;
    }
}
?>

