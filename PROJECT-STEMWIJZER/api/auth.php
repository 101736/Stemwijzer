<?php
session_start();

class Auth {
    private const ADMIN_USERNAME = 'admin';
    private const ADMIN_PASSWORD_HASH = '$2y$12$42Fv2uGNPqGCKreDSwtaW.wsFjMsBUExDU6HPh6ZvFyP0/b9askom';
    
    public static function login($username, $password) {
        if ($username === self::ADMIN_USERNAME && password_verify($password, self::ADMIN_PASSWORD_HASH)) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_username'] = $username;
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            return true;
        }
        return false;
    }
    
    public static function logout() {
        session_unset();
        session_destroy();
    }
    
    public static function isLoggedIn() {
        return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
    }
    
    public static function requireLogin() {
        if (!self::isLoggedIn()) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Authenticatie vereist'
            ]);
            exit;
        }
    }
    
    public static function getCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    public static function verifyCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
}
?>

