let seccionProductos = document.getElementById("seccionProductos");

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
