const API_URL = "http://localhost:3000"; 

function getToken() {
  return localStorage.getItem("access_token");
}

function saveToken(token) {
  localStorage.setItem("access_token", token);
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_data");
  window.location.href = "index.html";
}

function checkAuth() {
  // Redireciona para o login se não houver token.
  if (!getToken()) {
    // window.location.href = "login.html";
    // É melhor deixar isso no 'DOMContentLoaded' para não atrapalhar o login/cadastro
    return false;
  }
  return true;
}

/* ==========================================================================
   LÓGICA DA PÁGINA INICIAL (index.html)
   ========================================================================== */
function entrarComEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput ? emailInput.value.trim() : '';
  
  // Apenas redireciona para a página de login, onde a autenticação real acontecerá
  if (email) {
    window.location.href = `login.html?email=${encodeURIComponent(email)}`;
  } else {
    window.location.href = "login.html";
  }
}

/* ==========================================================================
   LÓGICA DE CADASTRO (cadastro.html)
   ========================================================================== */
// Elementos da tela de Cadastro
const formCadastro = document.querySelector(".cadastro-form");
const cadastroButton = document.querySelector(".cadastro-button");

if (formCadastro) {
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmSenha = document.getElementById("confirm-password").value.trim();
        
        if (password !== confirmSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        await handleCadastro(name, email, password);
    });
}

async function handleCadastro(name, email, password) {
    try {
        // Rota conforme user.gameshelf.http
        const response = await fetch(`${API_URL}/users`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar usuário");
        }

        alert("Cadastro realizado com sucesso! Faça login.");
        window.location.href = "login.html";

    } catch (error) {
        alert("Erro no Cadastro: " + error.message);
    }
}

cadastroButton.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmSenha = document.getElementById("confirm-password").value.trim();
  handleCadastro(name, email, password);
});

/* ==========================================================================
   LÓGICA DE LOGIN (login.html)
   ========================================================================== */
const formLogin = document.querySelector(".login-form");
const loginButton = document.querySelector(".login-button");

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        await handleLogin(email, password);
    });
}

async function handleLogin(email, password) {
    try {
        // Rota conforme user.gameshelf.http / auth/login
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Credenciais inválidas");
        }

        const data = await response.json();
        saveToken(data.access_token); // Salva o token
        
        // Redireciona para a tela de avaliações após o login
        window.location.href = "avaliacao.html";

    } catch (error) {
        alert("Erro no Login: " + error.message);
    }
}

loginButton.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  handleLogin(email, password);
});

/* ==========================================================================
   LÓGICA DE AVALIAÇÕES (avaliacao.html)
   ========================================================================== */
const formAvaliacao = document.getElementById("form-avaliacao");
const listaAvaliacoesContainer = document.getElementById("avaliacoes-container");
const selectJogo = document.getElementById("select-jogo");

if (formAvaliacao) {
    // 1. Verifica se está logado e carrega dados ao entrar na página
    document.addEventListener("DOMContentLoaded", () => {
        if (checkAuth()) {
            fetchAndRenderJogos();
            fetchAndRenderMinhasReviews();
        }
    });

    // 2. Evento de submissão do formulário de avaliação
    formAvaliacao.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const game_id = parseInt(selectJogo.value);
        const rating = parseFloat(document.getElementById("nota").value);
        const content = document.getElementById("comentario").value.trim();
        
        // Criando um título simples, já que a API o exige:
        const title = `Avaliação de ${selectJogo.selectedOptions[0].text}`; 

        if (!game_id) {
            alert("Selecione um jogo válido!");
            return;
        }

        await handlePostReview({ game_id, rating, content, title });
    });
}

// Função para buscar e renderizar a lista de jogos no select
async function fetchAndRenderJogos() {
    try {
        selectJogo.innerHTML = '<option value="" disabled selected>Carregando jogos...</option>';
        
        // Rota conforme game.gameshelf.http
        const response = await fetch(`${API_URL}/games`); 
        
        if (!response.ok) {
            throw new Error("Erro ao carregar o catálogo de jogos.");
        }

        const games = await response.json();
        
        let optionsHtml = '<option value="" disabled selected>Selecione um jogo...</option>';
        
        games.forEach(game => {
            // Assumindo que a API retorna 'id' e 'title'
            optionsHtml += `<option value="${game.id}">${game.title}</option>`; 
        });
        
        selectJogo.innerHTML = optionsHtml;

    } catch (error) {
        selectJogo.innerHTML = '<option value="" disabled selected>Erro ao carregar</option>';
        console.error("Erro ao carregar jogos:", error.message);
    }
}

// Função para postar a nova review
async function handlePostReview({ game_id, rating, content, title }) {
    try {
        // Rota conforme review.gameshelf.http
        const response = await fetch(`${API_URL}/reviews`, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}` // Envia o Token JWT
            },
            body: JSON.stringify({ game_id, rating, content, title }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Falha ao criar avaliação");
        }

        alert("Avaliação enviada com sucesso!");
        formAvaliacao.reset();
        fetchAndRenderMinhasReviews(); // Recarrega a lista
        
    } catch (error) {
        alert("Erro ao Enviar Avaliação: " + error.message);
    }
}

// Função para buscar e renderizar as reviews do usuário
async function fetchAndRenderMinhasReviews() {
    listaAvaliacoesContainer.innerHTML = '<h4>Carregando suas avaliações...</h4>';
    try {
        // Rota conforme review.gameshelf.http
        const response = await fetch(`${API_URL}/reviews/me`, {
            headers: { "Authorization": `Bearer ${getToken()}` } // Protegida com Token
        });

        if (!response.ok) {
            throw new Error("Não foi possível carregar as avaliações.");
        }
        
        const reviews = await response.json();
        renderMinhasReviews(reviews);

    } catch (error) {
        listaAvaliacoesContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Função para renderizar os cards de avaliação na tela
function renderMinhasReviews(reviews) {
    if (!listaAvaliacoesContainer) return;
    
    listaAvaliacoesContainer.innerHTML = "";

    if (reviews.length === 0) {
        listaAvaliacoesContainer.innerHTML = "<p>Você ainda não fez nenhuma avaliação.</p>";
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.classList.add("avaliacao-card");
        
        // Assumindo que a review do backend inclui o objeto do jogo (review.game)
        const gameTitle = review.game ? review.game.title : `Jogo ID: ${review.game_id}`;
        
        card.innerHTML = `
            <h4>${gameTitle}</h4>
            <p><strong>Nota:</strong> ${review.rating}/10</p>
            <p>${review.content}</p>
            <small>Título da Review: ${review.title}</small>
        `;
        listaAvaliacoesContainer.appendChild(card);
    });
}