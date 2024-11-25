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

if($request['accion'] == 'cargarPublicaciones'){
    $sql = 'SELECT COUNT(*) as total FROM  publicaciones';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $publicacionesTotales = $stmt->fetch();

    $paginacion = (int)($publicacionesTotales['total'] / 10);
    $resto = $publicacionesTotales['total'] % 10;
    if($resto != 0){
        $paginacion++;
    }

    $sql = 'SELECT descripcion, id, titulo FROM PUBLICACIONES LIMIT 10';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $publicacionesBD = $stmt->fetchAll();
    $publicaciones = [];
    foreach($publicacionesBD as $publicacion){
        $sql = 'SELECT imagen FROM imagenes WHERE publicacion_id = :idPublicacion';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':idPublicacion' => $publicacion['id']
        ]);
        $imagen = $stmt->fetch();
        $publicacion['imagen'] = $imagen;
        $publicaciones[] = $publicacion;
    }

    echo json_encode(['paginas' => $paginacion, 'publicaciones' => $publicaciones]);
    die();
}

if($request['accion'] == 'paginacion'){
    $publicacionesOmitir = (int)$request['paginaDeseada'] * 10 - 10;
    $sql = 'SELECT descripcion, id, titulo FROM PUBLICACIONES LIMIT 10 OFFSET ' . $publicacionesOmitir;
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $publicacionesBD = $stmt->fetchAll();
    $publicaciones = [];
    foreach($publicacionesBD as $publicacion){
        $sql = 'SELECT imagen FROM imagenes WHERE publicacion_id = :idPublicacion';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':idPublicacion' => $publicacion['id']
        ]);
        $imagen = $stmt->fetch();
        $publicacion['imagen'] = $imagen;
        $publicaciones[] = $publicacion;
    }
    echo json_encode(['publicaciones' => $publicaciones]);
    die();
}

if($request['accion'] == 'mostrarDetalles'){
    $sql = 'SELECT titulo, descripcion FROM publicaciones WHERE id = :idPublicacion';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':idPublicacion' => $request['idPublicacion']]);

    $publicacion = $stmt->fetch();
    
    $sql = 'SELECT imagen FROM imagenes WHERE publicacion_id = :idPublicacion';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':idPublicacion' => $request['idPublicacion']]);

    $imagenes = $stmt->fetchAll();
    $publicacion['imagenes'] = $imagenes;

    echo json_encode($publicacion);
}