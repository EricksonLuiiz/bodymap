<?php
require_once '../config/database.php';
require_once '../models/Muscle.php';
require_once '../controllers/MuscleController.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $controller = new MuscleController($conn);
    $result = $controller->getRegion($_GET['regiao']);
    echo json_encode($result);
}