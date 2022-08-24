//Funciones
function setearImportesHtml(){
    document.getElementById("seccionCarrito__subTotalEnviosImporte").innerHTML = `ARS ${subtotalEnvios}`;
    document.getElementById("seccionCarrito__subTotalPreciosImporte").innerHTML = `ARS ${subtotalPrecios}`;
    document.getElementById("seccionCarrito__precioFinalImporte").innerHTML = `ARS ${subtotalEnvios + subtotalPrecios}`; 
}

function actualizarEstadoCarrito(){
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
    habilitarDeshabilitarBotonLimpiador();
    obtenerValoresImportes();
    setearImportesHtml();
}

function obtenerValoresImportes(){
    subtotalEnvios = productosCarrito.reduce((acumulador, producto) => acumulador + (producto.envio*producto.cantidad), 0);
    subtotalPrecios = productosCarrito.reduce((acumulador, producto) => acumulador + (producto.precio*producto.cantidad), 0);
}

function habilitarDeshabilitarBotonLimpiador(){
    if(productosCarrito.length == 0){
        botonLimpiar.classList.add("disabled");

        //Armado de mensaje para carrito vacío
        document.getElementById("seccionCarrito").innerHTML = 
        `<div class="cardProductoCarrito">
            <div class="card-body cardProductoCarrito__body">
                <p class="cardProductoCarrito__carritoVacio">
                    No hay productos en el carrito
                </p>
            </div>
        </div>`;
    }
    else{
        botonLimpiar.classList.remove("disabled");
    }
}

function armarRetornarElementoCarrito(producto){
    let cardProductoCarrito = document.createElement("div");
    let cardProductoCarritoBody = document.createElement("div");
    cardProductoCarrito.className = "cardProductoCarrito";
    cardProductoCarritoBody.className = "card-body cardProductoCarrito__body";
    
    cardProductoCarritoBody.innerHTML = `
        <div class="cardProductoCarrito__imagenContainer">
            <img class="cardProductoCarrito__imagen" src="../${producto.imagen}" alt="Imagen de producto" />
        </div>
        <div class="cardProductoCarrito__detalle flexVertical">
            <h5 class="card-title cardProductoCarrito__marca">${producto.marca.toUpperCase()}</h5>
            <h6 class="card-subtitle mb-2 text-muted cardProductoCarrito__modelo">Modelo ${producto.modelo.toUpperCase()}</h6>
            <p class="card-text cardProductoCarrito__descripcion mt-2">${producto.descripcion}</p>
        </div>
        <div class="cardProductoCarrito__subTotales flexVertical">
            <h6 class="cardProductoCarrito__titulo">Subtotal Envío</h6>
            <h5 class="cardProductoCarrito__subTotalEnvio cardProductoCarrito__importe">ARS ${producto.subtotalEnvio}</h5>
            <h6 class="cardProductoCarrito__titulo mt-3">Subtotal Precio</h6>
            <h5 class="cardProductoCarrito__subTotalPrecio cardProductoCarrito__importe">ARS ${producto.subtotalPrecio}</h5>
        </div>
        <div class="cardProductoCarrito__cantidades flexVertical">
            <h6 class="cardProductoCarrito__titulo">Cantidad</h6>
            <h5 class="cardProductoCarrito__cantidad">${producto.cantidad}</h5>
        </div>
        <button class="cardProductoCarrito__botonDelete" id="btnEliminar${producto.modelo}">
            <i class="fa-solid fa-trash-can cardProductoCarrito__iconDelete"></i>
        </button>
    `;

    cardProductoCarrito.appendChild(cardProductoCarritoBody);
    
    return cardProductoCarrito;
}

function eliminarProductoCarrito(productoCarrito){
    productosCarrito = productosCarrito.filter((producto) => producto.codigo !== productoCarrito.codigo);
    actualizarEstadoCarrito();
}

function eliminarTodosProductosCarrito(){
    productosCarrito = [];
    actualizarEstadoCarrito();
    totalProductosCarrito = 0;
    cantidadProductosCarritoHtml.innerText = "";
}

function dibujarCarrito() {
    seccionCarrito.innerHTML = "";
    cantidadProductosCarritoHtml.innerText = "";
    totalProductosCarrito = 0;

    productosCarrito.forEach(
        (productoCarrito) => {
            totalProductosCarrito += productoCarrito.cantidad;
            let nuevoElementoCarrito = armarRetornarElementoCarrito(productoCarrito);
            seccionCarrito.appendChild(nuevoElementoCarrito);
                
            //Adhiero evento click al botón eliminar
            document.getElementById(`btnEliminar${productoCarrito.modelo}`).addEventListener("click", function(){
                eliminarProductoCarrito(productoCarrito);
                dibujarCarrito();
            });
        }
    );
        
    cantidadProductosCarritoHtml.innerText = totalProductosCarrito || "";
    actualizarEstadoCarrito();
}



//Inicialización de variables
let productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let seccionCarrito = document.getElementById("seccionCarrito");
let botonLimpiar = document.getElementById("btnLimpiar");
let cantidadProductosCarritoHtml = document.getElementById("header__cantidad");
let subtotalEnvios = 0;
let subtotalPrecios = 0;
let totalProductosCarrito = 0;

//Dibuja el carrito
dibujarCarrito();

//Evento al botón de limpiar todos los productos del carrito
botonLimpiar.addEventListener("click", function(){
    eliminarTodosProductosCarrito();
});
