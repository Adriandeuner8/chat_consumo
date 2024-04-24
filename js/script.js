const urlApi = 'https://chat-320f.onrender.com';

const entrada = document.querySelector("#entrada");
const listaSalas = document.querySelector("#lista-salas");
const mensagensSala = document.querySelector("#mensagens-sala");
const criaSala = document.querySelector("#cria-sala");

const formEnviarMensagem = document.querySelector("#form-enviar-mensagem");
const inputMensagem = document.querySelector("#input-mensagem");
const mensagensContainer = document.querySelector("#mensagens");
let salaSelecionadaId = null;

const user = {};

// entrar usuario
document.querySelector('#entrar').addEventListener('click', (evt) => {
  evt.preventDefault(); 
  let nick = document.querySelector('#input-nick').value;

  entrarUser(nick);
});

const entrarUser = (nick) =>{
	fetch(urlApi+"/entrar", {
    method: "POST",
    headers: {"Content-type": "application/json;charset=UTF-8"}, 
    body:JSON.stringify({nick: nick}) 
	})
	.then((res) => res.json())
	.then((data) => {
			console.log(data);
			if (data.idUser && data.nick && data.token) { 
					user.idUser = data.idUser;
					user.nick = data.nick;
					user.token = data.token;

					entrada.style.display = 'none';

					mostrarSalas();
			} else {
					console.log("Resposta da API inválida:", data);
			}
	})
	.catch((error) => {
			console.log("Erro na requisição:", error);
	});
}
// listar salas
const mostrarSalas = () => {
  if (user.token && user.nick) {
      fetch(urlApi + "/salas", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json',
                  'nick': user.nick,
                  'token': user.token,
                  'idUser': user.idUser
              }
          })
          .then((res) => res.json())
          .then((data) => {
              if (data) {
                  listaSalas.innerHTML = "";

                  data.forEach(sala => {
                      const salaElement = document.createElement("div");
                      salaElement.innerHTML = `
                          <h2>${sala.nome}</h2>
                          <p>${sala.tipo}</p>
                          <button class="btn btn-primary btn-sm entrar-sala" data-id="${sala._id}">Entrar na Sala</button>
                      `;
                      listaSalas.appendChild(salaElement);
                  });

                  listaSalas.style.display= 'block'

                  document.querySelectorAll('.entrar-sala').forEach(btn => {
                      btn.addEventListener('click', () => {
                          const idSala = btn.dataset.id;
                          entrarNaSala(idSala);

                          listaSalas.style.display='none';
                      });
                  });
              } else {
                  console.error("Resposta da API não contém dados");
              }
          })
          .catch((error) => {
              console.error("Erro na requisição:", error);
          });
  }
}
// entrar na sala
const entrarNaSala = (idSala) => {

    fetch(`${urlApi}/sala/entrar?idsala=${idSala}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'nick': user.nick,
                'token': user.token,
                'idUser': user.idUser
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.msg === 'OK') { 
                const time = data.timestamp;
               
                mostrarMensagens(idSala, time);
          } else {
              console.log("Resposta da API inválida:", data);
          }
        })
        .catch((error) => {
            console.error("Erro na requisição:", error);
        });
}
// mostrar msg
function mostrarMensagens(idSala, time) {
  salaSelecionadaId = idSala;
 
    fetch(`${urlApi}/sala/mensagens?idSala=${idSala}&timestamp=`,{
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'nick': user.nick,
            'token': user.token,
            'idUser': user.idUser
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            mensagensContainer.innerHTML = "";

            data.forEach((msgs) => {
                const mensagemElement = document.createElement("div");
                mensagemElement.textContent = `${nick.nick}: ${msgs.msg}`;
                mensagensContainer.appendChild(mensagemElement);
            });

            mensagensSala.style.display = 'block';

        } else {
            console.error("Resposta da API não contém dados");
        }
    })
    .catch((error) => {
        console.error("Erro na requisição lista msg:", error);
    });

}



