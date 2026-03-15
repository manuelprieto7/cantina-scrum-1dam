// Cargamos los datos del menú desde el fichero JSON
fetch('../data/menu.json')
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        mostrarMenu(datos.menu);
    })
    .catch(function(error) {
        console.error('Error al cargar el menú:', error);
    });



    // Esta función recibe el array de productos y los pinta en pantalla
function mostrarMenu(productos) {

    // Vaciamos los contenedores por si acaso
    document.getElementById('bebidas').innerHTML = '';
    document.getElementById('bocadillos').innerHTML = '';
    document.getElementById('tostadas').innerHTML = '';

    // Recorremos cada producto del JSON
    productos.forEach(function(producto) {

        // Creamos la tarjeta HTML del producto
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
        tarjeta.innerHTML = `
            <span class="emoji">${producto.emoji}</span>
            <h4>${producto.nombre}</h4>
            <p class="precio">${producto.precio.toFixed(2)} €</p>
        `;

        // La insertamos en su categoría correspondiente
        document.getElementById(producto.categoria).appendChild(tarjeta);
    });
}