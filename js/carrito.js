// carrito.js - Array del carrito y funciones para añadir, quitar y mostrar total

var carrito = [];

function agregarProducto(producto) {
  var item = carrito.find(function (i) {
    return i.id === producto.id;
  });

  if (item) {
    item.cantidad = item.cantidad + 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      emoji: producto.emoji,
      cantidad: 1,
    });
  }

  actualizarTotal();
}

function quitarProducto(producto) {
  var item = carrito.find(function (i) {
    return i.id === producto.id;
  });

  if (item) {
    item.cantidad = item.cantidad - 1;
    if (item.cantidad === 0) {
      carrito = carrito.filter(function (i) {
        return i.id !== producto.id;
      });
    }
  }

  actualizarTotal();
}

function actualizarTotal() {
  var total = carrito.reduce(function (suma, item) {
    return suma + item.precio * item.cantidad;
  }, 0);

  var elementoTotal = document.getElementById("total");
  if (elementoTotal) {
    elementoTotal.textContent = total.toFixed(2) + " €";
  }
}
