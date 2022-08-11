class ProductoCarrito{
    constructor(producto){
        this.Imagen = producto.Imagen, 
        this.Marca = producto.Marca, 
        this.Modelo = producto.Modelo, 
        this.Descripcion = producto.Descripcion, 
        this.Precio = producto.Precio,
        this.Envio = producto.Envio,
        this.SubTotalPrecio = producto.Precio,
        this.SubTotalEnvio = producto.Envio, 
        this.Cantidad = 1
    }

    actualizarSubTotalPrecio(precio){
        this.SubTotalPrecio += precio;
    }

    actualizarSubTotalEnvio(envio){
        this.SubTotalEnvio += envio;
    }

    actualizarCantidad(){
        this.Cantidad = this.Cantidad + 1;
    }
}



//Declaración de variables
let productosCarrito = [];
let botones = document.getElementsByClassName("cardProducto__boton");


function validarStockProductoActualizarBotonAgregar(indiceProducto, cantidadStock){
    if(cantidadStock < 1){
        botones[indiceProducto].remove();
        let botonesContainers = document.getElementsByClassName("cardProducto__botonContainer");
        botonesContainers[indiceProducto].innerHTML += `<button class="btn btn-primary cardProducto__boton" disabled>Agregar</button>`;
    }
}


function armarRetornarElementoCarrito(producto){
    let cardProductoCarrito = document.createElement("div");
    let cardProductoCarritoBody = document.createElement("div");
    cardProductoCarrito.className = "card cardProductoCarrito";
    cardProductoCarritoBody.className = "card-body cardProductoCarrito__body";
    
    cardProductoCarritoBody.innerHTML = `
        <h5 class="card-title cardProductoCarrito__marca">${producto.Marca}</h5>
        <h6 class="card-subtitle mb-2 text-muted cardProductoCarrito__modelo">Modelo ${producto.Modelo}</h6>
        <p class="card-text cardProductoCarrito__descripcion">${producto.Descripcion}</p>
        <h6 class="cardProductoCarrito__precio">Precio unitario: <strong class="cardProductoCarrito__strongPrecio">ARS ${producto.Precio}</strong><h6/>
        <h6 class="cardProductoCarrito__envio">Precio de envío: <strong class="cardProductoCarrito__strongEnvio">ARS ${producto.Envio}</strong><h6/>
        <h6 class="cardProductoCarrito__cantidad">CANTIDAD: <strong class="cardProductoCarrito__strongCantidad">${producto.Cantidad}</strong><h6/>
        <h6 class="cardProductoCarrito__subTotalEnvio">SUBTOTAL ENVIO: <strong class="cardProductoCarrito__strongSubTotalEnvio">ARS ${producto.SubTotalEnvio}</strong><h6/>
        <h6 class="cardProductoCarrito__subTotalPrecio">SUBTOTAL PRECIO: <strong class="cardProductoCarrito__strongSubTotalPrecio">ARS ${producto.SubTotalPrecio}</strong><h6/>
    `;

    cardProductoCarrito.appendChild(cardProductoCarritoBody);
    
    return cardProductoCarrito;
}
    

function agregarProductoCarrito(producto, indiceProducto){
    let productoExistenteCarrito = productosCarrito.find((prod) => prod.Descripcion === producto.Descripcion);
    let seccionCarrito = document.getElementById("seccionCarrito");

    if(productoExistenteCarrito == undefined){
        let productoCarrito = new ProductoCarrito(producto);
        productosCarrito.push(productoCarrito);
        let nuevoElementoCarrito = armarRetornarElementoCarrito(productoCarrito);
        seccionCarrito.appendChild(nuevoElementoCarrito);
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

        let strongCantidades = document.getElementsByClassName("cardProductoCarrito__strongCantidad");
        let strongSubTotalesEnvios = document.getElementsByClassName("cardProductoCarrito__strongSubTotalEnvio");
        let strongSubTotalesPrecios = document.getElementsByClassName("cardProductoCarrito__strongSubTotalPrecio");
        
        strongCantidades[indiceProductoCarrito].innerHTML = productoExistenteCarrito.Cantidad;
        strongSubTotalesEnvios[indiceProductoCarrito].innerHTML = `ARS ${productoExistenteCarrito.SubTotalEnvio}`;
        strongSubTotalesPrecios[indiceProductoCarrito].innerHTML = `ARS ${productoExistenteCarrito.SubTotalPrecio}`;
    }

    producto.Stock = producto.Stock - 1;
    let cantidadesStock = document.getElementsByClassName("cardProducto__stock");
    cantidadesStock[indiceProducto].innerHTML = producto.Stock;

    validarStockProductoActualizarBotonAgregar(indiceProducto, producto.Stock);
}


for(let i=0; i<botones.length; i++){
    validarStockProductoActualizarBotonAgregar(i, productos[i].Stock);

    botones[i].onclick = () => {    
        agregarProductoCarrito(productos[i], i);
    };
}
