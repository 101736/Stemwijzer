<?php
header('Content-Type: application/json');
require_once 'helpers.php';
require_once 'database.php';

setCORSHeaders();

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['partij_id'])) {
    echo json_encode(['success' => false, 'message' => 'Partij ID is verplicht']);
    exit;
}

$partij_id = intval($input['partij_id']);

$cookie_id = null;
if (isset($input['cookie_id']) && !empty($input['cookie_id'])) {
    $cookie_id = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['cookie_id']);
    if (strlen($cookie_id) > 100) {
        $cookie_id = substr($cookie_id, 0, 100);
    }
}

$ip_adres = $_SERVER['REMOTE_ADDR'];
if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $forwarded_ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $ip_adres = trim($forwarded_ips[0]);
}
if (!filter_var($ip_adres, FILTER_VALIDATE_IP)) {
    $ip_adres = '0.0.0.0';
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->prepare("
        SELECT COUNT(*) FROM Stem 
        WHERE cookie_id = ? OR ip_adres = ?
    ");
    $stmt->execute([$cookie_id, $ip_adres]);
    $alreadyVoted = $stmt->fetchColumn() > 0;
    
    if ($alreadyVoted) {
        echo json_encode([
            'success' => false, 
            'message' => 'Je hebt al gestemd'
        ]);
        exit;
    }
    
    $stmt = $db->prepare("SELECT COUNT(*) FROM Partij WHERE partij_id = ?");
    $stmt->execute([$partij_id]);
    $partyExists = $stmt->fetchColumn() > 0;
    
    if (!$partyExists) {
        echo json_encode([
            'success' => false, 
            'message' => 'Ongeldige partij'
        ]);
        exit;
    }
    
    $stmt = $db->prepare("
        INSERT INTO Stem (partij_id, cookie_id, ip_adres, tijdstip) 
        VALUES (?, ?, ?, datetime('now'))
    ");
    $stmt->execute([$partij_id, $cookie_id, $ip_adres]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Stem succesvol geregistreerd',
        'vote_id' => $db->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database fout: ' . $e->getMessage()
    ]);
}
?>

