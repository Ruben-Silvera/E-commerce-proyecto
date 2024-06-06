class Producto {
    constructor(id, nombre, precio, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
    }
}

const calcularTotalCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id == item.id);
        total += producto.precio * item.cantidad;
    });

    return total;
};

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

    const totalCarritoElement = document.getElementById('total-carrito');
    totalCarritoElement.textContent = `Total: $${calcularTotalCarrito().toFixed(2)}`;
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
    renderizarCarrito();
    
    Swal.fire({
        title: 'Producto Agregado',
        text: 'El producto se ha agregado al carrito.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
};

const quitarDelCarrito = (productId) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id != productId);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
};

const vaciarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'El carrito ya está vacío.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carrito');
            renderizarCarrito();
            Swal.fire({
                title: "¡Eliminado!",
                text: "Tu carrito ha sido vaciado.",
                icon: "success"
            });
        }
    });
};

const finalizarCompra = () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'No hay productos en el carrito.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas finalizar la compra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, comprar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '¡Compra finalizada!',
                text: 'Disfrute de su compra',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('carrito');
                renderizarCarrito();
            });
        }
    });
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
    document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
});
