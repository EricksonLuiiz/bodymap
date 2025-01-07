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
        //Ordenação por sequência corpo
        // $query = $conn->query("SELECT DISTINCT region FROM muscle ORDER BY FIELD(region, 'pescoço', 'dorso', 'ombro', 'braço', 'antebraço', 'mão', 'tórax', 'abdome', 'quadril', 'coxa', 'perna', 'pé')");
        //Ordenação Alfabética
        $query = $conn->query("SELECT DISTINCT region FROM muscle ORDER BY region ASC");
        $regiao = $query->fetchAll(PDO::FETCH_ASSOC);
        foreach ($regiao as $key => $value) {
            $regiao[$key]['region'] = firstLetterUpper($value['region']);
        }
        echo json_encode($regiao);
    } catch (PDOException $exception) {
        echo json_encode(['error' => $exception->getMessage()]);
    }
}