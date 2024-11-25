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

if($request["accion"] == 'subirPublicacion'){
    $sql = 'INSERT INTO publicaciones VALUES(DEFAULT, :idSesion, :titulo, :descripcion, DEFAULT)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idSesion' => 1,
        ':titulo' => $request['titulo'],
        ':descripcion' => $request['descripcion']
    ]);

    $idPublicaciones = $pdo->lastInsertId();

    $imagenes = $request['imagen'];

    foreach($imagenes as $imagen){
        $sql = 'INSERT INTO imagenes VALUES(DEFAULT, '.$idPublicaciones.', "'.$imagen.'")';
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }

    $sql = 'INSERT INTO publicacion_categorias VALUES(:idPublicacion, :idCategoria)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPublicacion' => $idPublicaciones,
        ':idCategoria' => $request['categoria']
    ]);

    $sql = 'INSERT INTO publicacion_provincias VALUES(:idPublicacion, :idProvincia)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPublicacion' => $idPublicaciones,
        ':idProvincia' => $request['provincia']
    ]);

    echo json_encode('Exito');
    die();
}

if($request['accion'] == 'cargarPublicaciones'){
    $sql = 'SELECT descripcion, id, titulo FROM PUBLICACIONES WHERE usuario_id = :idUsuario';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idUsuario' => $request['idUsuario']
    ]);
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

    echo json_encode(['publicacion' => $publicaciones]);
    die();
}

if($request['accion']== 'eliminarPubli'){
    $sql = 'DELETE FROM publicaciones WHERE id = :idPubli';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':idPubli' => $request['idPublicacion']]);
    echo json_encode('Exito');
    die();
}

if($request['accion'] == 'editarPublicacion'){
    $sql = 'SELECT titulo, descripcion FROM publicaciones WHERE id = :idpublicaciones';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':idpublicaciones' => $request['idPublicacion']]);
    $publicacionDatos = $stmt->fetch();
    echo json_encode($publicacionDatos);
    die();
}

if($request['accion'] == 'guardarDatos'){
    $sql = 'UPDATE publicaciones SET titulo = :tituloPubli, descripcion = :descripcionPubli'. 
    ' WHERE id = :idPubli';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPubli' => $request['idPublicacion'],
        ':tituloPubli' => $request['titulo'],
        ':descripcionPubli' => $request['descripcion']
    ]);
    echo json_encode('Exito');
    die();
}


