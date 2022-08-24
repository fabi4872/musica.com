//Funciones
function actualizarBotonAgregar(codigo, hayStock){
    let botonAgregar = document.getElementById(`btn${codigo}`);
    if(hayStock){
        botonAgregar.classList.remove("disabled"); 
        botonAgregar.innerText = "Agregar";
        return true;
    }
    botonAgregar.classList.add("disabled");
    botonAgregar.innerHTML = "Agotado";
    return false;
}

function validarStockProducto({codigo, cantidad}){
    cantidad < 1 ? actualizarBotonAgregar(codigo, false) : actualizarBotonAgregar(codigo, true);
}

function actualizarProductoDesdeProductoCarrito({codigo: codigoProductoCarrito, cantidad: cantidadProductoCarrito}){
    let producto = productos.find((prod) => prod.codigo === codigoProductoCarrito);
    let indice = productos.indexOf(producto);
    let productoInicial = JSON.parse(localStorage.getItem("productos"))[indice];
    let elementoCantidadProducto = document.getElementById(`cantidad${producto.codigo}`);
    producto.cantidad = productoInicial.cantidad - cantidadProductoCarrito;
    elementoCantidadProducto.innerText = producto.cantidad;
    validarStockProducto(producto);
}

function actualizarAllProductos(){
    productosCarrito.forEach((productoCarrito) => {
        actualizarProductoDesdeProductoCarrito(productoCarrito);
    });
}

function agregarProductoCarrito(producto){  
    totalProductosCarrito++;
    let productoCarritoActual;

    productoCarritoActual = productosCarrito.find((prod) => prod.codigo === producto.codigo);
    
    if(productoCarritoActual != undefined){
        productoCarritoActual.cantidad += 1;
        productoCarritoActual.subtotalEnvio = producto.envio * productoCarritoActual.cantidad;
        productoCarritoActual.subtotalPrecio = producto.precio * productoCarritoActual.cantidad;
    }
    else{
        productoCarritoActual = {
            ...producto,
            cantidad: 1,
            subtotalEnvio: producto.envio,
            subtotalPrecio: producto.precio
        }
    
        productosCarrito.push(productoCarritoActual);
    }
    
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
    actualizarProductoDesdeProductoCarrito(productoCarritoActual);
    cantidadProductosCarritoHtml.innerText = totalProductosCarrito;
}

function calcularTotalProductosCarrito(){
    return productosCarrito.reduce((acumulador, producto) => (acumulador + producto.cantidad), 0);
}



//Eventos a los botones de agregar
productos.forEach(
    (producto) => {
        let boton = document.getElementById(`btn${producto.codigo}`);

        boton.addEventListener("click", (e) => {
            agregarProductoCarrito(producto);
        });
    }
);

//Recuperación de productos del carrito en localStorage
let productosCarrito = (JSON.parse(localStorage.getItem("carrito")) || []);

//Variable para cantidad total de productos (se muestra junto al ícono de carrito, en el header)
let totalProductosCarrito = calcularTotalProductosCarrito();
let cantidadProductosCarritoHtml = document.getElementById("header__cantidad");
cantidadProductosCarritoHtml.innerText = totalProductosCarrito || "";

//Actualiza los productos a partir de los que están en el carrito (si corresponde)
productosCarrito && actualizarAllProductos();
