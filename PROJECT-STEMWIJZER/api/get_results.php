<?php
header('Content-Type: application/json');
require_once 'helpers.php';

setCORSHeaders();

require_once 'database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->query("
        SELECT 
            p.partij_id,
            p.naam,
            COUNT(s.stem_id) as votes
        FROM Partij p
        LEFT JOIN Stem s ON p.partij_id = s.partij_id
        GROUP BY p.partij_id, p.naam
        ORDER BY votes DESC
    ");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $totalVotes = $db->query("SELECT COUNT(*) FROM Stem")->fetchColumn();
    $partyCount = $db->query("SELECT COUNT(*) FROM Partij")->fetchColumn();
    
    $topParty = '-';
    if ($totalVotes > 0 && count($results) > 0) {
        $topParty = $results[0]['naam'];
    }
    
    echo json_encode([
        'success' => true,
        'results' => $results,
        'summary' => [
            'total_votes' => intval($totalVotes),
            'party_count' => intval($partyCount),
            'top_party' => $topParty
        ]
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database fout: ' . $e->getMessage()
    ]);
}
?>

