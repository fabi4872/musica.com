//Funciones
async function obtenerTodosProductos() {
    const URLPRODUCTOS = "./js/productos.json";
    let response = await fetch(URLPRODUCTOS);
    let data = await response.json();
    dataJson = data;

    //Recorre todas las categorías y se queda con los productos
    for(let i=0; i<data.categorias.length; i++){
        let categoria = {
            descripcion: data.categorias[i].descripcion,
            productos: data.categorias[i].productos
        }
        categorias.push(categoria);
        productos = productos.concat(data.categorias[i].productos);
    }

    marcas = obtenerMarcas(categorias);

    cargarEventoBuscar();
    cargarSeccionProductos(productos);
    cargarEventosBotonesAgregar(productos);

    //Actualiza los productos a partir de los que están en el carrito (si corresponde)
    productosCarrito && actualizarAllProductos(productos);

    productosFiltros = productos;
    categoriasFiltros = categorias;
    marcasFiltros = marcas;
    armarSeccionFiltros();
}

function obtenerCategorias(productosFiltros){
    let arrayCategorias = [];
    let descripcionCategorias = [];
    productosFiltros.forEach((producto) => {
        for(const categoria of categoriasFiltros){
            if(categoria.productos.includes(producto)){
                descripcionCategorias = arrayCategorias.map((elemento) => {return elemento.descripcion});
                if(descripcionCategorias.includes(categoria.descripcion)){
                    let indice = arrayCategorias.indexOf((cate) => cate.descripcion === categoria.descripcion);
                    arrayCategorias[indice].productos.push(producto);
                }
                else{
                    let categoriaNueva = {
                        descripcion: categoria.descripcion,
                        productos: []
                    }
                    categoriaNueva.productos.push(producto);
                    arrayCategorias.push(categoriaNueva);
                }
            }
        }
    });

    return arrayCategorias;
}

function obtenerMarcas(categorias){
    let arrayMarcas = [];
    let descripcionMarcas = [];
    categorias.forEach((categoria) => {
        for(const producto of categoria.productos){
            descripcionMarcas = arrayMarcas.map((elemento) => {return elemento.descripcion});
            if(descripcionMarcas.includes(producto.marca)){
                let indice = arrayMarcas.indexOf((marca) => marca.descripcion === producto.marca);
                arrayMarcas[indice].productos.push(producto);
            }
            else{
                let marca = {
                    descripcion: producto.marca,
                    productos: []
                }
                marca.productos.push(producto);
                arrayMarcas.push(marca);
            }
        }
    });

    return arrayMarcas;
}

function armarSeccionFiltros(){
    detalleCategorias.innerHTML = "";
    detalleMarcas.innerHTML = "";

    //Armado filtros categorías
    for(let i=0; i<categoriasFiltros.length; i++){
        detalleCategorias.innerHTML += 
        `<div class="form-check form-switch mt-2">
            <input class="form-check-input seccionParametros__check" type="checkbox" id="categoria${i}" >
            <label class="form-check-label seccionParametros__label" for="categoria${i}">${categoriasFiltros[i].descripcion} (${categoriasFiltros[i].productos.length})</label>
        </div>`;
    }

    //Armado filtros de marcas
    for(let i=0; i<marcasFiltros.length; i++){
        detalleMarcas.innerHTML += 
        `<div class="form-check form-switch mt-2">
            <input class="form-check-input seccionParametros__check" type="checkbox" id="marca${i}" >
            <label class="form-check-label seccionParametros__label" for="marca${i}">${marcasFiltros[i].descripcion} (${marcasFiltros[i].productos.length})</label>
        </div>`;
    }
}

function obtenerPalabrasClaveProducto(cadenaCompleta){
    let cadenaCompletaProducto = removerAcentos(cadenaCompleta);
    let arrayPalabrasProducto = (cadenaCompletaProducto.split(" ")).filter((palabra) => palabra != "");
    return arrayPalabrasProducto.map(palabra => {
        return palabra.toUpperCase();
    });
}

function cargarEventosBotonesAgregar(productos){
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

function cargarEventoBuscar(){
    botonBuscar.addEventListener("click", (e) => {
        filtrar();
    });
    inputBuscar.addEventListener("keyup", (event) => {
        if (event.key === "Enter")
        {
            botonBuscar.click();
        }
    });
}

function filtrar(){
    productosFiltros = [];
    let cumpleCondicion = false;
    let valorInputBuscar = removerAcentos(inputBuscar.value.trim());
    let arrayPalabrasBusqueda = (valorInputBuscar.split(" ")).filter((palabra) => palabra != "");
    productos.forEach((producto) => {
        let arrayPalabrasProducto = obtenerPalabrasClaveProducto(`${producto.marca.trim()} ${producto.modelo.trim()} ${producto.descripcion.trim()}`);

        for (const palabra of arrayPalabrasBusqueda) {
            if (arrayPalabrasProducto.includes(palabra.toUpperCase())) {
                cumpleCondicion = true;
            }
            else {
                cumpleCondicion = false;
                break;
            }
        }
        cumpleCondicion && productosFiltros.push(producto);
    });

    categoriasFiltros = obtenerCategorias(productosFiltros);
    marcasFiltros = obtenerMarcas(categoriasFiltros);
    cargarSeccionProductos(productosFiltros);
    cargarEventosBotonesAgregar(productosFiltros);

    //Actualiza los productos a partir de los que están en el carrito (si corresponde)
    productosCarrito && actualizarAllProductos(productosFiltros);

    armarSeccionFiltros();
}

function cargarSeccionProductos(productos){
    seccionProductos.innerHTML = "";
    productos.forEach(producto => {
        let card = document.createElement("div");
        let imageContainer = document.createElement("div");
        let image = document.createElement("img");
        let body = document.createElement("div");
    
        //Seteo de clase de la tarjeta
        card.className = "col-12 col-md-6 col-lg-4 card cardProducto";
    
        //Seteo de clase para el contenedor de la imagen
        imageContainer.className = "cardProducto__imageContainer";
    
        //Seteo de atributos y clase de la imagen
        image.setAttribute("src", producto.imagen);
        image.setAttribute("alt", "Imagen de producto");
        image.className = "card-img-top cardProducto__imagen";
    
        //Seteo de innerHTML para el cuerpo

        let valorCuota = estandarFormatoMonedaPesos.format(parseFloat(producto.precio/producto.cuotas).toFixed(2));
        body.innerHTML = `
            <h5 class="card-title cardProducto__marca">${producto.marca.toUpperCase()}</h5>
            <h6 class="card-subtitle mb-2 text-muted cardProducto__modelo">Modelo ${producto.modelo.toUpperCase()}</h6>
            <p class="card-text cardProducto__descripcion">${producto.descripcion}</p>
            <h3 class="cardProducto__precio"><strong class="cardProducto__strongPrecio">ARS ${estandarFormatoMonedaPesos.format(parseFloat(producto.precio).toFixed(2))}</strong><h3/>
            <p class="card-text cardProducto__info"><i class="fa-solid fa-credit-card cardProducto__icon"></i><small class="text-muted">${producto.cuotas} cuotas sin interés de <strong class="cardProducto__strong">ARS ${valorCuota}</strong></small></p>
            <p class="card-text cardProducto__info"><i class="fa-solid fa-truck cardProducto__icon"></i><small class="text-muted">Costo de envío: <strong class="cardProducto__strong">ARS ${estandarFormatoMonedaPesos.format(parseFloat(producto.envio).toFixed(2))}</strong></small></p>
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

function actualizarAllProductos(productos){
    productosCarrito = (JSON.parse(localStorage.getItem("carrito")) || []);
    productosCarrito.forEach((productoCarrito) => {
        let productoExistente = productos.find((prod) => prod.codigo === productoCarrito.codigo);
        productoExistente && actualizarProductoDesdeProductoCarrito(productoCarrito);
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
    actualizarAllProductos(productosFiltros);
    cantidadProductosCarritoHtml.innerText = totalProductosCarrito;
    armarSeccionFiltros();
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

//Función para eliminar acentos de una cadena
const removerAcentos = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 



//Formato de moneda nacional
const estandarFormatoMonedaPesos = Intl.NumberFormat("es-AR");

//Recuperación del elemento html sección de productos
let seccionProductos = document.getElementById("seccionProductos");

//Recuperación de elementos html de categorías y marcas
let seccionCategorias = document.getElementById("categorias");
let seccionMarcas = document.getElementById("marcas");
let detalleCategorias = document.getElementById("detalleCategorias");
let detalleMarcas = document.getElementById("detalleMarcas");

//Recuperación de los elementos html del buscador
let botonBuscar = document.getElementById("btnBuscar");
let inputBuscar = document.getElementById("inputBuscar");

//Inicialización de arrays
let productos = [];
let categorias = [];
let marcas = [];
let productosFiltros = [];
let categoriasFiltros = [];
let marcasFiltros = [];

//Json resultante de la consulta inicial de todos los productos
let dataJson;

//Recuperación de productos del carrito en localStorage
let productosCarrito = (JSON.parse(localStorage.getItem("carrito")) || []);

//Declaración de variables necesarias para manejar la cantidad de productos del carrito
let totalProductosCarrito;
let cantidadProductosCarritoHtml;

obtenerTodosProductos();
