//Funciones
async function obtenerTodosProductos() {
    main.innerHTML = "";
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
    generarCargas(productos);
    productosFiltros = productos;
    categoriasFiltros = categorias;
    marcasFiltros = marcas;
}

function obtenerCategorias(productosFiltros){
    let arrayCategorias = [];
    let descripcionCategorias = [];
    productosFiltros.forEach((producto) => {
        for(const categoria of categorias){
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
        <input class="form-check-input seccionParametros__check" type="checkbox" id="categoria${i}" />
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

    for(let i=0; i<categoriasFiltros.length; i++){
        document.getElementById(`categoria${i}`).addEventListener("change", (e) => {
            filtrar();
        });
    }

    for(let i=0; i<marcasFiltros.length; i++){
        document.getElementById(`marca${i}`).addEventListener("change", (e) => {
            filtrar();
        });
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
        productosFiltros = productos;
        buscar();
    });
    inputBuscar.addEventListener("keyup", (event) => {
        if (event.key === "Enter")
        {
            botonBuscar.click();
        }
    });
}

function buscar(){
    preload.classList.remove("cerrar");
    preload.style.zIndex=90000;

    let valorInputBuscar = removerAcentos(inputBuscar.value.trim());
    let arrayPalabrasBusqueda = (valorInputBuscar.split(" ")).filter((palabra) => palabra != "");
    productosFiltros = productosFiltros.filter((producto) => {
        let arrayPalabrasProducto = obtenerPalabrasClaveProducto(`${producto.marca.trim()} ${producto.modelo.trim()} ${producto.descripcion.trim()}`);

        for(const palabra of arrayPalabrasBusqueda){
            if (arrayPalabrasProducto.includes(palabra.toUpperCase())){
                return producto;
            }
            else{
                break;
            }
        }
    });

    categoriasFiltros = obtenerCategorias(productosFiltros);
    marcasFiltros = obtenerMarcas(categoriasFiltros);
    generarCargas(productosFiltros);    
}

function cargarConOrden(productos) {
    let productosConOrden;
    let orden = parseInt(localStorage.getItem("orden"));

    if(orden == 1){
        productosConOrden = productos.sort((a, b) => { return (a.codigo - b.codigo) });
    }
    else if (orden == 2) {
        productosConOrden = productos.sort((a, b) => { return (a.precio - b.precio) });
    }
    else if (orden == 3) {
        productosConOrden = productos.sort((a, b) => { return (b.precio - a.precio) });
    }

    cargarSeccionProductos(productosConOrden);
    cargarEventosBotonesAgregar(productosConOrden);

    //Actualiza los productos a partir de los que están en el carrito (si corresponde)
    productosCarrito && actualizarAllProductos(productosConOrden);
}

function filtrar(){
    productosMostrar = [];
    let cantidad = 0;

    for(const categoria of categoriasFiltros){
        if(document.getElementById(`categoria${cantidad}`).checked){
            categoria.productos.forEach((producto) => {
                !productosMostrar.includes(producto) && productosMostrar.push(producto);
            });
        }
        cantidad++;
    }

    cantidad = 0;

    for(const marca of marcasFiltros){
        if(document.getElementById(`marca${cantidad}`).checked){
            marca.productos.forEach((producto) => {
                !productosMostrar.includes(producto) && productosMostrar.push(producto);
            });
        }
        cantidad++;
    }
       
    (productosMostrar.length == 0) ? cargarConOrden(productosFiltros) : cargarConOrden(productosMostrar);
}

function generarCargas(productos){
    main.innerHTML = "";
    setTimeout(() => {
        if(productos.length > 0){
            armarEstructuraHtmlProductos();
            cargarConOrden(productos);
            armarSeccionFiltros();
        }
        else{
            armarEstructuraHtmlBusquedaVacia();
        }
        
        preload.classList.add("cerrar");
        preload.style.zIndex = -1;
    }, 2000);
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
            <p class="card-text cardProducto__info"><i class="fa-solid fa-credit-card cardProducto__icon"></i><small class="text-muted">${producto.cuotas} cuotas de <strong class="cardProducto__strong">ARS ${valorCuota}</strong></small></p>
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

//Arma estructura html para productos dentro del main de index
function armarEstructuraHtmlProductos(){
    main.innerHTML = `
        <section class="col-12 col-lg-2 seccionParametros" id="seccionParametros">
            <article class="p-4 seccionParametros__items" id="categorias">
                <select class="col-12 form-select seccionProductos__select mb-5" id="orden">
                    <option value="1">Más relevantes</option>
                    <option value="2" id="valor2">Menor precio</option>
                    <option value="3" id="valor3">Mayor precio</option>
                </select>

                <h5 class="seccionParametros__titulo mb-2">
                    <strong class="seccionParametros__strong" id="strongCategorias">Categorías</strong>
                </h5>

                <div class="seccionParametros__detalleCategorias" id="detalleCategorias"">

                </div>
            </article>

            <article class="p-4 seccionParametros__items" id="marcas">
                <h5 class="seccionParametros__titulo mb-2">
                    <strong class="seccionParametros__strong" id="strongMarcas">Marcas</strong>
                </h5>  

                <div class="seccionParametros__detalleMarcas" id="detalleMarcas"">

                </div>
            </article>
        </section>

        <section class="col-12 col-lg-8 seccionProductos" id="seccionProductos">
            
        </section>
    `;

    seccionProductos = document.getElementById("seccionProductos");
    seccionParametros = document.getElementById("seccionParametros");
    detalleCategorias = document.getElementById("detalleCategorias");
    detalleMarcas = document.getElementById("detalleMarcas");

    let orden = parseInt(localStorage.getItem("orden"));

    if(orden == 2){
        //Agrega selected al option 2
        document.getElementById("valor2").setAttribute("selected", "");
    }
    else if(orden == 3){
        //Agrega selected al option 3
        document.getElementById("valor3").setAttribute("selected", "");
    }

    document.getElementById("orden").addEventListener("change", () => {
        localStorage.setItem("orden", document.getElementById("orden").value);
        filtrar();
    });
}

//Arma estructura html para búsqueda vacía dentro del main de index
function armarEstructuraHtmlBusquedaVacia(){
    main.innerHTML = `
        <section class="seccionBusquedaVacia" id="seccionBusquedaVacia">
            <div class="seccionBusquedaVacia__imageContainer">
                <img class="seccionBusquedaVacia__image" src="./assets/images/sin-resultados-sb.png" alt="Imagen sin resultados">
            </div>

            <p class="seccionBusquedaVacia__descripcion">No hay resultados para mostrar</p>
        </section>
    `;
}



//Formato de moneda nacional
const estandarFormatoMonedaPesos = Intl.NumberFormat("es-AR");

//Recuperación del elemento html main
let main = document.getElementById("main");

//Recuperación de elemento html para loading
let preload = document.querySelector(".preload");

//Recuperación de los elementos html del buscador
let botonBuscar = document.getElementById("btnBuscar");
let inputBuscar = document.getElementById("inputBuscar");

//Declaración del elemento html sección de productos
let seccionProductos;

//Declaración del elemento html sección de parámetros
let seccionParametros;

//Declaración de elementos html de categorías y marcas
let detalleCategorias;
let detalleMarcas;

//Inicialización de arrays
let productos = [];
let categorias = [];
let marcas = [];
let productosFiltros = [];
let productosMostrar = [];
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
