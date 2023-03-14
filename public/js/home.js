document.addEventListener("DOMContentLoaded", () => {
  let btns_add = document.getElementsByClassName("btn_add");
  for (let i = 0; i < btns_add.length; i++) {
    const button = btns_add[i];
    button.addEventListener("click", addToCart);
  }
  let imagenes = document.getElementsByClassName("prod_img");
  for (let i = 0; i < imagenes.length; i++) {
    const imagen = imagenes[i];
    imagen.addEventListener("click", (e) => {
      let card = e.target.parentElement;
      let id_prod = card.getElementsByClassName("prod_id")[0].innerText;
    });
  }

  async function addToCart(event) {
    let product_card = event.target.parentElement.parentElement.parentElement;
    let prod_id = product_card
      .getElementsByClassName("prod_id")[0]
      .innerText.trim();
    let prod_nombre = product_card
      .getElementsByClassName("prod_nombre")[0]
      .innerText.trim();
    let prod_desc = product_card
      .getElementsByClassName("prod_desc")[0]
      .innerText.trim();
    let prod_categoria = product_card
      .getElementsByClassName("prod_categoria")[0]
      .innerText.trim();
    let prod_foto = product_card
      .getElementsByClassName("prod_img")[0]
      .src.trim();
    let prod_precio = parseFloat(
      product_card
        .getElementsByClassName("prod_precio")[0]
        .innerText.replace("Precio ($):", "")
    );
    let prod_stock = parseInt(
      product_card.getElementsByClassName("prod_stock")[0].innerText
    );
    let producto = {
      product_id: prod_id,
      quantity: 1,
      price: prod_precio,
      nombre: prod_nombre,
      descripcion: prod_desc,
      categoria: prod_categoria,
      foto: prod_foto,
      stock: prod_stock,
    };
    let response = await fetch("/api/carrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ producto }),
    });
    let data = await response.json();
    if (data.status === "OK") {
      swal(prod_nombre, "¡añadido al carrito!", "success", {
        button: "Aceptar",
      });
    }
  }
});

function cambiarColor(elemento) {
  let botones = document.getElementsByTagName("button");
  for (let i = 0; i < botones.length; i++) {
    if (botones[i] === elemento) {
      // Si es el botón clickeado, se pone en blanco con letras negras
      botones[i].classList.remove("bg-black");
      botones[i].classList.add("bg-white", "text-black");
    } else {
      // Si no es el botón clickeado, se pone en negro con letras blancas
      botones[i].classList.remove("bg-white", "text-black");
      botones[i].classList.add("bg-black");
    }
  }
}
const btnPeliculas = document.getElementById("ver_pelis");
const btnJuegos = document.getElementById("ver_juegos");
btnPeliculas.addEventListener("click", () => {
  cargarProductos("pelicula");
});

btnJuegos.addEventListener("click", () => {
  cargarProductos("juegos");
});

async function cargarProductos(categoria) {
  try {
    const response = await fetch(`/api/productos/categoria/${categoria}`);
    const data = await response.json();
    const productsContainer =
      document.getElementsByClassName("products_container")[0];
    productsContainer.innerHTML = "";
    if (data.status === "OK") {
      data.result.forEach((producto) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add(
          "group",
          "border",
          "border-black",
          "overflow-hidden",
          "hover:cursor-pointer",
          "rounded-md",
          "hover:scale-105",
          "duration-200"
        );
        productDiv.innerHTML = `
          <p class="prod_id hidden id_product">${producto._id}</p>
          <p class="prod_categoria hidden">${producto.categoria}</p>
          <p class="prod_stock hidden">${producto.stock}</p>
          <div>
            <a href="/api/productos/detalle/${producto._id}">
              <img class="prod_img h-[250px] w-full object-cover" src="${
                producto.foto
              }" alt="">
            </a>
          </div>
          <div class="p-2">
            <p class="prod_nombre font-extrabold text-lg">${producto.nombre}</p>
            <p class="prod_desc font-bold text-white">${
              producto.descripcion
            }</p>
            <div class="flex justify-between items-center">
              <p class="prod_precio font-bold text-white">Precio ($): ${producto.precio.toString()}</p>
            </div>
          </div>
        `;
        productsContainer.appendChild(productDiv);
      });
    } else {
      console.error("Hubo un problema al cargar los productos");
    }
  } catch (error) {
    console.error(error);
  }
}
