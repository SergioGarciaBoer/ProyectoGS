let peticion = new Object();

let cBPublis = document.getElementById('cBPublis');
let crearPubli = document.getElementById('ocultarCrear');
let insertarImagenes = document.getElementById('descargarImagen');
let subirPublicacion = document.getElementById('btnSubirPubli');
let divPublicaciones = document.getElementById('todasPublicaciones')

addEventListener('DOMContentLoaded', () =>{

    peticion.accion = 'cargarPublicaciones';

    peticion.idUsuario = 1;
    console.log(peticion);
    postData('../../PHP/crearPublicacion.php', {
        data:peticion
    }).then((data) => {
        console.log(data);
        const publicaciones = data.publicacion;
        publicaciones.forEach(publicacion => {
            let div = document.createElement('div');
            div.innerHTML = publicacionHTML(publicacion.imagen.imagen, publicacion.titulo, publicacion.descripcion, publicacion.id);
            divPublicaciones.append(div);
        });
    });
});

cBPublis.addEventListener('change', () => {
    if(cBPublis.checked){
        crearPubli.style.display = 'block';
    }else{
        crearPubli.style.display = 'none';
    }
});

insertarImagenes.addEventListener('change', (event) =>{
    const imagenes = event.target.files;
    const verImagen = document.getElementById('verImagenes');

    verImagen.innerHTML = '';

    for(let i = 0; i < imagenes.length; i++){
        const imagen = imagenes[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100px';  
            img.style.margin = '10px';
            img.style.objectFit = 'cover';

            verImagen.appendChild(img)
        };
        reader.readAsDataURL(imagen);
    }
    
})

subirPublicacion.addEventListener('click', async (event) =>{
    let imagenes = [];
    peticion.accion = 'subirPublicacion';
    for(let i = 0; i < insertarImagenes.files.length; i++){
        const base64String = await convertirABase64(insertarImagenes.files[i]);
        imagenes.push(base64String);
    } 
    peticion.imagen = imagenes;
    peticion.titulo = document.getElementById('nombrePubli').value;
    peticion.descripcion = document.getElementById('descripcion').value;
    peticion.categoria = document.querySelector('input[name="categoria"]:checked').value;
    peticion.provincia = document.getElementById('provinciaSelect').value;
    console.log(peticion.provincia);

    postData('../../PHP/crearPublicacion.php', {
        data:peticion
    }).then((data) => {
        console.log(data);
    });
});

function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); 
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file); 
    });
}

function eliminarPublicacion(idPubli){
    peticion.accion = 'eliminarPubli';
    peticion.idPublicacion = idPubli;
    console.log(peticion);
    postData('../../PHP/crearPublicacion.php', {
        data:peticion
    }).then((data) => {
        console.log('Exito');
        location.reload(true);
    });
}

function editarPublicacion(idPubli){
    console.log(peticion);
    peticion.accion = 'editarPublicacion';
    peticion.idPublicacion = idPubli;

    postData('../../PHP/crearPublicacion.php', {
        data:peticion
    }).then((data) => {
        console.log('Boton para editar');
        console.log(data);
        let body = document.getElementsByTagName('body')[0];
        let div = document.createElement('div');
        div.innerHTML = edicionHTML(data.titulo, data.descripcion, idPubli);
        body.append(div);
        let modal = new bootstrap.Modal(document.getElementById('miModal'));
        modal.show();
    });
}

function guardarDatosPublicacion(idPubli){
    peticion.accion = 'guardarDatos'
    peticion.titulo = document.getElementById('tituloEdit').textContent;
    peticion.descripcion = document.getElementById('descripcionEdit').value;
    peticion.idPublicacion = idPubli;

    console.log('boton de editar');
    console.log(peticion);
    postData('../../PHP/crearPublicacion.php', {
        data:peticion
    }).then((data) => {
        console.log(data);
    });
}

function publicacionHTML(imagenPubli, tituloPubli, descripcionPubli, idPubli){
    return `
        <div class="card">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="data:image/png;base64,${imagenPubli}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${tituloPubli}</h5>
                        <p class="card-text">
                            ${descripcionPubli}
                        </p>
                        <button onclick="editarPublicacion(${idPubli})" data-id="${idPubli}" class="btn btn-primary">Editar</button>
                        <butto onclick="eliminarPublicacion(${idPubli})" data-id="${idPubli}" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    `
}

function edicionHTML(titulo, descripcion, idPubli){
    return `
    <div class="modal fade" id="miModal" tabindex="-1" aria-labelledby="miModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="tituloEdit">${titulo}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <textarea id="descripcionEdit">${descripcion}</textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" onclick="guardarDatosPublicacion(${idPubli})">Guardar Cambios</button>
            </div>
          </div>
        </div>
    </div>
    `
}



