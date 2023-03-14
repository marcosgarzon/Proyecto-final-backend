const socket = io();

let msj_usr = document.getElementById("msj_usr");
let user_id = document.getElementsByClassName("user_id")[0];
let user_admin = document.getElementsByClassName("user_admin")[0];
let lista_mensajes = document.getElementById("lista_mensajes");
let filtrar_msj = document.getElementById("filtrar_msj");
let ver_todos = document.getElementById("ver_todos");

msj_usr.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    const meResponse = await fetch("/api/users/me");
    const meData = await meResponse.json();
    const messageData = {
      userId: user_id.innerText.trim(),
      mensaje: msj_usr.value.trim(),
      admin: user_admin.innerText.trim(),
      email: meData.email.trim(),
    };
    socket.emit("message", messageData, (mensajes) => {
      mostrarMensajes(mensajes);
    });
    msj_usr.value = "";
  }
});

function mostrarMensajes(mensajes) {
  lista_mensajes.innerHTML = "";
  let lista = "";
  for (let i = 0; i < mensajes.length; i++) {
    const msj = mensajes[i];
    if (msj.receiver === null) {
      lista += cardMensajeDerecha(msj);
    } else {
      lista += cardMensajeIzquierda(msj);
    }
  }
  lista_mensajes.innerHTML = lista;
}

socket.on("lista-mensajes", (mensajes) => {
  mostrarMensajes(mensajes);
});

filtrar_msj.addEventListener("click", () => {
  socket.emit("filtro-mensajes", user_id.innerText.trim()); // Emitir evento con el user_id para filtrar los mensajes
});

ver_todos.addEventListener("click", () => {
  socket.emit("todos-mensajes"); // Emitir evento para traer todos los mensajes sin filtro
});

function cardMensajeIzquierda(msj) {
  return `
    <div class="my-2 border-2 rounded-lg bg-blue-400"">      
      <p class="px-2 text-lg text-white text-start">${msj.mensaje}</p>
      <p class="px-2 pb-1 text-sm text-gray-300 text-start">Enviado: ${transformFecha(
        msj.createdAt
      )}</p>
    </div>
  `;
}

function cardMensajeDerecha(msj) {
  return `
    <div class="my-2 border-2 rounded-lg bg-blue-400"">      
      <p class="px-2 text-lg text-white text-end">Enviado por ${msj.email}:</p>
      <p class="px-2 text-lg text-white text-end">${msj.mensaje}</p>
      <p class="px-2 pb-1 text-sm text-gray-300 text-end">Enviado: ${transformFecha(
        msj.createdAt
      )}</p>
    </div>
  `;
}

function transformFecha(fecha) {
  let fch = fecha.split("T")[0];
  fch = fch.split("-");
  return `${fch[2]}/${fch[1]}/${fch[0]}`;
}

function cambiarColor(elemento) {
  let botones = document.getElementsByTagName("button");
  for (let i = 0; i < botones.length; i++) {
    if (botones[i] === elemento) {
      botones[i].classList.remove("bg-black");
      botones[i].classList.add("bg-white", "text-black");
    } else {
      botones[i].classList.remove("bg-white", "text-black");
      botones[i].classList.add("bg-black");
    }
  }
}
