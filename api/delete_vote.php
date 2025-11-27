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

if (!isset($input['stem_id'])) {
    echo json_encode(['success' => false, 'message' => 'Stem ID is verplicht']);
    exit;
}

$stem_id = intval($input['stem_id']);

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->prepare("DELETE FROM Stem WHERE stem_id = ?");
    $stmt->execute([$stem_id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Stem verwijderd'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Stem niet gevonden'
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database fout: ' . $e->getMessage()
    ]);
}
?>

