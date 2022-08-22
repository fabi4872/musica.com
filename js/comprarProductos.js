//Funciones
function habilitarBotonAgregar(){
    botonAgregar.classList.remove("disabled"); 
    botonAgregar.innerText = "Agregar";
}

function actualizarBotonAgregar(codigo, hayStock){
    let botonAgregar = document.getElementById(`btn${codigo}`);
    hayStock && habilitarBotonAgregar();
    botonAgregar.classList.add("disabled");
    botonAgregar.innerHTML = "Agotado";
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
    let cantidadActual = 0;    
    productoCarritoActual = productosCarrito.find((prod) => prod.codigo === producto.codigo);
    if(productoCarritoActual != undefined){
        cantidadActual += productoCarritoActual.cantidad;
        productosCarrito = productosCarrito.filter((prod) => prod.codigo !== producto.codigo);
    }
    
    cantidadActual += 1;

    let nuevoProductoCarrito = {
        ...producto,
        cantidad: cantidadActual,
        subtotalEnvio: producto.envio * cantidadActual,
        subtotalProducto: producto.precio * cantidadActual
    }

    productosCarrito.push(nuevoProductoCarrito);
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
    actualizarProductoDesdeProductoCarrito(nuevoProductoCarrito);
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

//Actualiza los productos a partir de los que están en el carrito (si corresponde)
productosCarrito && actualizarAllProductos();
