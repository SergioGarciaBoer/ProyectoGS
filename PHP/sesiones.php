<?php

ini_set("display_errors",1);
ini_set("display_starup_errors",1);
error_reporting(E_ALL );

session_start();

require_once './Conexion/ConexionPdo.php';

$conexion = new ConexionPdo();
$pdo = $conexion::conectar('proyecto');

$request = json_decode(trim(file_get_contents("php://input")), true);
$request = $request["data"];

if ($request['accion'] == 'sesion'){
    $sql = 'SELECT nick, contraseña FROM usuarios WHERE nick=:nick and contraseña=:contrasena';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nick' => $request['nick'],
        ':contrasena'=> $request['contrasena'],
    ]);
    if($stmt->fetchAll()){
        $_SESSION['id'] = $pdo->lastInsertId();
        echo json_encode(['status' => 'ok',
    'id' => session_id() ]);
    }else{
        echo json_encode(['status'=> 'ko']);
    }
}

if($request['accion'] == 'registro'){
    $sql = 'SELECT nick FROM usuarios WHERE nick=:nick';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nick'=> $request['nick']
    ]);
    if($stmt->fetchAll()){
        echo json_encode(['status'=> 'nick']);
    }else{
        $sql = 'SELECT gmail FROM usuarios WHERE gmail=:gmail';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':gmail'=> $request['gmail']
        ]);
        if($stmt->fetchAll()){
            echo json_encode(['status'=> 'gmail']);
        }else{  
            $sql= 'INSERT INTO usuarios VALUES(DEFAULT, :nick, :contrasena, :gmail)';
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nick'=> $request['nick'],
                ':contrasena'=> $request['contrasena'],
                ':gmail'=> $request['gmail'],
                ]);
            echo json_encode(['status'=> 'ok']);
        }
    }
}

if($request['accion'] == 'cerrar'){
    session_destroy();
    echo json_encode(['status'=> 'ok']);
}
