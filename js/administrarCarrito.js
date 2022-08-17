//Funciones
function validarStockProductoActualizarBotonAgregar(indiceProducto, cantidadStock){
    if(cantidadStock < 1){
        botones[indiceProducto].classList.add("disabled");
    }
    else {
        botones[indiceProducto].classList.remove("disabled");
    }
}


function actualizarLocalStorageCarrito(){
    //Actualizo localStorage
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
}


function habilitarDeshabilitarBotonLimpiador(){
    let botonLimpiar = document.getElementById("btnLimpiar");
    if(productosCarrito.length == 0){
        botonLimpiar.classList.add("disabled");
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
            <img class="cardProductoCarrito__imagen" src="${producto.Imagen}" alt="Imagen de producto" />
        </div>
        <div class="cardProductoCarrito__detalle flexVertical">
            <h5 class="card-title cardProductoCarrito__marca">${producto.Marca.toUpperCase()}</h5>
            <h6 class="card-subtitle mb-2 text-muted cardProductoCarrito__modelo">Modelo ${producto.Modelo.toUpperCase()}</h6>
            <p class="card-text cardProductoCarrito__descripcion mt-2">${producto.Descripcion}</p>
        </div>
        <div class="cardProductoCarrito__precios flexVertical">
            <h6 class="cardProductoCarrito__titulo">Envío</h6>
            <h5 class="cardProductoCarrito__envio cardProductoCarrito__importe">ARS ${producto.Envio}</h5>
            <h6 class="cardProductoCarrito__titulo mt-3">Precio</h6>
            <h5 class="cardProductoCarrito__precio cardProductoCarrito__importe">ARS ${producto.Precio}</h5>
        </div>
        <div class="cardProductoCarrito__subTotales flexVertical">
            <h6 class="cardProductoCarrito__titulo">Subtotal Envío</h6>
            <h5 class="cardProductoCarrito__subTotalEnvio cardProductoCarrito__importe">ARS ${producto.SubTotalEnvio}</h5>
            <h6 class="cardProductoCarrito__titulo mt-3">Subtotal Precio</h6>
            <h5 class="cardProductoCarrito__subTotalPrecio cardProductoCarrito__importe">ARS ${producto.SubTotalPrecio}</h5>
        </div>
        <div class="cardProductoCarrito__cantidades flexVertical">
            <h6 class="cardProductoCarrito__titulo">Cantidad</h6>
            <h5 class="cardProductoCarrito__cantidad">${producto.Cantidad}</h5>
        </div>
        <button class="cardProductoCarrito__botonDelete" id="btnEliminar${producto.Modelo}">
            <i class="fa-solid fa-trash-can cardProductoCarrito__iconDelete"></i>
        </button>
    `;

    cardProductoCarrito.appendChild(cardProductoCarritoBody);
    
    return cardProductoCarrito;
}
    

function agregarProductoCarrito(producto, indiceProducto){
    let productoExistenteCarrito = productosCarrito.find(prod => prod.Descripcion === producto.Descripcion);
    let seccionCarrito = document.getElementById("seccionCarrito");

    if(productoExistenteCarrito == undefined){
        let productoCarrito = new Producto(producto.Imagen, producto.Marca, producto.Modelo, producto.Descripcion, producto.Cuotas, producto.Envio, producto.Precio, 1);
        productosCarrito.push(productoCarrito);
        let nuevoElementoCarrito = armarRetornarElementoCarrito(productoCarrito);
        seccionCarrito.appendChild(nuevoElementoCarrito);

        //Adhiero evento click al botón eliminar
        document.getElementById(`btnEliminar${productoCarrito.Modelo}`).addEventListener("click", function(){
            eliminarProductoCarrito(productoCarrito);
        });
    }
    else{
        productoExistenteCarrito.actualizarSubTotalPrecio(producto.Precio);
        productoExistenteCarrito.actualizarSubTotalEnvio(producto.Envio);
        productoExistenteCarrito.actualizarCantidad();

        let indiceProductoCarrito;
        for(let i=0; i<productosCarrito.length; i++){
            if(productosCarrito[i].Descripcion === productoExistenteCarrito.Descripcion){
                indiceProductoCarrito = i;
                break;
            }
        }

        let cantidades = document.getElementsByClassName("cardProductoCarrito__cantidad");
        let envios = document.getElementsByClassName("cardProductoCarrito__subTotalEnvio");
        let precios = document.getElementsByClassName("cardProductoCarrito__subTotalPrecio");
        
        cantidades[indiceProductoCarrito].innerHTML = productoExistenteCarrito.Cantidad;
        envios[indiceProductoCarrito].innerHTML = `ARS ${productoExistenteCarrito.SubTotalEnvio}`;
        precios[indiceProductoCarrito].innerHTML = `ARS ${productoExistenteCarrito.SubTotalPrecio}`;
    }

    producto.Cantidad -= 1;
    let cantidadesStock = document.getElementsByClassName("cardProducto__stock");
    cantidadesStock[indiceProducto].innerHTML = producto.Cantidad;

    validarStockProductoActualizarBotonAgregar(indiceProducto, producto.Cantidad);
    actualizarLocalStorageCarrito();
    habilitarDeshabilitarBotonLimpiador();
}


function eliminarProductoCarrito(productoCarrito){
    //Actualizaciones en carrito y productos publicados
    let indiceProductoCarrito = productosCarrito.indexOf(productoCarrito);
    productosCarrito.splice(indiceProductoCarrito, 1);
    let productoPublicado = productos.find(prod => prod.Descripcion === productoCarrito.Descripcion);
    productoPublicado.Cantidad += productoCarrito.Cantidad;
    
    //Actualizaciones en HTML (sección carrito y sección productos)
    let indiceProductoPublicado = productos.indexOf(productoPublicado);
    let cardsProductosCarrito = document.getElementsByClassName("cardProductoCarrito");
    let cantidadesStock = document.getElementsByClassName("cardProducto__stock");
    cantidadesStock[indiceProductoPublicado].innerHTML = productoPublicado.Cantidad;
    cardsProductosCarrito[indiceProductoCarrito].remove();

    //Actualizaciones de validación
    validarStockProductoActualizarBotonAgregar(indiceProductoPublicado, productoPublicado.Cantidad);
    actualizarLocalStorageCarrito();
    if(productosCarrito.length == 0){
        habilitarDeshabilitarBotonLimpiador();
        localStorage.removeItem("carrito");
    }
}







//Declaración de variables
let productosCarrito = [];
let botones = document.getElementsByClassName("cardProducto__boton");


//Recuperación de productos del carrito del localStorage
if(localStorage.getItem("carrito")){
    resultado = JSON.parse(localStorage.getItem("carrito"));
    resultado.forEach(producto => {
        let productoCarrito = new Producto(producto.Imagen, producto.Marca, producto.Modelo, producto.Descripcion, producto.Cuotas, producto.Envio, producto.Precio, producto.Cantidad);
        productoCarrito.actualizarSubTotalPrecio(producto.Precio * (producto.Cantidad - 1));
        productoCarrito.actualizarSubTotalEnvio(producto.Envio * (producto.Cantidad - 1));
        productosCarrito.push(productoCarrito);
    });
    let seccionCarrito = document.getElementById("seccionCarrito");
    for(const producto of productosCarrito){
        let productoExistente = productos.find(prod => prod.Descripcion === producto.Descripcion);
        let nuevoElementoCarrito = armarRetornarElementoCarrito(producto);
        seccionCarrito.appendChild(nuevoElementoCarrito);
        productoExistente.Cantidad -= producto.Cantidad;
        let cantidadesStock = document.getElementsByClassName("cardProducto__stock");
        let indiceProducto = productos.indexOf(productoExistente);
        cantidadesStock[indiceProducto].innerHTML = productoExistente.Cantidad;

        //Adhiero evento click al botón eliminar
        document.getElementById(`btnEliminar${producto.Modelo}`).addEventListener("click", function(){
            eliminarProductoCarrito(producto);
        });
    }

    habilitarDeshabilitarBotonLimpiador();
}


for(let i=0; i<botones.length; i++){
    validarStockProductoActualizarBotonAgregar(i, productos[i].Cantidad);

    botones[i].onclick = () => {    
        agregarProductoCarrito(productos[i], i);
    };
}
