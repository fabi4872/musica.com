//Funciones
async function obtenerTodosProductos(){
    const URLPRODUCTOS = "../js/productos.json";
    let response = await fetch(URLPRODUCTOS);
    let data = await response.json();
    
    //Recorre todas las categorías y se queda con los productos
    for(let i=0; i<data.categorias.length; i++){
        productos = productos.concat(data.categorias[i].productos);
    }

    //Dibuja el carrito
    dibujarCarrito();
}

function setearImportesHtml(){
    document.getElementById("seccionCarrito__subTotalEnviosImporte").innerHTML = `ARS ${estandarFormatoMonedaPesos.format(parseFloat(subtotalEnvios).toFixed(2))}`;
    document.getElementById("seccionCarrito__subTotalPreciosImporte").innerHTML = `ARS ${estandarFormatoMonedaPesos.format(parseFloat(subtotalPrecios).toFixed(2))}`;
    document.getElementById("seccionCarrito__precioFinalImporte").innerHTML = `ARS ${estandarFormatoMonedaPesos.format(parseFloat(subtotalEnvios + subtotalPrecios).toFixed(2))}`; 
}

function actualizarEstadoCarrito(){
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
    habilitarDeshabilitarBotonesLimpiarFinalizar();
    obtenerValoresImportes();
    setearImportesHtml();
}

function obtenerValoresImportes(){
    subtotalEnvios = productosCarrito.reduce((acumulador, producto) => acumulador + (producto.envio*producto.cantidad), 0);
    subtotalPrecios = productosCarrito.reduce((acumulador, producto) => acumulador + (producto.precio*producto.cantidad), 0);
}

function habilitarDeshabilitarBotonesLimpiarFinalizar(){
    if(productosCarrito.length == 0){
        botonLimpiar.classList.add("disabled");
        botonFinalizar.classList.add("disabled");

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
        botonFinalizar.classList.remove("disabled");
    }
}

function armarRetornarElementoCarrito(producto){
    let cardProductoCarrito = document.createElement("div");
    let cardProductoCarritoBody = document.createElement("div");
    cardProductoCarrito.className = "cardProductoCarrito";
    cardProductoCarritoBody.className = "card-body cardProductoCarrito__body";
    
    cardProductoCarritoBody.innerHTML = `
        <div class="col-12 col-lg-6 cardProductoCarrito__imagenContainer p-3">
            <img class="cardProductoCarrito__imagen" src="../${producto.imagen}" alt="Imagen de producto" />
        </div>

        <div class="col-12 col-lg-6 cardProductoCarrito__detalle flexVertical p-3">
            <h5 class="card-title cardProductoCarrito__marca">${producto.marca.toUpperCase()}</h5>
            <h6 class="card-subtitle mb-2 text-muted cardProductoCarrito__modelo">Modelo ${producto.modelo.toUpperCase()}</h6>
            <p class="card-text cardProductoCarrito__descripcion mt-2">${producto.descripcion}</p>
        </div>

        <div class="col-12 col-md-5 cardProductoCarrito__subTotales flexVertical p-3">
            <h6 class="cardProductoCarrito__titulo">Subtotal Envío</h6>
            <h5 class="cardProductoCarrito__subTotalEnvio cardProductoCarrito__importe">ARS ${estandarFormatoMonedaPesos.format(parseFloat(producto.subtotalEnvio).toFixed(2))}</h5>
            <h6 class="cardProductoCarrito__titulo mt-3">Subtotal Precio</h6>
            <h5 class="cardProductoCarrito__subTotalPrecio cardProductoCarrito__importe">ARS ${estandarFormatoMonedaPesos.format(parseFloat(producto.subtotalPrecio).toFixed(2))}</h5>
        </div>

        <div class="col-12 col-md-5 cardProductoCarrito__cantidades flexVertical p-3">
            <h6 class="cardProductoCarrito__titulo">Cantidad</h6>
            <div class="mt-1 cardProductoCarrito__controladorCantidad">
                <button class="btnCantidad">
                    <i class="fa-solid fa-circle-minus iconCantidad" id="menos${producto.codigo}"></i>
                </button>
                
                <input min="1" class="cardProductoCarrito__cantidad" type="text" readonly value="${producto.cantidad}" />
                
                <button class="btnCantidad">
                    <i class="fa-solid fa-circle-plus iconCantidad" id="mas${producto.codigo}"></i>
                </button>
            </div>   
            <div class="mt-2 cardProductoCarrito__mjeError" id="mjeError${producto.codigo}"></div>
        </div>

        <div class="col-12 col-md-2 flexVertical p-3">
            <button class="cardProductoCarrito__botonDelete" id="btnEliminar${producto.modelo}">
                <i class="fa-solid fa-trash-can cardProductoCarrito__iconDelete"></i>
            </button>
        </div>
    `;

    cardProductoCarrito.appendChild(cardProductoCarritoBody);
    
    return cardProductoCarrito;
}

function eliminarProductoCarrito(productoCarrito){
    productosCarrito = productosCarrito.filter((producto) => producto.codigo !== productoCarrito.codigo);
    actualizarEstadoCarrito();
    dibujarCarrito();
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
                desplegarAlertaConfirmarEliminacion(`El producto ${productoCarrito.descripcion} será eliminado del carrito`, `El producto ${productoCarrito.descripcion} fue eliminado del carrito satisfactoriamente`, productoCarrito);
            });

            //Adhiero eventos de disminuir y aumentar cantidad
            if(productoCarrito.cantidad > 1){
                document.getElementById(`menos${productoCarrito.codigo}`).addEventListener("click", (e) => {
                    productoCarrito.cantidad--;
                    productoCarrito.subtotalEnvio -= productoCarrito.envio;
                    productoCarrito.subtotalPrecio -= productoCarrito.precio;
                    dibujarCarrito();
                });
            }
            document.getElementById(`mas${productoCarrito.codigo}`).addEventListener("click", (e) => {
                let prodOriginal = productos.find((producto) => producto.codigo === productoCarrito.codigo);
                if(productoCarrito.cantidad < prodOriginal.cantidad){
                    productoCarrito.cantidad++;
                    productoCarrito.subtotalEnvio += productoCarrito.envio;
                    productoCarrito.subtotalPrecio += productoCarrito.precio;
                    dibujarCarrito();
                }
                else{
                    let contenedorMensajeError = document.getElementById(`mjeError${productoCarrito.codigo}`);
                    contenedorMensajeError.innerText = "No hay más stock";
                }
            });
        }
    );
        
    cantidadProductosCarritoHtml.innerText = totalProductosCarrito || "";
    actualizarEstadoCarrito();
}

function desplegarAlertaConfirmarEliminacion(mensajeAdvertencia, mensajeConfirmacion, producto) {
    swal({
        title: "¿Desea proceder?",
        text: mensajeAdvertencia,
        icon: "warning",
        buttons: {
            cancelar: {
                text: "Cancelar",
                value: false,
                className: 'alert__btnCancelar'
            },
            confirmar: {
                text: "Confirmar",
                value: true,
                className: 'alert__btnConfirmar'
            }
        },
        dangerMode: true
    })
        .then((willDelete) => {
            if (willDelete) {
                swal(mensajeConfirmacion, {
                    icon: "success",
                    buttons: {
                        aceptar: {
                            text: "Aceptar",
                            value: true,
                            className: 'alert__btnConfirmar'
                        }
                    }
                });
                (producto == undefined) ? eliminarTodosProductosCarrito() : eliminarProductoCarrito(producto);
            } else {
                swal({
                    title: "Eliminación cancelada",
                    buttons: {
                        aceptar: {
                            text: "Aceptar",
                            value: true,
                            className: 'alert__btnConfirmar'
                        }
                    }
                });
            }
        });
}



//Inicialización de variables
let productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];
let seccionCarrito = document.getElementById("seccionCarrito");
let botonLimpiar = document.getElementById("btnLimpiar");
let botonFinalizar = document.getElementById("btnFinalizar");
let cantidadProductosCarritoHtml = document.getElementById("header__cantidad");
let subtotalEnvios = 0;
let subtotalPrecios = 0;
let totalProductosCarrito = 0;
const estandarFormatoMonedaPesos = Intl.NumberFormat("es-AR");

//Evento al botón de limpiar todos los productos del carrito
botonLimpiar.addEventListener("click", function(){
    desplegarAlertaConfirmarEliminacion("Todos los productos del carrito serán eliminados", "Se eliminaron todos los productos del carrito satisfactoriamente", undefined);
});

obtenerTodosProductos();
