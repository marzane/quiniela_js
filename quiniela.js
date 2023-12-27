const FIL = 7;
const COL = 7;
const LIMITE = 6;
const ID_TABLA_NUMEROS = "tablaQuiniela";
const NOMBRE_COOKIE_GENERAL = "quinielaanonima";
let seleccionados = [];


// constantes clases y mensajes de exito/error
const CLASE_ERROR = "error";
const CLASE_EXITO = "exito";
const ERROR_CARGAR_NO_HAY_DATOS = "No hay datos guardados";
const ERROR_CARGAR_DATOS = "error al cargar los datos";
const ERROR_GUARDAR_DATOS = "se deben seleccionar números";
const EXITO_CARGAR_DATOS = "datos cargados";
const EXITO_GUARDAR_DATOS = "datos guardados";
const ERROR_ANADIR_NUM = "formato incorrecto o números no válidos";

window.addEventListener("DOMContentLoaded", main);

function main(){

    const contTabla = document.getElementById("contenedorTabla");
    if(contTabla){
        let tabla = generarTabla(FIL,COL,ID_TABLA_NUMEROS);
        let numeros = generarNumeros(1,49);
        escribirTabla(tabla, numeros);
        tabla.addEventListener("click", marcarNumeroListener);
        contTabla.appendChild(tabla);    

        const btnSeleccionar = document.getElementById("seleccionar");
        if(btnSeleccionar) {
            btnSeleccionar.addEventListener("click", resetearQuiniela);
            btnSeleccionar.addEventListener("click", anadirNumerosListener);
        }

        const btnAnadir = document.getElementById("añadir");
        if(btnAnadir) btnAnadir.addEventListener("click", anadirNumerosListener);

        
        const btnResetear = document.getElementById("resetear");
        if(btnResetear) btnResetear.addEventListener("click", resetearQuiniela);

        const btnGuardar = document.getElementById("guardar");
        if(btnGuardar) btnGuardar.addEventListener("click", guardarQuinielaListener);

        const btnCargar = document.getElementById("cargar");
        if(btnCargar) {
            btnCargar.addEventListener("click", resetearQuiniela);
            btnCargar.addEventListener("click", cargarQuinielaListener);
            btnCargar.addEventListener("click", anadirNumerosListener);
        }
    }


}



function resetearQuiniela(){
    seleccionados = [];

    const parrafoNumeros = document.getElementById("numSeleccionados");
    if(parrafoNumeros) parrafoNumeros.textContent = "Números seleccionados: ";

    let celdasSeleccionadas = document.querySelectorAll(".seleccionado");
    for(celda of celdasSeleccionadas){
        celda.classList.remove("seleccionado");
    }

    limpiarMensaje();

}



function limpiarMensaje(){
    const contMensaje = document.getElementById("contenedorMensaje");
    if(contMensaje){
        contMensaje.classList.remove(CLASE_ERROR, CLASE_EXITO);
    }
}



function marcarNumeroListener(e){

    const celda = e.target;
    if(celda.tagName == "TD"){
        if((seleccionados.length >= LIMITE && celda.classList.contains("seleccionado")) || seleccionados.length < LIMITE){
            celda.classList.toggle("seleccionado");

            seleccionados = [];
            const nodosSeleccionados = document.querySelectorAll(".seleccionado");
            nodosSeleccionados.forEach((element) => seleccionados.push(parseInt(element.textContent)))
            
            const parrafoNumeros = document.getElementById("numSeleccionados");
            if(parrafoNumeros) parrafoNumeros.textContent = "Números seleccionados: " + seleccionados;
        }

    }

}



function generarTabla(filas = 0, columnas = 0, id = ""){
    let tabla = document.createElement("table");

    if(typeof id === 'string' && id != "") tabla.setAttribute("id", id);

    for(let i = 0; i < filas ; i++){
        let fila = document.createElement("tr");
        for(let j = 0; j < columnas; j++){
            let celda = document.createElement("td");
            fila.appendChild(celda);
        }

        tabla.appendChild(fila);
    }

    return tabla;
}



function generarNumeros(min = 0, max = 0){

    let numeros = []

    if(min < max){
        for(i = min; i <= max; i++){
            numeros.push(i);
        }
    }

    return numeros;
}



function escribirTabla(tabla, datos = []){

    if(typeof(tabla) == "object" && tabla.tagName == 'TABLE' && Array.isArray(datos)){
        let celdas = tabla.querySelectorAll("td");
        let fin = datos.length > celdas.length ? celdas.length : datos.length
    
        for(let i = 0; i < fin; i++){
            if(datos[i] != null) celdas[i].textContent = datos[i];
        }
    }

}



function anadirNumerosListener(){

    const inputNumeros = document.getElementById("numeros");
    const mensajeParrafo = document.getElementById("mensaje");

    if(inputNumeros && inputNumeros.value != ""){
        let numeros = inputNumeros.value.split(',').map(element => parseInt(element));
        
        if(!numeros.includes(NaN) && numeros.every(num => num >= 1 && num <= 49)){

            if(mensajeParrafo) mensajeParrafo.parentNode.classList.remove(CLASE_ERROR);

            if(seleccionados.length < LIMITE){
                numeros.forEach(num => {if(seleccionados.indexOf(num) == -1 && seleccionados.length < LIMITE) seleccionados.push(num)});

                seleccionados.sort(function(a, b) {
                    return a - b;
                  });
    
                const parrafoNumeros = document.getElementById("numSeleccionados");
                if(parrafoNumeros) parrafoNumeros.textContent = "Números seleccionados: " + seleccionados;
    
                let celdas = document.querySelectorAll(`#${ID_TABLA_NUMEROS} td`);
    
                let i = 0;
                for(num of seleccionados){
                    let encontrado = false;
    
                    while(!encontrado){
    
                        if(parseInt(celdas[i].textContent) == num){
                            celdas[i].classList.add("seleccionado");
                            encontrado = true;
                        }
    
                        i++;
                    }
                }
           
            }

        } else {
            mensajeParrafo.parentNode.classList.add(CLASE_ERROR);
            mensajeParrafo.textContent = ERROR_ANADIR_NUM;
            
        }

    }

}



function guardarQuinielaListener(){
    limpiarMensaje();
    const inputNombre = document.getElementById("nombreCookie");
    const contMensaje = document.getElementById("mensaje");
    let mensaje = "";
    let claseMensaje = "";

    if(inputNombre){
        let nombre = inputNombre.value.toLowerCase();
        if(seleccionados.length > 0){
            if(nombre == "") nombre = NOMBRE_COOKIE_GENERAL;
            let datos = seleccionados.join("%");
            guardarCookie(nombre,datos,30);
            
            mensaje = EXITO_GUARDAR_DATOS;
            claseMensaje = CLASE_EXITO;

        } else {
            mensaje = ERROR_GUARDAR_DATOS;
            claseMensaje = CLASE_ERROR;
        }
        
        
    }

    if(contMensaje) {
        contMensaje.parentNode.classList.add(claseMensaje);
        contMensaje.textContent = mensaje;
    }
}



function cargarQuinielaListener(){
    limpiarMensaje();
    const inputNombre = document.getElementById("nombreCookie");
    const contMensaje = document.getElementById("mensaje");
    
    const inputNumeros = document.getElementById("numeros");
    if(inputNumeros && inputNumeros.value != "") inputNumeros.value = ""; 

    let mensaje = "";
    let claseMensaje = "";

    if(inputNombre){
        let nombre = inputNombre.value.toLowerCase();
        let lecturaCookie = document.cookie;
        if(lecturaCookie && lecturaCookie != ""){
            if(nombre == "") nombre = NOMBRE_COOKIE_GENERAL;
            let numeros = cargarCookie(nombre).split("%").map(num => parseInt(num));

            const inputNumeros = document.getElementById("numeros");
            if(inputNumeros && !numeros.includes(NaN) && numeros.length > 0) {
                inputNumeros.value = numeros;
           
                mensaje = EXITO_CARGAR_DATOS;
                claseMensaje = CLASE_EXITO;
            } else {
                mensaje = ERROR_CARGAR_DATOS;
                claseMensaje = CLASE_ERROR;
            }

        } else {
            mensaje = ERROR_CARGAR_DATOS;
            claseMensaje = CLASE_ERROR;
        }
        
        if(contMensaje) {
            contMensaje.parentNode.classList.add(claseMensaje);
            contMensaje.textContent = mensaje;
        }
    }

}



function guardarCookie(clave = "", datos = "", dias){
    let expires = "";
    if(dias && typeof dias == "number"){
        let date = new Date();
        date.setTime(date.getTime() + dias * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = clave + "=" + datos + expires;

}



// funcion que recibe una clave (string) y devuelve 
// los datos asociados a la clave en las cookies
function cargarCookie(clave = ""){
    let valor = "";
    let datosCookie = document.cookie;

    if(typeof clave == "string" && clave != "" && datosCookie != ""){
        clave = clave.trim().toLowerCase();
        claveBuscar = datosCookie.indexOf(clave + "=", 0) == 0 ? (clave + "=") : ("; " + clave + "=");

        if(datosCookie.includes(claveBuscar)){
            let inicio = datosCookie.indexOf(claveBuscar) + claveBuscar.length;
            let fin = datosCookie.indexOf(";", inicio) != -1 ? datosCookie.indexOf(";", inicio) : datosCookie.length - 1;
   
            valor = datosCookie.slice(inicio, fin);
            
        }
        
    }

    return valor;
}
