// menu.js - Carga el menú desde JSON y muestra las tarjetas con botones + y -

fetch("data/menu.json")
  .then(function (respuesta) {
    return respuesta.json();
  })
  .then(function (datos) {
    mostrarMenu(datos.menu);
  })
  .catch(function (error) {
    console.error("Error al cargar el menú:", error);
  });

function mostrarMenu(productos) {
  document.getElementById("bebidas").innerHTML = "";
  document.getElementById("bocadillos").innerHTML = "";
  document.getElementById("tostadas").innerHTML = "";

  productos.forEach(function (producto) {
    var tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-producto");

    tarjeta.innerHTML =
      '<span class="emoji">' +
      producto.emoji +
      "</span>" +
      "<h4>" +
      producto.nombre +
      "</h4>" +
      '<p class="precio">' +
      producto.precio.toFixed(2) +
      " €</p>" +
      '<div class="controles">' +
      '<button class="btn-menos">−</button>' +
      '<span class="cantidad">0</span>' +
      '<button class="btn-mas">+</button>' +
      "</div>";

    // Botón +
    tarjeta.querySelector(".btn-mas").addEventListener("click", function () {
      agregarProducto(producto);
      var spanCantidad = tarjeta.querySelector(".cantidad");
      spanCantidad.textContent = parseInt(spanCantidad.textContent) + 1;
    });

    // Botón -
    tarjeta.querySelector(".btn-menos").addEventListener("click", function () {
      var spanCantidad = tarjeta.querySelector(".cantidad");
      var cantidadActual = parseInt(spanCantidad.textContent);
      if (cantidadActual > 0) {
        quitarProducto(producto);
        spanCantidad.textContent = cantidadActual - 1;
      }
    });

    document.getElementById(producto.categoria).appendChild(tarjeta);
  });
}
