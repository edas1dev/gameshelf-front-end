//botei isso pra verificar o email no login na parte inicial
function entrarComEmail() {
  const email = document.getElementById("emailInput").value.trim();

  const EMAIL_FIXO = "admin@teste.com";

  if (email === "") {
    alert("Por favor, insira seu e-mail.");
    return;
  }

  if (email.toLowerCase() === EMAIL_FIXO.toLowerCase()) {
    window.location.href = "avaliacao.html";
  } else {
    alert("Este e-mail é inválido!");
  }
}

// botei isso pra validar o login na parte de login
const EMAIL_FIXO = "admin@teste.com";
const SENHA_FIXA = "12345";

document.addEventListener("DOMContentLoaded", function () {
  const formLogin = document.querySelector(".login-form");

  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailDigitado = document.getElementById("email").value.trim();
      const senhaDigitada = document.getElementById("password").value.trim();

      const EMAIL_FIXO = "admin@teste.com"; 
      const SENHA_FIXA = "12345";

      if (
        emailDigitado.toLowerCase() === EMAIL_FIXO.toLowerCase() &&
        senhaDigitada === SENHA_FIXA
      ) {
        window.location.href = "avaliacao.html";
      } else {
        alert("E-mail ou senha incorretos!");
      }
    });
  }
});

//botei isso pra validar o cadastro na parte de cadastro
document.addEventListener("DOMContentLoaded", function () {
  const formCadastro = document.querySelector(".cadastro-form");

  if (formCadastro) {
    formCadastro.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("password").value.trim();
      const confirmSenha = document.getElementById("confirm-password").value.trim();

      if (!nome || !email || !senha || !confirmSenha) {
        alert("Preencha todos os campos!");
        return;
      }
      if (senha !== confirmSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      
      const usuario = { nome, email, senha };
      localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));

      alert("Cadastro realizado com sucesso!");

      window.location.href = "avaliacao.html";
    });
  }
});


//botei isso pra salvar as avaliacoes no local storage
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-avaliacao");
  const lista = document.getElementById("avaliacoes-container");

  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];

  function renderizarAvaliacoes() {
    lista.innerHTML = "";
    avaliacoes.forEach((a, index) => {
      const card = document.createElement("div");
      card.classList.add("avaliacao-card");
      card.innerHTML = `
        <h4>${a.jogo}</h4>
        <p><strong>Nota:</strong> ${a.nota}/10</p>
        <p>${a.comentario}</p>
        <button class="btn-secondary remover" data-index="${index}">Remover</button>
      `;
      lista.appendChild(card);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const jogo = document.getElementById("nome-jogo").value.trim();
    const nota = document.getElementById("nota").value;
    const comentario = document.getElementById("comentario").value.trim();

    if (jogo && nota && comentario) {
      avaliacoes.push({ jogo, nota, comentario });
      localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
      renderizarAvaliacoes();
      form.reset();
    }
  });

  lista.addEventListener("click", (e) => {
    if (e.target.classList.contains("remover")) {
      const index = e.target.getAttribute("data-index");
      avaliacoes.splice(index, 1);
      localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
      renderizarAvaliacoes();
    }
  });

  renderizarAvaliacoes();
});
