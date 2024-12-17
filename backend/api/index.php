<?php
require_once '../config/database.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json");

try {
    $query = $conn->query("SELECT 'Conexão bem sucedida 👌!' AS message");
    $result = $query->fetch(PDO::FETCH_ASSOC);
    echo json_encode($result);
} catch (PDOException $exception) {
    echo json_encode(['error' => $exception->getMessage()]);
}