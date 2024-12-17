<?php
require_once '../config/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $nome = $data->nome ?? '';

    try {
        $queryTabelaExiste = $conn->query("SHOW TABLES LIKE 'usuarios'");
        if ($queryTabelaExiste->rowCount() === 0) {
            $queryCriaTabela = "
                CREATE TABLE usuarios(
                    ID INT AUTO_INCREMENT PRIMARY KEY,
                    NOME VARCHAR(255) NOT NULL,
                    DT_CRIACAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ";
            $conn->exec($queryCriaTabela);
        }

        $queryInsert = $conn->prepare("INSERT INTO usuarios (nome) VALUES (:nome)");
        $queryInsert->bindParam(':nome', $nome);
        $queryInsert->execute();
        echo json_encode(['message' => 'Usuário ' . $nome . ' criado com sucesso! ✅']);
    } catch (PDOException $exception) {
        echo json_encode(['error' => $exception->getMessage()]);
    }
}else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        $query = $conn->query("SELECT * FROM usuarios");
        $usuarios = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
    } catch (PDOException $exception) {
        echo json_encode(['error' => $exception->getMessage()]);
    }
}