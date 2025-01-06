<?php
require_once '../config/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

function firstLetterUpper($string){
    return ucfirst($string);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        $query = $conn->query("SELECT DISTINCT region FROM muscle");
        $regiao = $query->fetchAll(PDO::FETCH_ASSOC);
        foreach ($regiao as $key => $value) {
            $regiao[$key]['region'] = firstLetterUpper($value['region']);
        }
        echo json_encode($regiao);
    } catch (PDOException $exception) {
        echo json_encode(['error' => $exception->getMessage()]);
    }
}