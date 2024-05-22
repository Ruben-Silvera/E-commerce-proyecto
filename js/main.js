
class Producto {
    constructor(id, nombre, precio, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
    }
}


const cargarProductos = async () => {
    try {
        const response = await fetch('data/producto.json');
        const productosData = await response.json();

        return productosData.map(producto => new Producto(producto.id, producto.name, producto.price, producto.image));
    } catch (error) {
        console.error("Error al cargar productos:", error);
        return [];
    }
};


const renderizarProductos = (productos) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>Precio: $${producto.precio}</p>
            <button data-id="${producto.id}">Agregar al Carrito</button>
        `;

        productList.appendChild(productCard);
    });
};


const renderizarCarrito = () => {
    const cartList = document.getElementById('cart-list');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    cartList.innerHTML = '';

    carrito.forEach(item => {
        const producto = productos.find(p => p.id == item.id);
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${producto.nombre} (x${item.cantidad}) - $${producto.precio * item.cantidad}
            <button data-id="${item.id}">Quitar</button>
        `;
        cartList.appendChild(cartItem);
    });
};


const agregarAlCarrito = (productId) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoEnCarrito = carrito.find(item => item.id == productId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ id: productId, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto añadido al carrito:', productId);
    renderizarCarrito();
};


const quitarDelCarrito = (productId) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id != productId);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto quitado del carrito:', productId);
    renderizarCarrito();
};


const vaciarCarrito = () => {
    localStorage.removeItem('carrito');
    console.log('Carrito vaciado');
    renderizarCarrito();
};

document.addEventListener('DOMContentLoaded', async () => {
    productos = await cargarProductos();
    renderizarProductos(productos);
    renderizarCarrito();


    document.getElementById('product-list').addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const productId = event.target.dataset.id;
            agregarAlCarrito(productId);
        }
    });


    document.getElementById('cart-list').addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const productId = event.target.dataset.id;
            quitarDelCarrito(productId);
        }
    });


    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
});



const finalizarCompra = () => {
    vaciarCarrito();
    alert('Finalizar compra PD: El profe no tiene 17'); 
};


document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
