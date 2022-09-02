//Funciones
async function obtenerTodosProductos(){
    const URLPRODUCTOS = "./js/productos.json";
    let response = await fetch(URLPRODUCTOS);
    let data = await response.json();
    productos = data;
    cargarSeccionProductos();
    cargarEventosBotonesAgregar();

    //Actualiza los productos a partir de los que están en el carrito (si corresponde)
    productosCarrito && actualizarAllProductos();
}

function cargarSeccionProductos(){
    productos.forEach(producto => {
        let card = document.createElement("div");
        let imageContainer = document.createElement("div");
        let image = document.createElement("img");
        let body = document.createElement("div");
    
        //Seteo de clase de la tarjeta
        card.className = "col-12 col-md-6 col-lg-3 card cardProducto";
    
        //Seteo de clase para el contenedor de la imagen
        imageContainer.className = "cardProducto__imageContainer";
    
        //Seteo de atributos y clase de la imagen
        image.setAttribute("src", producto.imagen);
        image.setAttribute("alt", "Imagen de producto");
        image.className = "card-img-top cardProducto__imagen";
    
        //Seteo de innerHTML para el cuerpo
        let valorCuota = Math.round(producto.precio/producto.cuotas);
        body.innerHTML = `
            <h5 class="card-title cardProducto__marca">${producto.marca.toUpperCase()}</h5>
            <h6 class="card-subtitle mb-2 text-muted cardProducto__modelo">Modelo ${producto.modelo.toUpperCase()}</h6>
            <p class="card-text cardProducto__descripcion">${producto.descripcion}</p>
            <h3 class="cardProducto__precio"><strong class="cardProducto__strongPrecio">ARS ${producto.precio}</strong><h3/>
            <p class="card-text cardProducto__info"><i class="fa-solid fa-credit-card cardProducto__icon"></i><small class="text-muted">${producto.cuotas} cuotas sin interés de <strong class="cardProducto__strong">ARS ${valorCuota}</strong></small></p>
            <p class="card-text cardProducto__info"><i class="fa-solid fa-truck cardProducto__icon"></i><small class="text-muted">Costo de envío: <strong class="cardProducto__strong">ARS ${producto.envio}</strong></small></p>
            <p class="card-text cardProducto__info"><i class="fa-solid fa-business-time cardProducto__icon"></i><small class="text-muted">Cantidad en stock: <strong class="cardProducto__stock cardProducto__strong" id="cantidad${producto.codigo}">${producto.cantidad}</strong></small></p>
        `;
        body.className = "card-body cardProducto__body";
    
        //Agregaciones
        imageContainer.appendChild(image);
        card.appendChild(imageContainer);
        card.appendChild(body);
        card.innerHTML += `
        <div class="cardProducto__botonContainer">
            <button class="btn btn-primary cardProducto__boton" id="btn${producto.codigo}">Agregar</button>
        </div>`;
        seccionProductos.appendChild(card);
    });

    //Variable para cantidad total de productos (se muestra junto al ícono de carrito, en el header)
    totalProductosCarrito = calcularTotalProductosCarrito();

    //Recuperación y seteo de cantidad de productos en el html 
    cantidadProductosCarritoHtml = document.getElementById("header__cantidad");
    cantidadProductosCarritoHtml.innerText = totalProductosCarrito || "";
}

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

function validarStockProducto(cantidadActual, {codigo}){
    cantidadActual < 1 ? actualizarBotonAgregar(codigo, false) : actualizarBotonAgregar(codigo, true);
}

function actualizarProductoDesdeProductoCarrito({codigo: codigoProductoCarrito, cantidad: cantidadProductoCarrito}){
    let productoInicial = productos.find((prod) => prod.codigo === codigoProductoCarrito);
    let elementoCantidadProducto = document.getElementById(`cantidad${codigoProductoCarrito}`);
    let cantidadActual = productoInicial.cantidad - cantidadProductoCarrito;
    elementoCantidadProducto.innerText = cantidadActual;
    validarStockProducto(cantidadActual, productoInicial);
}

function actualizarAllProductos(){
    productosCarrito = (JSON.parse(localStorage.getItem("carrito")) || []);
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
    actualizarAllProductos();
    cantidadProductosCarritoHtml.innerText = totalProductosCarrito;
}

function calcularTotalProductosCarrito(){
    return productosCarrito.reduce((acumulador, producto) => (acumulador + producto.cantidad), 0);
}

function desplegarAlertaAgregar({descripcion}) {
    swal({
        title: "¡Producto agregado!",
        text: `Producto ${descripcion} agregado al carrito satisfactoriamente`,
        icon: "success",
        buttons: {
            aceptar: {
                text: "Aceptar",
                value: true,
                className: 'alert__btnConfirmar'
            }
        }
      });
}

function cargarEventosBotonesAgregar(){
    productos.forEach(
        (producto) => {
            let boton = document.getElementById(`btn${producto.codigo}`);
            
            boton.addEventListener("click", (e) => {
                boton.classList.toggle("disabled");
                boton.innerHTML += 
                `<div class="spinner-border text-light cardProducto__loading" role="status">
                    <span class="sr-only">Loading...</span>
                </div>`;
                setTimeout(() => {
                    boton.innerHTML = `<button class="btn btn-primary cardProducto__boton" id="btn${producto.codigo}">Agregar</button>`;
                    agregarProductoCarrito(producto);
                    desplegarAlertaAgregar(producto);
                }, 2000);
            });
        }
    ); 
}



//Recuperación del elemento html sección de productos
let seccionProductos = document.getElementById("seccionProductos");

//Inicialización array de productos
let productos = [];

//Recuperación de productos del carrito en localStorage
let productosCarrito = (JSON.parse(localStorage.getItem("carrito")) || []);

//Declaración de variables necesarias para manejar la cantidad de productos del carrito
let totalProductosCarrito;
let cantidadProductosCarritoHtml;

obtenerTodosProductos();
