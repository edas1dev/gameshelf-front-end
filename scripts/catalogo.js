import { API_URL, checkAuth, logout } from './utils.js';

const gamesListContainer = document.getElementById("games-list");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

async function searchGames(query) {
    gamesListContainer.innerHTML = `<p style="color:white; text-align:center;">Buscando jogos...</p>`;
    try {
        const response = await fetch(`${API_URL}/games/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Falha ao buscar jogos")
        const results = await response.json();
        renderGames(results);
    } catch (error) {
        gamesListContainer.innerHTML = `<p style="color:red; text-align:center;">Erro: ${error.message}</p>`;
    }
}

async function fetchAndRenderGames() {
    gamesListContainer.innerHTML = '<p style="color:white; text-align:center;">Carregando catálogo...</p>';
    try {
        const response = await fetch(`${API_URL}/games?ranking=popular&quantity=80`);
        if (!response.ok) throw new Error("Falha ao carregar o catálogo de jogos.");
        const games = await response.json();
        renderGames(games);
    } catch (error) {
        gamesListContainer.innerHTML = `<p style="color:red; text-align:center;">Erro: ${error.message}</p>`;
    }
}

function renderGames(games) {
    gamesListContainer.innerHTML = "";

    if (games.length === 0) {
        gamesListContainer.innerHTML = "<p style='color:white; text-align:center;'>Nenhum jogo encontrado.</p>";
        return;
    }

    games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        const imageUrl = game.backgroundImage || '';
        const rating = game.gameData?.metacritic ? `${game.gameData.metacritic} / 5` : 'N/A';

        card.innerHTML = `
            <div class="game-image-container">
                <img src="${imageUrl}" alt="Capa do jogo ${game.title}" class="game-image">
            </div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p class="game-rating">⭐ Nota: <strong>${rating}</strong></p>
                <a href="game-detail.html?gameId=${game.id}" class="btn-primary-small">Ver Detalhes</a>
            </div>
        `;
        gamesListContainer.appendChild(card);
    });
}

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query.length > 0) searchGames(query);
});

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query.length > 0) searchGames(query);
    }
});

window.logout = logout;

document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderGames();
});
