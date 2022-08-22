class Producto{
    constructor(codigo, imagen, marca, modelo, descripcion, cuotas, envio, precio, cantidad){
        this.codigo = codigo,
        this.imagen = imagen,
        this.marca = marca,
        this.modelo = modelo,
        this.descripcion = descripcion,
        this.cuotas = cuotas,
        this.envio = envio,
        this.precio = precio,
        this.cantidad = cantidad
    }
}

const productos = [];

const producto1 = new Producto(1, "assets/kurzweil_sp2x.jpg", "Kurzweil", "Sp2x", "Piano eléctrico Kurzweil Sp2x, 88 teclas con peso piano martillo", 6, 1500, 200000, 10);
const producto2 = new Producto(2, "assets/cort_x250_bk.jpg", "Cort", "X250-bk", "Guitarra eléctrica Cort X250-BK, cuerpo sólido con dos cutaways", 12, 700, 300000, 5);
const producto3 = new Producto(3, "assets/knight_jbts_100.jpg", "Knight", "Jbts-100", "Saxo tenor Knight JBTS-100 Laqueado, llave de F#", 9, 2500, 400000, 2);
const producto4 = new Producto(4, "assets/focusrite_scarlett_2i4.jpg", "Focusrite", "Scarlett 2i4", "Placa de sonido Focusrite Scarlett 2i4 USB", 12, 350, 100000, 25);

productos.push(producto1, producto2, producto3, producto4);
localStorage.setItem("productos", JSON.stringify(productos));
