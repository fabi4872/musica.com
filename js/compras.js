//Funciones
function agregarElementoHtmlSeccionCompras(compra, indice){  
    seccionCompras.innerHTML += `
        <tr>
            <th scope="row">#${compra.numeroPedido}</th>
            <td>${compra.fecha}</td>
            <td>
                <a type="button" id="productos${indice}">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </a>
            </td>
            <td>ARS ${estandarFormatoMonedaPesos.format(parseFloat(compra.subtotalEnvios + compra.subtotalPrecios).toFixed(2))}</td>
        </tr>
    `;
}

function armarSeccionVacia(){
     //Armado de mensaje sin compras
     seccionCompras.innerHTML = 
     `<div class="cardCompra">
         <div class="card-body cardCompra__body">
             <p class="cardCompra__sinCompras">
                 No hay compras para mostrar
             </p>
         </div>
     </div>`;
}

function dibujarCompras() {
    setTimeout(() => {
        seccionCompras.innerHTML = "";
        
        if (compras.length > 0){
            for(let i = 0; i < compras.length; i++){
                agregarElementoHtmlSeccionCompras(compras[i], i);
            }

            for(let i = 0; i < compras.length; i++){
                //Evento de click para ver detalle de productos
                botonProductos = document.getElementById(`productos${i}`);
                botonProductos.addEventListener("click", (e) => {
                    let text = "";
                    let modalBody = document.querySelector(".modal-body");
                    text = `
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">Modelo</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Envíos</th>
                                <th scope="col">Precios</th>
                            </tr>
                        </thead>
                        <tbody>
                    `;

                    for (let producto of compras[i].productos) {
                        text += `
                            <tr>
                                <th scope="row">${producto.modelo}</th>
                                <td>${producto.cantidad}</td>
                                <td>ARS ${estandarFormatoMonedaPesos.format(parseFloat(producto.subtotalEnvio).toFixed(2))}</td>
                                <td>ARS ${estandarFormatoMonedaPesos.format(parseFloat(producto.subtotalPrecio).toFixed(2))}</td>
                            </tr>
                        `;
                    }

                    text += `
                        </tbody>
                        </table>
                    `;

                    modalBody.innerHTML = text;
                    document.getElementById("botonModal").click();
                });
            }
        }
        else{
            armarSeccionVacia();
        }

        preload.classList.add("cerrar");
        preload.style.zIndex = -1;
    }, 2000);
}



//Inicialización de variables
let productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let compras = JSON.parse(localStorage.getItem("compras")) || [];
let seccionCompras = document.getElementById("seccionCompras");
const estandarFormatoMonedaPesos = Intl.NumberFormat("es-AR");

//Recuperación de elemento html para loading
let preload = document.querySelector(".preload");

//Manejo de cantidad compras en el html
let cantidadProductosComprasHtml = document.getElementById("header__cantidadCompras");
cantidadProductosComprasHtml.innerText = compras.length || "";

//Manejo de cantidad productos del carrito en el html
let cantidadProductosCarritoHtml = document.getElementById("header__cantidad");
cantidadProductosCarritoHtml.innerText = productosCarrito.length || "";

dibujarCompras();
