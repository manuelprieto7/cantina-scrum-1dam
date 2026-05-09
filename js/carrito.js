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

// ---- CONFIRMAR PEDIDO ----
document.addEventListener("DOMContentLoaded", function () {
  var btnConfirmar = document.getElementById("btn-confirmar");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      confirmarPedido();
    });
  }
});

function confirmarPedido() {
  var nombre = document.getElementById("input-nombre").value.trim();
  var pago = document.getElementById("select-pago").value;

  if (!nombre) {
    alert("Por favor escribe tu nombre.");
    return;
  }
  if (!pago) {
    alert("Por favor selecciona una forma de pago.");
    return;
  }
  if (!franjaSeleccionada) {
    alert("Por favor selecciona el recreo.");
    return;
  }

  var total = carrito.reduce(function (suma, item) {
    return suma + item.precio * item.cantidad;
  }, 0);

  // Crear objeto pedido
  var pedido = {
    nombre: nombre,
    franja: franjaSeleccionada,
    pago: pago,
    productos: carrito.slice(),
    total: total,
    hora: new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Guardar en localStorage
  var pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Mostrar modal
  document.getElementById("modal-nombre").textContent = "👤 " + pedido.nombre;
  document.getElementById("modal-franja").textContent =
    "🕐 " + pedido.franja.nombre + " · " + pedido.franja.hora;
  document.getElementById("modal-pago").textContent = "💳 Pago: " + pedido.pago;
  document.getElementById("modal-total").textContent =
    "💰 Total: " + pedido.total.toFixed(2) + " €";
  document.getElementById("modal-confirmacion").style.display = "flex";

  // Limpiar carrito
  carrito = [];
  franjaSeleccionada = null;
  actualizarTotal();
  actualizarResumen();

  // Resetear contadores visuales
  document.querySelectorAll(".cantidad").forEach(function (span) {
    span.textContent = "0";
  });
  document.querySelectorAll(".btn-franja").forEach(function (btn) {
    btn.classList.remove("activo");
  });
  document.getElementById("input-nombre").value = "";
  document.getElementById("select-pago").value = "";
}

// Cerrar modal
document.addEventListener("DOMContentLoaded", function () {
  var btnCerrar = document.getElementById("btn-cerrar-modal");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", function () {
      document.getElementById("modal-confirmacion").style.display = "none";
    });
  }
});
