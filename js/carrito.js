// carrito.js - Array del carrito, funciones para añadir, quitar, mostrar total y resumen

var carrito = [];
var franjaSeleccionada = null;

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
  actualizarResumen();
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
  actualizarResumen();
}

function eliminarProducto(id) {
  carrito = carrito.filter(function (i) {
    return i.id !== id;
  });

  // Resetear contador visual de la tarjeta correspondiente
  var tarjeta = document.querySelector(
    '.tarjeta-producto[data-id="' + id + '"]',
  );
  if (tarjeta) {
    tarjeta.querySelector(".cantidad").textContent = "0";
  }

  actualizarTotal();
  actualizarResumen();
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

// ---- FRANJA HORARIA ----
function guardarFranja(franja) {
  franjaSeleccionada = franja;
  actualizarResumen();
}

// ---- RESUMEN ----
function actualizarResumen() {
  var seccion = document.getElementById("seccion-resumen");
  if (!seccion) return;

  // Ocultar si carrito vacío
  if (carrito.length === 0) {
    seccion.style.display = "none";
    return;
  }

  // Mostrar resumen
  seccion.style.display = "block";

  // Franja elegida
  var infoFranja = document.getElementById("franja-elegida");
  if (infoFranja) {
    if (franjaSeleccionada) {
      infoFranja.textContent =
        "🕐 " + franjaSeleccionada.nombre + " · " + franjaSeleccionada.hora;
    } else {
      infoFranja.textContent = "⚠️ Selecciona un recreo arriba";
    }
  }

  // Lista de productos
  var lista = document.getElementById("lista-resumen");
  if (lista) {
    lista.innerHTML = "";
    carrito.forEach(function (item) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="resumen-item-texto">' +
        item.emoji +
        " " +
        item.nombre +
        " <strong>x" +
        item.cantidad +
        "</strong>" +
        " — " +
        (item.precio * item.cantidad).toFixed(2) +
        " €" +
        "</span>" +
        '<button class="btn-eliminar-item" data-id="' +
        item.id +
        '"></button>';

      li.querySelector(".btn-eliminar-item").addEventListener(
        "click",
        function () {
          eliminarProducto(item.id);
        },
      );

      lista.appendChild(li);
    });
  }

  // Total del resumen
  var total = carrito.reduce(function (suma, item) {
    return suma + item.precio * item.cantidad;
  }, 0);

  var totalResumen = document.getElementById("total-resumen");
  if (totalResumen) {
    totalResumen.textContent = total.toFixed(2) + " €";
  }
}
