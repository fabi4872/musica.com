let productos = [];
let productosCarrito = [];
let detalleProductos = [];
let cuponDescuento = "";
let descripcionDescuentoProducto = "";
let descripcionProductos = "";
let descripcionPromptAgregarProductos = "";
let descripcionPromptProducto = "";
let importeTotalSinDescuentos = 0;
let opcion;
let codigoProducto;
let cantidad;


class Producto{
    constructor(codigo, descripcion, precio, cantidad){
        this.codigo = codigo,
        this.descripcion = descripcion.toUpperCase(),
        this.precio = parseFloat(precio),
        this.cantidad = cantidad
    }

    implementarDescuentoDiezPorCiento(){
        this.precio = this.precio * 0.9;
    }
}


//-------- Funciones --------
function cargarProductosEnStock(){
    const producto1 = new Producto(1, "Piano", 190000, 2);
    const producto2 = new Producto(2, "Saxofon", 600000, 1);
    const producto3 = new Producto(3, "Flauta", 100000, 3);
    const producto4 = new Producto(4, "Guitarra", 200000, 2);
    const producto5 = new Producto(5, "Bateria", 700000, 2);

    productos.push(producto1, producto2, producto3, producto4, producto5);

    detalleProductos = productos.map((producto) => {
        return {
            codigo: producto.codigo,
            descripcion: producto.descripcion
        }
    });

    descripcionProductos = "";
    detalleProductos.forEach((producto) => descripcionProductos += producto.codigo + ". " + producto.descripcion + "\n");
    descripcionProductos += "0. Volver";
}

function solicitarIngreso(cadena){
    return prompt(cadena);
}

function obtenerDescripcionPromptOperacion(){
    return "CARRITO\n1. Agregar productos\n2. Confirmar carrito\n\nOPERACIÓN";
}

function obtenerDescripcionPromptAgregarProductos(detalleProductos){
    return "AGREGAR PRODUCTOS\n" + detalleProductos + "\n\nPRODUCTO";
}

function obtenerDescripcionPromptProducto(producto){
    return "DETALLE DE PRODUCTO SELECCIONADO" + "\nCódigo: " + producto.codigo + "\nDescripción: " + producto.descripcion + "\nPrecio: ARS " + producto.precio + "\nStock: " + producto.cantidad + "\n\nCANTIDAD"; 
}

function obtenerDescripcionPromptCupon(){
    return "INGRESE OFF2022 PARA OBTENER 10% DE DESCUENTO\n\nCUPÓN";
}

function informarEnConsola(mensaje){
    console.log(mensaje);
}

function aplicarDescuento(descripcionDescuento, producto){
    let resultado = "";
    if(descripcionDescuento == "OFF2022"){
        resultado = "ARS " + (producto.precio*0.1); 
        producto.implementarDescuentoDiezPorCiento();
        return resultado;
    }
    
    return "No aplica";
}

const sumarImporte = (variable, importe) => { return variable += importe }

function calcularImporteTotalSinDescuentos(){
    productosCarrito.forEach((producto) => {
        let productoEncontrado = productos.find((prod) => prod.codigo == producto.codigo);
        importeTotalSinDescuentos += productoEncontrado.precio*producto.cantidad;
    });

    return importeTotalSinDescuentos;
}

function procesarAgregarProductos(){
    descripcionPromptAgregarProductos = obtenerDescripcionPromptAgregarProductos(descripcionProductos);
    codigoProducto = parseInt(solicitarIngreso(descripcionPromptAgregarProductos));

    while(codigoProducto != 0){
        let productoEncontrado = productos.find((producto) => producto.codigo == codigoProducto);
        
        if(productoEncontrado == undefined){
            alert("El código de producto ingresado es incorrecto.");
        }
        else{
            descripcionPromptProducto = obtenerDescripcionPromptProducto(productoEncontrado);
            cantidad = parseInt(solicitarIngreso(descripcionPromptProducto));
            if(cantidad <= productoEncontrado.cantidad){
                if(cantidad != 0)
                {
                    productoEncontrado.cantidad -= cantidad;
                    const producto = new Producto(productoEncontrado.codigo, productoEncontrado.descripcion, productoEncontrado.precio*cantidad, cantidad);
                    cuponDescuento = solicitarIngreso(obtenerDescripcionPromptCupon());
                    descripcionDescuentoProducto = aplicarDescuento(cuponDescuento, producto);
                    informarEnConsola("Código: " + producto.codigo + "\nDescripción: " + producto.descripcion + "\nPrecio: ARS " + producto.precio + "\nDescuento: " + descripcionDescuentoProducto + "\nCantidad: " + producto.cantidad);
                    productosCarrito.push(producto);
                }
            }
            else{
                alert("No hay stock para la cantidad solicitada.");
            }
        }
    
        codigoProducto = parseInt(solicitarIngreso(descripcionPromptAgregarProductos));
    }
}



//Comienzo
cargarProductosEnStock();

descripcionPrompt = obtenerDescripcionPromptOperacion();
opcion = solicitarIngreso(descripcionPrompt);
while(opcion != "2"){    
    switch(opcion){
        case "1":
            procesarAgregarProductos();
            break;

        default:
            alert("La opción ingresada es incorrecta.");
            break;
    }

    descripcionPrompt = obtenerDescripcionPromptOperacion();
    opcion = solicitarIngreso(descripcionPrompt);
}

importeTotalSinDescuentos = calcularImporteTotalSinDescuentos();
const importeTotal = productosCarrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
informarEnConsola("IMPORTE TOTAL SIN DESCUENTOS: ARS " + importeTotalSinDescuentos + "\nIMPORTE DESCUENTOS: ARS " + (importeTotalSinDescuentos - importeTotal) + "\nIMPORTE FINAL: ARS " + importeTotal);
