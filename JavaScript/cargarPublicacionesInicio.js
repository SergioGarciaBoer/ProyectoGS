
let pagina = 1;
let divPublicaciones = document.getElementById('publicacionBuscadas');
let divPagina = document.getElementById('divPaginacion');
let body = document.getElementsByTagName('body')[0];

addEventListener('DOMContentLoaded', () =>{
    peticion.accion = 'cargarPublicaciones';
    postData('../../PHP/cargarPublicacionesInicio.php', {
        data:peticion
    }).then((data) => {
        const publicaciones = data.publicaciones;
        publicaciones.forEach(publicacion => {
            let div = document.createElement('div');
            div.innerHTML = publicacionesHTMLVer(publicacion.imagen.imagen, publicacion.titulo, publicacion.descripcion, publicacion.id);
            divPublicaciones.append(div);
        });
        paginasBotones = data.paginas;
        for(let i = 1; i <= paginasBotones; i++){
            divPagina.innerHTML += botonesPaginacion(i);
        }
    });
});

function numeroPagina(num){

    peticion.accion = 'paginacion';
    peticion.paginaDeseada = num;

    postData('../../PHP/cargarPublicacionesInicio.php', {
        data:peticion
    }).then((data) => {
        divPublicaciones.innerHTML = '';
        const publicaciones = data.publicaciones;
        publicaciones.forEach(publicacion => {
            let div = document.createElement('div');
            div.innerHTML = publicacionesHTMLVer(publicacion.imagen.imagen, publicacion.titulo, publicacion.descripcion, publicacion.id);
            divPublicaciones.append(div);
        });
        paginasBotones = data.paginas;
        for(let i = 1; i <= paginasBotones; i++){
            divPagina.innerHTML += botonesPaginacion(i);
        }
    });
}

function publicacionCompleta(idPubli){
    peticion.accion = 'mostrarDetalles';
    peticion.idPublicacion= idPubli;
    postData('../../PHP/cargarPublicacionesInicio.php', {
        data:peticion
    }).then((data) => {
        console.log(data);
        body.innerHTML += modalPublicacionHTML(data.titulo, data.imagenes, data.descripcion)
    });
}

function modalPublicacionHTML(tituloPubli, imagenesPubli, descripcionPubli){
    let html =`
    <div id="modalPubli" class="modalPubli">
        <div class="modalPubliContenido">
        <span class="close" onclick="cerrarModalPubli()">&times;</span>
            <div>
                <h2 class="text-center">${tituloPubli}</h2>
                <div class="container mt-5">
                <div class="galeria-contenedor">
    `
    imagenesPubli.forEach((imagen) =>{
        html += `<img src="data:image/png;base64,${imagen.imagen}" class="imgPubli">`
    });

    html += `
            </div>
            <div class="textoPubli">
                <p>Localizacion: Málaga</p>
                <p>Descripcion: ${descripcionPubli}</p>
            </div>
        </div>
    </div>
    `

    return html;
}

function cerrarModalPubli(){
    document.getElementById('modalPubli').style.display = 'none';
}

function publicacionesHTMLVer(imagenPubli, tituloPubli, descripcionPubli, idPubli){
    return `
        <div class="card tarjetaPubli">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="data:image/png;base64,${imagenPubli}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 onclick="publicacionCompleta(${idPubli})" class="card-title">${tituloPubli}</h5>
                        <p class="card-text">
                            ${descripcionPubli}
                        </p>
                        <p>Localizacion: Malaga</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

function botonesPaginacion(paginaC){
    return `
    <button class="btn-paginacion" onclick="numeroPagina(${paginaC})">${paginaC}</button>
    `
}