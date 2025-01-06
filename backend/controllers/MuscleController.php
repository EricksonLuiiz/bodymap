<?php
class MuscleController {
    private $muscleModel;

    public function __construct($db) {
        $this->muscleModel = new Muscle($db);
    }

    public function getRegion($region) {
        try{
            return $this->muscleModel->getByRegion($region);
        }catch(PDOException $exception){
            return ['error' => $exception->getMessage()];
        }
    }
}