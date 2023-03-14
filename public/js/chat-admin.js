const socket = io();

let admin_id = document.getElementsByClassName("admin_id")[0];
let lista_usuarios = document.getElementById("lista_usuarios");
let msj_list = document.getElementById("msj_list");
let msj_usr = document.getElementById("msj_usr");

let id_user = "";

msj_usr.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && msj_usr.value.trim() !== "") {
    const fecha = new Date().toISOString();
    socket.emit("message", {
      userId: id_user.trim(),
      mensaje: msj_usr.value.trim(),
      admin: "S",
      createdAt: fecha,
    });
    msj_usr.value = "";
  }
});

msj_usr.style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  leoUsuarios();
  document.querySelector(".user_chat").click();
});

lista_usuarios.addEventListener("click", async (e) => {
  if (e.target.classList.contains("user_chat")) {
    id_user = e.target.nextElementSibling.innerText;
    let response = await fetch(`/api/chat/mensajes/${id_user}`);
    let data = await response.json();
    let mensajes = data.result;
    msj_list.innerHTML = "";
    let lista = "";
    for (let i = 0; i < mensajes.length; i++) {
      const msj = mensajes[i];
      if (msj.receiver === null) {
        lista += `
        <div class="my-2 border-2 rounded-lg bg-blue-400">      
          <p class="px-2 text-white text-lg text-left">${msj.mensaje}</p>
          <p class="px-2 pb-1 text-sm text-gray-300 text-left">Enviado: ${transformDate(
            msj.createdAt
          )}</p>
        </div>
      `;
      } else {
        lista += `
        <div class="my-2 border-2 rounded-lg bg-blue-400">      
          <p class="px-2 text-white text-lg text-right">${msj.mensaje}</p>
          <p class="px-2 pb-1 text-sm text-gray-300 text-right">Enviado: ${transformDate(
            msj.createdAt
          )}</p>
        </div>
        `;
      }
    }
    msj_list.innerHTML = lista;
    // Mostrar el input cuando se hace clic en un usuario
    msj_usr.style.display = "block";
  }
});

socket.on("lista-mensajes-admin", (mensajes) => {
  let lista = "";
  for (let i = 0; i < mensajes.length; i++) {
    const msj = mensajes[i];
    if (msj.receiver === null) {
      lista += cardMensajeIzquierda(msj);
    } else {
      lista += cardMensajeDerecha(msj);
    }
  }
  msj_list.innerHTML = lista;
});

async function leoUsuarios() {
  id_user = null; // Agregar esta línea para restablecer el valor de id_user
  let response = await fetch("/api/chat/users");
  let data = await response.json();
  let usuarios = data.result;
  lista_usuarios.innerHTML = "";
  let lista = "";
  for (let i = 0; i < usuarios.length; i++) {
    const usuario = usuarios[i].user;
    if (usuario && usuario._id !== admin_id.innerText.trim()) {
      lista += `
        <div class="flex">
          <p class="user_chat p-1 text-white font-bold text-lg uppercase hover:cursor-pointer hover:bg-red-500">${usuario.nombre}</p>
          <p class="hidden">${usuario._id}</p>
        </div>
      `;
    }
  }
  lista_usuarios.innerHTML = lista;
}

function cardMensajeIzquierda(msj) {
  return `
    <div class="my-2 border-2 rounded-lg bg-blue-400">      
      <p class="p-2 text-white text-start">${msj.mensaje}</p>
      <p class="px-2 pb-1 text-sm text-gray-300 text-left">Enviado: ${transformDate(
        msj.createdAt
      )}</p>
    </div>
  `;
}

function cardMensajeDerecha(msj) {
  return `
    <div class="my-2 border-2 rounded-lg bg-blue-400">      
      <p class="p-2 text-white text-end">${msj.mensaje}</p>
      <p class="px-2 pb-1 text-sm text-gray-300 text-right">Enviado: ${transformDate(
        msj.createdAt
      )}</p>
    </div>
  `;
}

function transformDate(fecha) {
  let fch = fecha.split("T")[0];
  fch = fch.split("-");
  return `${fch[2]}/${fch[1]}/${fch[0]}`;
}
