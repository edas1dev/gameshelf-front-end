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
        const imageUrl = game.backgroundImage || '';
        const rating = game.gameData?.rating ? `${game.gameData.rating} / 5` : 'N/A';
        
        card.innerHTML = `
            <div class="game-image-container">
                <img src="${imageUrl}" alt="Capa do jogo ${game.title}" class="game-image">
            </div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p class="game-rating">⭐ Nota: <strong>${rating}</strong></p>
                <a href="detalhes.html?gameId=${game.id}" class="btn-primary-small">Ver Detalhes</a>
            </div>
        `;
        gamesListContainer.appendChild(card);
    });
}

window.logout = logout;

document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderGames();
});
