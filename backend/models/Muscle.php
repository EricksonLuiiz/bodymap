<?php
class Muscle{
    private $conn;

    public function __contruct($db){
        $this-> conn = $db;
    }

    public function getByRegion($region){
        $query = $this->conn->prepare("SELECT * FROM muscle WHERE region = ?");
        $query->execute([$region]);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}