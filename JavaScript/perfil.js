sesionCierre.addEventListener('click', () =>{
    peticion.accion = 'cerrar'
    postData('../../PHP/sesiones.php', {
        data:peticion
    }).then((data) => {
        btnSesionPrinc.style.display = 'block';
        perfil.style.display = 'none';
        perfilNav.style.left = '100%';
    })
});

perfil.addEventListener('click', () =>{
    perfilNav.style.left = '40%';
});

closePerfil.addEventListener('click', () =>{
    perfilNav.style.left = '100%';
})