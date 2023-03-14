let item_usuarios = document.getElementById("item_usuarios");
let item_productos = document.getElementById("item_productos");
let item_compras = document.getElementById("item_compras");
let item_chat = document.getElementById("item_chat");
let lista_cosas = document.getElementById("lista_cosas");
let lista_compras = document.getElementById("lista_compras");
let buscar_user = document.getElementById("buscar_user");
let buscar_prod = document.getElementById("buscar_prod");
const btn_buscar_compras = document.getElementById("btn_buscar_compras");
let lista_compras_header = document.getElementById("lista_compras_header");

const transformDate = (fecha) => {
  let fch = fecha.split("T")[0].split("-");
  return `${fch[2]}/${fch[1]}/${fch[0]}`;
};

const cardCompra = (compra) => {
  return `
<div class="w-full my-3 px-6 py-2 flex items-center border-2 rounded-lg justify-between bg-gray-900">
<div class="flex items-center">
<p class="hidden id_compra">${compra._id}</p>
${
  compra.user
    ? `<img src="${compra.user.foto}" class="w-12 h-12 rounded-full object-cover mr-4" alt="Buscar Compras">`
    : ""
}
<p class="text-2xl font-bold text-white mr-6">${
    compra.user ? compra.user.nombre : "Usuario desconocido"
  }</p>
<p class="text-2xl font-bold text-white mr-6">Fecha: <span class="text-red-400">${transformDate(
    compra.createdAt
  )}</span></p>
<p class="text-2xl font-bold text-white">Monto $: <span class="text-red-400">${
    compra.cart.subTotal
  }</span></p>
</div>
</div>
`;
};

lista_cosas.addEventListener("click", async (e) => {
  if (e.target.classList.contains("img_edit_prod")) {
    let card_container = e.target.parentElement.parentElement.parentElement;
    let id_prod = card_container.firstElementChild.innerText.trim();
    let response = await fetch(`/api/productos/${id_prod}`);
    let data = await response.json();
    let producto = data.result;
    swalEdit(producto);
  }
  if (e.target.classList.contains("img_delete_prod")) {
    let card_container = e.target.parentElement.parentElement.parentElement;
    let id_prod = card_container.firstElementChild.innerText.trim();
    let response = await fetch(`/api/productos/${id_prod}`, {
      method: "DELETE",
    });
    if (response.ok) {
      card_container.parentElement.removeChild(card_container);
    }
  }
  if (e.target.classList.contains("img_add_prod")) {
    swalNew();
  }
  if (e.target.classList.contains("img_edit_user")) {
    let card_container = e.target.parentElement.parentElement.parentElement;
    let id_user = card_container.firstElementChild.innerText.trim();
    let response = await fetch(`/api/users/${id_user}`);
    let data = await response.json();
    let user = data.usuario;
    swalEditUser(user);
  }
});
lista_compras.addEventListener("click", detalleCompra);
item_usuarios.addEventListener("click", (e) => {
  lista_cosas.classList.remove("hidden");
  lista_compras.classList.add("hidden");
  buscar_user.classList.remove("hidden");
  buscar_prod.classList.add("hidden");
  cargarListaUsuarios();
});

item_productos.addEventListener("click", (e) => {
  lista_cosas.classList.remove("hidden");
  lista_compras.classList.add("hidden");
  buscar_user.classList.add("hidden");
  buscar_prod.classList.remove("hidden");
  cargarListaProductos();
});

item_compras.addEventListener("click", (e) => {
  lista_cosas.classList.add("hidden");
  lista_compras.classList.remove("hidden");
  buscar_user.classList.add("hidden");
  buscar_prod.classList.add("hidden");
  lista_cosas.innerHTML = "";
  cargarListaCompras();
});

item_chat.addEventListener("click", (e) => {
  lista_cosas.classList.remove("hidden");
  lista_compras.classList.add("hidden");
  buscar_user.classList.add("hidden");
  buscar_prod.classList.add("hidden");
  lista_cosas.innerHTML = "";
  window.location.assign("/api/chat/admin");
});

async function cargarListaUsuarios() {
  let response = await fetch("/api/users");
  let data = await response.json();
  let usuarios = data.usuarios;
  lista_cosas.innerHTML = "";
  let lista = "";
  usuarios.forEach((user) => {
    lista += cardUser(user);
  });
  lista_cosas.innerHTML += lista;
}

function cardUser(user) {
  let { _id, foto, nombre } = user;
  return `
    <div class="w-full">
      <p class="hidden prod_id">${_id}</p>
      <img class="w-full h-[120px] object-cover rounded-lg overflow-x-hidden grayscale aspect-video" src="${foto}" alt="${nombre}">
      <div class="w-full flex items-center justify-between mt-2 px-1">
        <p class="text-lg font-bold text-white">${nombre}</p>
        <a class="w-[25px] h-[25px] hover:bg-white hover:rounded-full duration-300 flex items-center justify-center" href="#">
          <img class="img_edit_user w-[20px] h-[20px] object-cover" src="/assets/edit.png" alt="Edit">
        </a>
      </div>
    </div>
  `;
}

async function swalEditUser(usuario) {
  const { _id, nombre, email, direccion, telefono, edad } = usuario;
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
      <div>
        <input type="hidden" id="id_user" class="swal2-input" readonly value="${_id}">
      </div>
      <div>
        <label>Nombre:</label>
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
      </div>
      <div>
        <label>Email:</label>
        <input type="email" id="email" class="swal2-input" placeholder="Email" value="${email}">
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" id="direccion" class="swal2-input" placeholder="Dirección" value="${direccion}">
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" id="telefono" class="swal2-input" placeholder="Teléfono" value="${telefono}">
      </div>
      <div>
        <label>Edad:</label>
        <input type="number" id="edad" class="swal2-input" placeholder="Edad" value="${edad}">
      </div>
    `,
    confirmButtonText: "Editar",
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const id_user = Swal.getPopup().querySelector("#id_user").value;
      const nombre = Swal.getPopup().querySelector("#nombre").value;
      const email = Swal.getPopup().querySelector("#email").value;
      const direccion = Swal.getPopup().querySelector("#direccion").value;
      const telefono = Swal.getPopup().querySelector("#telefono").value;
      const edad = parseInt(Swal.getPopup().querySelector("#edad").value);
      if (!nombre || edad <= 0 || !email || !direccion || !telefono) {
        Swal.showValidationMessage(`Complete los datos`);
      }
      return { id_user, nombre, email, direccion, telefono, edad };
    },
  });
  if (formValues) {
    editUser(
      formValues.id_user,
      formValues.nombre,
      formValues.email,
      formValues.direccion,
      formValues.telefono,
      formValues.edad
    );
  }
}

const editUser = async (id_user, nombre, email, direccion, telefono, edad) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, direccion, telefono, edad }),
  };
  const response = await fetch(`/api/users/${id_user}`, requestOptions);
  const data = await response.json();
  if (data.status === "OK") {
    Swal.fire("Haz modificado el usuario exitosamente", nombre, "success", {
      button: "Aceptar",
      icon: "success",
      iconColor: "black",
      confirmButtonColor: "black",
      cancelButtonColor: "black",
      customClass: {
        confirmButton:
          "px-8 py-2 rounded-lg text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
        cancelButton:
          "px-8 py-2 rounded-lg text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
      },
    });
  }
};

const buscarUsuario = async (e) => {
  let cadena = e.target.value.trim();
  if (cadena.length === 0) {
    cargarListaUsuarios();
  } else {
    let response = await fetch(`/api/users/buscar/${cadena}`);
    let data = await response.json();
    let usuarios = data.usuarios;
    lista_cosas.innerHTML = "";
    let lista = "";
    usuarios.forEach((user) => {
      lista += cardUser(user);
    });
    lista_cosas.innerHTML += lista;
  }
};

async function cargarListaProductos() {
  const response = await fetch("/api/productos");
  const data = await response.json();
  const productos = data.result;
  lista_cosas.innerHTML = "";
  lista_cosas.innerHTML = cardProductoInicial();
  let lista = "";
  productos.forEach((prod) => {
    lista += cardProducto(prod);
  });
  lista_cosas.innerHTML += lista;
}

function cardProductoInicial() {
  return `
    <div class="w-full">
      <p class="hidden prod_id"></p>
      <img class="w-full h-[120px] object-contain rounded-lg bg-gray-700 overflow-x-hidden" src="/assets/no-product.png" alt="Add Product">
      <div class="w-full flex items-center justify-between mt-2 px-1">
        <p class="text-lg font-bold text-white">Agregar Producto</p>          
        <a class="w-[25px] h-[25px] hover:bg-white hover:rounded-full duration-300 flex items-center justify-center" href="#"> 
          <img class="img_add_prod w-[20px] h-[20px] object-cover" src="/assets/add-icon.png" alt="Edit"> 
        </a>
      </div>        
    </div>      
  `;
}

function cardProducto(producto) {
  return `
  <div class="w-full">
      <p class="hidden prod_id">${producto._id}</p>
      <img class="w-full h-[120px] object-cover rounded-lg bg-gray-700 overflow-x-hidden" src="${producto.foto}" alt="${producto.nombre}">
      <div class="w-full flex items-center justify-between mt-2 px-1">
      <p class="text-lg font-bold text-white">${producto.nombre}</p>   
      <a class="w-[25px] h-[25px] hover:bg-white hover:rounded-full duration-300 flex items-center justify-center mr-2" href="#"> 
        <img class="img_edit_prod w-[20px] h-[20px] object-cover" src="/assets/edit.png" alt="Edit"> 
      </a>
      <a class="w-[25px] h-[25px] hover:bg-white hover:rounded-full duration-300 flex items-center justify-center" href="#"> 
        <img class="img_delete_prod w-[20px] h-[20px] object-cover" src="/assets/delete.png" alt="Delete"> 
      </a>
      </div>        
    </div>   
  `;
}

async function swalNew() {
  const swalConfig = {
    title: "Nuevo Producto",
    html: `           
      <div>
        <label>Nombre:</label><input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
      </div>
      <div>
        <label>Descripción:</label><input type="text" id="descripcion" class="swal2-input" placeholder="Descripción">
      </div>
      <div>
        <label>Categoria:</label><input type="text" id="categoria" class="swal2-input" placeholder="Categoria">
      </div>
      <div>
        <label>Img URL:</label><input type="text" id="foto" class="swal2-input" placeholder="URL Foto">
      </div>
      <div>
        <label>Precio:</label><input type="text" id="precio" class="swal2-input" placeholder="Precio">
      </div>
      <div>
        <label>Stock:</label><input type="text" id="stock" class="swal2-input" placeholder="Stock">        
      </div>
    `,
    confirmButtonText: "Guardar",
    showCancelButton: true,
    focusConfirm: false,
    preConfirm() {
      const nombre = Swal.getPopup().querySelector("#nombre").value;
      const descripcion = Swal.getPopup().querySelector("#descripcion").value;
      const categoria = Swal.getPopup().querySelector("#categoria").value;
      const foto = Swal.getPopup().querySelector("#foto").value;
      const precio = parseFloat(Swal.getPopup().querySelector("#precio").value);
      const stock = parseInt(Swal.getPopup().querySelector("#stock").value);
      if (
        !nombre ||
        !descripcion ||
        !categoria ||
        !foto ||
        !precio ||
        precio <= 0 ||
        !stock ||
        stock <= 0
      ) {
        Swal.showValidationMessage(`Faltan completar campos`);
      }
      return { nombre, descripcion, categoria, foto, precio, stock };
    },
  };
  const result = await Swal.fire(swalConfig);
  if (result.isConfirmed) {
    addProduct(
      result.value.nombre,
      result.value.descripcion,
      result.value.categoria,
      result.value.foto,
      result.value.precio,
      result.value.stock
    );
  }
}

const addProduct = async (
  nombre,
  descripcion,
  categoria,
  foto,
  precio,
  stock
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      descripcion,
      categoria,
      foto,
      precio,
      stock,
    }),
  };
  const response = await fetch(`/api/productos/`, requestOptions);
  const data = await response.json();
  if (data.status === "OK") {
    Swal.fire({
      title: "Producto agregado con éxito",
      text: nombre,
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => cargarListaProductos());
  }
};

async function swalEdit(producto) {
  const { _id, nombre, descripcion, precio, stock } = producto;
  const swalHtml = `
    <div>
      <input type="hidden" id="id_prod" class="swal2-input" placeholder="ID Producto" readonly value="${_id}">
    </div>   
    <div>
      <label>Nombre:</label>
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" readonly value="${nombre}">
    </div>
    <div>
      <label>Descripción:</label>
      <input type="text" id="descripcion" class="swal2-input" placeholder="Descripción" readonly value="${descripcion}">
    </div>
    <div>
      <label>Precio:</label>
      <input type="text" id="precio" class="swal2-input" placeholder="Precio" value="${precio}">
    </div>
    <div>
      <label>Stock:</label>
      <input type="text" id="stock" class="swal2-input" placeholder="Stock" value="${stock}">        
    </div>
  `;
  const result = await Swal.fire({
    title: "Editar Producto",
    html: swalHtml,
    confirmButtonText: "Editar",
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const id_prod = Swal.getPopup().querySelector("#id_prod").value;
      const precio = parseFloat(Swal.getPopup().querySelector("#precio").value);
      const stock = parseInt(Swal.getPopup().querySelector("#stock").value);
      if (!precio || precio <= 0 || !stock || stock <= 0) {
        Swal.showValidationMessage(`Verifique precio y/o stock`);
      }
      return { id_prod, nombre, precio, descripcion, stock };
    },
  });
  if (result.isConfirmed) {
    editProduct(result.value.id_prod, result.value.precio, result.value.stock);
  }
}

async function editProduct(id, precio, stock) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ precio, stock }),
  };
  const response = await fetch(`/api/productos/${id}`, requestOptions);
  const data = await response.json();
  if (data.status === "OK") {
    Swal.fire("Haz modificado el producto exitosamente", nombre, "success", {
      button: "Aceptar",
    });
  }
}

async function buscarProd(e) {
  let cadena = e.target.value.trim();
  if (cadena.length === 0) {
    cargarListaProductos();
  } else {
    let response = await fetch(`/api/productos/name/${cadena}`);
    let data = await response.json();
    let productos = data.result;
    lista_cosas.innerHTML = "";
    let lista = "";
    productos.forEach((prod) => (lista += cardProducto(prod)));
    lista_cosas.innerHTML += lista;
  }
}

async function cargarListaCompras() {
  cargarFechas();
  lista_cosas.innerHTML = "";
  let fch_desde = document.getElementById("fch_desde").value;
  let fch_hasta = document.getElementById("fch_hasta").value;
  await leoCompras(fch_desde, fch_hasta);
}

async function leoCompras(fch_desde, fch_hasta) {
  lista_compras_header.innerHTML = "";
  const response = await fetch(
    `/api/compras/busqueda/fechas/?desde=${fch_desde}&hasta=${fch_hasta}`
  );
  const { compras } = await response.json();
  let lista_compras = compras.map((compra) => cardCompra(compra)).join("");
  lista_compras_header.innerHTML = lista_compras;
}

buscar_user.addEventListener("keyup", buscarUsuario);

buscar_prod.addEventListener("keyup", buscarProd);

btn_buscar_compras.addEventListener("click", async (e) => {
  let fch_desde = document.getElementById("fch_desde").value;
  let fch_hasta = document.getElementById("fch_hasta").value;
  leoCompras(fch_desde, fch_hasta);
});

async function detalleCompra(e) {
  if (e.target.classList.contains("btn_eye")) {
    const id_compra =
      e.target.parentElement.firstElementChild.firstElementChild.innerText.trim();
    const response = await fetch(`/api/compras/detail/${id_compra}`);
    const compra = await response.json();
    const modal_compra = document.getElementById("modal_compra");
    modal_compra.innerHTML = createModal(compra);
    modal_compra.classList.remove("hidden");
    const btn_cerrar_modal = document.getElementById("btn_cerrar_modal");
    btn_cerrar_modal.addEventListener("click", (e) => {
      document.getElementById("modal_compra").classList.add("hidden");
    });
  }
}

function cargarFechas() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // Enero es 0
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  today = `${yyyy}-${mm}-${dd}`;
  document.getElementById("fch_desde").value = today;
  document.getElementById("fch_hasta").value = today;
  document.getElementById("fch_desde").setAttribute("max", today);
  document.getElementById("fch_hasta").setAttribute("max", today);
}

const createModal = (compra) => `
  <div class="w-[50%] bg-white p-4 rounded-lg text-black flex flex-col">
    <p class="text-center text-2xl font-bold">Detalle de Compra</p>
    <div class="px-12 py-3 flex items-center justify-between text-lg">
      <p class="text-gray-600">Usuario: <span class="font-bold">${
        compra.user.nombre
      }</span></p>
      <p class="text-gray-600">Fecha: <span class="font-bold">${transformDate(
        compra.createdAt
      )}</span></p>
      <p class="text-gray-600">Monto Total ($): <span class="font-bold">${
        compra.cart.subTotal
      }</span></p>
    </div>
    <p class="text-gray-600 font-bold text-xl mb-2">Lista de Productos</p>
    <div>
      ${modalDetail(compra.cart.productos)}                
      <div class="w-full p-3">
        <p class="text-end text-xl font-bold">Total ($): ${
          compra.cart.subTotal
        }</p>
      </div>
      <div class="w-full flex justify-center">
        <p id="btn_cerrar_modal" class='text-lg uppercase border-2 border-black text-center w-32 bg-white text-black hover:bg-black hover:text-white hover:shadow-xl duration-300 rounded-lg py-2 hover:cursor-pointer'>Cerrar</p>
      </div>
    </div>
  </div>
`;

const modalDetail = (productos) => {
  let lista = "";
  productos.forEach((p) => {
    lista += `
      <div class="border-2 rounded-lg w-full px-3 py-1 mt-2 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img class="w-32 object-cover aspect-video" src="${p.foto}" alt="${
      p.nombre
    }">
          <p>${p.nombre}</p>
        </div>
        <p>Cantidad: ${p.quantity}</p>
        <p>SubTotal ($): ${p.quantity * p.price}</p>
      </div>
    `;
  });
  return lista;
};
