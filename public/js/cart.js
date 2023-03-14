document.addEventListener("DOMContentLoaded", () => {
  let lista_carrito = document.getElementById("lista_carrito");
  lista_carrito.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn_eliminar")) {
      deleteProduct(e);
    }
  });

  let fin_compra = document.getElementById("fin_compra");

  fin_compra.addEventListener("click", confirmoCompra);

  async function deleteProduct(e) {
    let card_carrito = e.target.parentElement.parentElement.parentElement;
    let id_cart = card_carrito
      .getElementsByClassName("id_cart")[0]
      .innerText.trim();
    let id_prod = card_carrito
      .getElementsByClassName("id_product")[0]
      .innerText.trim();
    let result = await fetch(`/api/carrito/${id_cart}/productos/${id_prod}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    let data = await result.json();
    if (data.status === "OK") {
      loadCarrito();
    }
  }

  async function loadCarrito() {
    let response = await fetch("/api/carrito/micarrito");
    let data = await response.json();
    if (data.status === "OK") {
      let products_container =
        document.getElementsByClassName("products_container")[0];
      let cart_quantity_subtitle = document.getElementById(
        "cart_quantity_subtitle"
      );
      let cart_cantidad = document.getElementById("cart_cantidad");
      let cart_total = document.getElementById("cart_total");
      cart_quantity_subtitle.innerText = `El carrito contiene ${data.cantidad} productos`;
      if (data.cantidad === 1) {
        cart_quantity_subtitle.innerText = `El carrito contiene ${data.cantidad} producto`;
      }

      cart_cantidad.innerText = `Cantidad de Productos: ${data.cantidad}`;
      cart_total.innerText = `Total de la Compra ($): ${data.total}`;

      let carrito = data.carrito;

      products_container.innerHTML = "";
      let lista = "";
      for (let i = 0; i < carrito.productos.length; i++) {
        let prod = carrito.productos[i];
        lista += cardCarrito(carrito._id, prod);
      }
      products_container.innerHTML = lista;
    }
  }

  async function confirmoCompra(e) {
    e.preventDefault();
    let cart_cantidad = document.getElementById("cart_cantidad").innerText;
    cart_cantidad = parseInt(
      cart_cantidad.replace("Cantidad de Productos:", "").trim()
    );

    if (cart_cantidad > 0) {
      let cartId = document
        .getElementsByClassName("id_cart")[0]
        .innerText.trim();

      let response = await fetch("/api/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId }),
      });
      let data = await response.json();

      if (data.status === "OK") {
        document.getElementsByClassName("products_container")[0].innerHTML = "";
        document.getElementById("cart_cantidad").innerText =
          "Cantidad de Productos: 0";
        document.getElementById("cart_total").innerText =
          "Total de la Compra ($): 0.0";
        document.getElementById("cart_quantity_subtitle").innerText =
          "No tiene productos en el carrito";

        swal(
          `Muchas gracias ${data.result.user.nombre}`,
          `Recibirá un correo en ${data.result.user.email} con el detalle de su compra`,
          "success",
          {
            button: "Aceptar",
          }
        );
      }
    } else {
      swal(
        "No hay productos agregados en el carrito",
        "No se puede completar la compra",
        "error",
        {
          button: "Aceptar",
        }
      );
    }
  }

  function cardCarrito(carritoId, producto) {
    return `
    <div class="py-2">
    <div class="w-full border-2 border-black/60 p-4 flex items-center space-x-8 rounded-lg">
      <p class="id_cart hidden">${carritoId}</p>
      <p class="id_product hidden">${producto.product_id}</p>
      <p class="prod_categoria hidden">${producto.categoria}</p>
      <p class="prod_stock hidden">${producto.stock}</p>
      <img class="w-[120px] hover:cursor-pointer hover:scale-110 duration-300" src="${producto.foto}" alt="${producto.nombre}">
      <div class="w-full px-4">
        <p class="prod_nombre text-3xl font-extrabold">${producto.nombre}</p>
        <p class="prod_descripcion text-2xl py-1 text-black">${producto.descripcion}</p>
        <div class="w-full flex items-center justify-between">
          <p class="prod_precio text-xl text-white">Precio ($): ${producto.price}</p>
          <a class="btn_eliminar text-xl text-white hover:text-black hover:scale-110 duration-300" href="#">Eliminar</a>
          <p class="text-xl text-white" for="cantidad">Cantidad: <span class="text-2xl font-bold">${producto.quantity}</span></p>                                              
        </div>
      </div>
    </div>
  </div>
    `;
  }
});
