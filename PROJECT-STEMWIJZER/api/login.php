<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST method is allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Gebruikersnaam en wachtwoord zijn verplicht']);
    exit;
}

$username = $input['username'];
$password = $input['password'];

if (Auth::login($username, $password)) {
    echo json_encode([
        'success' => true,
        'message' => 'Login succesvol',
        'csrf_token' => Auth::getCSRFToken()
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Onjuiste inloggegevens'
    ]);
}
?>

