<?php

class Database {
    private $db;
    private $dbPath = '../database/stemwijzer.db';
    
    public function __construct() {
        $this->connect();
        $this->initializeTables();
    }
    
    private function connect() {
        try {
            $dbDir = dirname($this->dbPath);
            if (!file_exists($dbDir)) {
                mkdir($dbDir, 0755, true);
            }
            
            $this->db = new PDO('sqlite:' . $this->dbPath);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    }
    
    private function initializeTables() {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS Partij (
                partij_id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam VARCHAR(100) NOT NULL,
                slogan VARCHAR(255),
                afbeelding_url VARCHAR(255)
            )
        ");
        
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS Stem (
                stem_id INTEGER PRIMARY KEY AUTOINCREMENT,
                partij_id INTEGER NOT NULL,
                tijdstip DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip_adres VARCHAR(45),
                cookie_id VARCHAR(100),
                FOREIGN KEY (partij_id) REFERENCES Partij(partij_id)
            )
        ");
        
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS Gebruiker (
                gebruiker_id INTEGER PRIMARY KEY AUTOINCREMENT,
                naam VARCHAR(100),
                cookie_id VARCHAR(100) UNIQUE,
                ip_adres VARCHAR(45)
            )
        ");
        
        $this->initializePartijen();
    }
    
    private function initializePartijen() {
        $count = $this->db->query("SELECT COUNT(*) FROM Partij")->fetchColumn();
        
        if ($count == 0) {
            $partijen = [
                ['VVD', 'Vrijheid en verantwoordelijkheid'],
                ['PvdA', 'Iedereen doet mee'],
                ['GroenLinks', 'Durven dromen van een betere wereld'],
                ['D66', 'Nieuw leiderschap'],
                ['SP', 'Voor elkaar'],
                ['ChristenUnie', 'Hoop, liefde en solidariteit'],
                ['PVV', 'Nederland weer van ons'],
                ['Partij voor de Dieren', 'Moed om vooruit te gaan'],
                ['CDA', 'Samen sterker'],
                ['SGP', 'Trouw aan God en Oranje'],
                ['DENK', 'Gelijkwaardigheid en rechtvaardigheid'],
                ['FvD', 'Herstel de democratie'],
                ['JA21', 'Verstandig en betaalbaar'],
                ['Volt', 'Nieuwe politiek voor Nederland'],
                ['BBB', 'Stem voor het platteland'],
                ['NSC', 'Nieuw Sociaal Contract'],
                ['50PLUS', 'Stem voor de ouderen'],
                ['BIJ1', 'Voor radicale gelijkwaardigheid'],
                ['Piratenpartij', 'Voor privacy en transparantie'],
                ['BVNL', 'Belang van Nederland'],
                ['Libertarische Partij', 'Voor meer vrijheid'],
                ['NLPlan', 'Samen sterker door positieve energie'],
                ['LEF', 'Lokaal Europa Focus'],
                ['Ellect', 'Vernieuwing van de democratie'],
                ['De Linie', 'Bescherming van Nederlandse identiteit']
            ];
            
            $stmt = $this->db->prepare("INSERT INTO Partij (naam, slogan) VALUES (?, ?)");
            foreach ($partijen as $partij) {
                $stmt->execute($partij);
            }
        }
    }
    
    public function getConnection() {
        return $this->db;
    }
}
?>

