let compra_detail = document.getElementById("compra_detail");
let btn_ver_compra = document.getElementsByClassName("btn_ver_compra");
for (let i = 0; i < btn_ver_compra.length; i++) {
  const btn_compra = btn_ver_compra[i];
  btn_compra.addEventListener("click", verCompra);
}

function verCompra(e) {
  e.preventDefault();
  let compra_card = e.target.parentElement.parentElement.parentElement;
  let cart_id = compra_card.getElementsByClassName("compra_id")[0].innerText;
  cargoListaCompra(cart_id);
}

async function cargoListaCompra(cart_id) {
  let response = await fetch(`/api/carrito/${cart_id}/productos`);
  let data = await response.json();
  if (data.status === "OK") {
    let lista_prods = data.result.productos; // lista de productos en la compra
    let compra_detail = document.getElementById("compra_detail");
    compra_detail.innerHTML = "";
    lista = "";
    lista_prods.forEach((producto) => {
      let prod_card = `
      <div class="mb-2 w-full flex items-center space-x-5">
        <img class="w-[200px] h-[100px] object-cover" src="${
          producto.foto
        }" alt="${producto.nombre}">
        <div class="w-full flex flex-col ">
          <p class="text-lg font-bold">${producto.nombre}</p>
          <div class="flex items-center justify-between">
            <p class="text-lg">Cantidad: ${producto.quantity}</p>
            <p class="text-lg">SubTotal $: ${
              producto.quantity * producto.price
            }</p>
          </div>
        </div>        
      </div>
      <div class="my-2 w-full h-[1px] bg-red-500"></div>
      `;
      lista += prod_card;
    });
    lista += `
      <p class="text-lg font-bold flex justify-end">Monto Total ($): ${data.result.subTotal}</p>
    `;
    compra_detail.innerHTML = lista;
  }
}
