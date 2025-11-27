<?php
header('Content-Type: application/json');
require_once 'auth.php';
require_once 'helpers.php';
require_once 'database.php';

setCORSHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST method is allowed']);
    exit;
}

Auth::requireLogin();

$input = json_decode(file_get_contents('php://input'), true);
verifyCSRF($input);

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $db->exec("DELETE FROM Stem");
    
    $db->exec("DELETE FROM sqlite_sequence WHERE name='Stem'");
    
    echo json_encode([
        'success' => true,
        'message' => 'Alle stemmen zijn verwijderd'
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database fout: ' . $e->getMessage()
    ]);
}
?>

