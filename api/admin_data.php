<?php
header('Content-Type: application/json');
require_once 'auth.php';
require_once 'helpers.php';
require_once 'database.php';

setCORSHeaders();
Auth::requireLogin();

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
    
    $stmt = $db->query("
        SELECT 
            s.stem_id,
            s.partij_id,
            s.tijdstip,
            s.ip_adres,
            s.cookie_id,
            p.naam as partij_naam
        FROM Stem s
        JOIN Partij p ON s.partij_id = p.partij_id
        ORDER BY s.tijdstip DESC
        LIMIT 50
    ");
    $recentVotes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $totalVotes = $db->query("SELECT COUNT(*) FROM Stem")->fetchColumn();
    $partyCount = $db->query("SELECT COUNT(*) FROM Partij")->fetchColumn();
    
    $lastVoteStmt = $db->query("
        SELECT tijdstip 
        FROM Stem 
        ORDER BY tijdstip DESC 
        LIMIT 1
    ");
    $lastVoteRow = $lastVoteStmt->fetch(PDO::FETCH_ASSOC);
    $lastVoteTime = $lastVoteRow ? date('d-m-Y H:i', strtotime($lastVoteRow['tijdstip'])) : '-';
    
    $sanitizedResults = array_map(function($result) {
        return [
            'partij_id' => intval($result['partij_id']),
            'naam' => sanitizeHTML($result['naam']),
            'votes' => intval($result['votes'])
        ];
    }, $results);
    
    $sanitizedRecentVotes = array_map(function($vote) {
        return [
            'stem_id' => intval($vote['stem_id']),
            'partij_id' => intval($vote['partij_id']),
            'tijdstip' => sanitizeHTML($vote['tijdstip']),
            'ip_adres' => sanitizeHTML($vote['ip_adres'] ?? 'N/A'),
            'cookie_id' => sanitizeHTML($vote['cookie_id'] ?? 'N/A'),
            'partij_naam' => sanitizeHTML($vote['partij_naam'])
        ];
    }, $recentVotes);
    
    echo json_encode([
        'success' => true,
        'results' => $sanitizedResults,
        'recent_votes' => $sanitizedRecentVotes,
        'stats' => [
            'total_votes' => intval($totalVotes),
            'party_count' => intval($partyCount),
            'last_vote_time' => sanitizeHTML($lastVoteTime)
        ]
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database fout: ' . $e->getMessage()
    ]);
}
?>

