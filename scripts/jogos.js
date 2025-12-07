import { API_URL, checkAuth, logout } from './utils.js';

const gamesListContainer = document.getElementById("games-list");

// Função para buscar e renderizar a lista de jogos
async function fetchAndRenderGames() {
    gamesListContainer.innerHTML = '<p style="color:white; text-align:center;">Carregando catálogo...</p>';
    try {
        const response = await fetch(`${API_URL}/games`);
        if (!response.ok) {
            throw new Error("Falha ao carregar o catálogo de jogos.");
        }
        
        const games = await response.json();
        renderGames(games);

    } catch (error) {
        gamesListContainer.innerHTML = `<p style="color:red; text-align:center;">Erro: ${error.message}</p>`;
    }
}

function renderGames(games) {
    if (!gamesListContainer) return;
    
    gamesListContainer.innerHTML = "";

    if (games.length === 0) {
        gamesListContainer.innerHTML = "<p style='color:white; text-align:center;'>Nenhum jogo encontrado.</p>";
        return;
    }

    games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");
        const imageUrl = game.gameData?.background_image || 'caminho/para/imagem-padrao.png';
        const rating = game.gameData?.rating ? `${game.gameData.rating} / 5` : 'N/A';
        
        card.innerHTML = `
            <div class="game-image-container">
                <img src="${imageUrl}" alt="Capa do jogo ${game.title}" class="game-image">
            </div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p class="game-rating">⭐ Nota: <strong>${rating}</strong></p>
                <p><small>ID Interno: ${game.id}</small></p>
                <a href="detalhes.html?gameId=${game.apiId}" class="btn-primary-small">Ver Detalhes</a>
            </div>
        `;
        gamesListContainer.appendChild(card);
    });
}

// Expõe a função logout para ser usada no link "Sair" do jogos.html
window.logout = logout;

document.addEventListener("DOMContentLoaded", () => {
    // A página jogos.html não é necessariamente protegida (pode ser pública),
    // mas garantimos que as funções essenciais sejam chamadas.
    fetchAndRenderGames();
});
