/* Registro o inicio de sesion */
let peticion = new Object();

iniciarSesionCB.addEventListener('change', () => {
    if(iniciarSesionCB.checked){
        divInicioSesion.style.display = 'block';
        divRegistro.style.display = 'none';
        registroCB.checked = false;
    }else{
        iniciarSesionCB.checked = true;
    }
});

registroCB.addEventListener('change', () => {
    if(registroCB.checked){
        divInicioSesion.style.display = 'none';
        divRegistro.style.display = 'block';
        iniciarSesionCB.checked = false;
    }else{
        registroCB.checked = true;
    }
});


btnSesion.addEventListener('click', ()=>{
    peticion.accion = 'sesion';
    peticion.nick = document.getElementById('sesionNick').value;
    peticion.contrasena = base64Encode(document.getElementById('sesionContrasena').value);
    postData('../../PHP/sesiones.php', {
        data:peticion
    }).then((data) => {
        if(data.status == 'ko'){
            document.getElementById('sesionContrasena').value = '';
            parrafOk.innerHTML = 'Datos incorrectos.';
            divInicioSesion.append(parrafOk);
        }else{
            btnSesionPrinc.style.display = 'none';
            perfil.style.display = 'block';
            modal.style.display = 'none';
        }
    });
});

btnRegistro.addEventListener('click', () => {
    peticion.accion = 'registro';
    peticion.nick = document.getElementById('registroNick').value;
    peticion.contrasena = base64Encode(document.getElementById('registroContrasena').value);
    peticion.gmail = document.getElementById('registroGmail').value;
    postData('../../PHP/sesiones.php', {
        data:peticion
    }).then((data) => {
        if(data.status == 'ok'){
            btnSesionPrinc.style.display = 'none';
            perfil.style.display = 'block';
            modal.style.display = 'none';
        }else if (data.status == 'nick'){
            parrafOk.innerHTML = 'El nombre de usuario ya existe.';
            divRegistro.append(parrafOk);
            document.getElementById('registroNick').value = '';
            document.getElementById('registroContrasena').value = '';
            document.getElementById('registroGmail').value= '';
        }else{
            parrafOk.innerHTML = 'El gmail que quieres usar ya se encuentra registrado.';
            divRegistro.append(parrafOk);
            document.getElementById('registroNick').value = '';
            document.getElementById('registroContrasena').value = '';
            document.getElementById('registroGmail').value= '';
        }
    })
});

function base64Encode(password){
    return btoa(password);
}

function base64Decode(password){
    return atob(password);
}

