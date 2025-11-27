<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
header('Access-Control-Allow-Credentials: true');

require_once 'auth.php';

echo json_encode([
    'success' => true,
    'logged_in' => Auth::isLoggedIn(),
    'csrf_token' => Auth::isLoggedIn() ? Auth::getCSRFToken() : null
]);
?>

