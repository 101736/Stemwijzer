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

if (!isset($input['partij_id'])) {
    echo json_encode(['success' => false, 'message' => 'Partij ID is verplicht']);
    exit;
}

$partij_id = intval($input['partij_id']);

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->prepare("DELETE FROM Stem WHERE partij_id = ?");
    $stmt->execute([$partij_id]);
    
    $deletedCount = $stmt->rowCount();
    
    echo json_encode([
        'success' => true,
        'message' => sanitizeHTML("$deletedCount stem(men) verwijderd voor partij $partij_id")
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database fout: ' . $e->getMessage()
    ]);
}
?>

