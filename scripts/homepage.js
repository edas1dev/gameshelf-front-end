import { API_URL, logout } from './utils.js';

const showcaseWrapper = document.getElementById('showcase-wrapper');
const bestRatedContainer = document.getElementById('best-rated-container');
const mostReviewedContainer = document.getElementById('most-reviewed-container');

const mainGridSection = document.getElementById('main-grid-section');
const mainGridTitle = document.getElementById('main-grid-title');
const mainGridDesc = document.getElementById('main-grid-desc');
const mainGridContainer = document.getElementById('main-grid-container');
const statusMessage = document.getElementById('status-message');

const searchInput = document.getElementById('main-search-input');
const searchBtn = document.getElementById('main-search-btn');

window.logout = logout;

let isSearching = false;

document.addEventListener("DOMContentLoaded", () => {
    initHomepage();

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length > 0) {
                handleSearch();
            }
        }
    });

    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === '' && isSearching) {
            resetHomepage();
        }
    });
});

function initHomepage() {
    loadSection('best-rated', 10, bestRatedContainer);
    loadSection('most-reviewed', 10, mostReviewedContainer);
    loadSection('popular', 50, mainGridContainer);
}

function resetHomepage() {
    isSearching = false;
    showcaseWrapper.style.display = 'block';

    mainGridTitle.textContent = "🔥 Populares do Momento";
    mainGridDesc.textContent = "Explorando os títulos mais jogados atualmente.";
    statusMessage.innerHTML = '';

    mainGridContainer.innerHTML = '<div class="loader"></div>';
    loadSection('popular', 50, mainGridContainer);
}

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    isSearching = true;

    showcaseWrapper.style.display = 'none';

    mainGridTitle.textContent = `🔍 Resultados para: "${query}"`;
    mainGridDesc.textContent = "Encontramos estes títulos no catálogo.";
    mainGridContainer.innerHTML = '<div class="loader"></div>';
    statusMessage.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/games/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) throw new Error('Erro na busca');

        const games = await response.json();

        if (games.length === 0) {
            mainGridContainer.innerHTML = '';
            statusMessage.innerHTML = `
                <div style="text-align:center; padding: 40px; color: #ccc;">
                    <h3>Nenhum jogo encontrado 😢</h3>
                    <p>Tente buscar por outro termo ou verifique a ortografia.</p>
                    <button onclick="window.location.reload()" class="btn-primary-small" style="margin-top:15px; display:inline-block; cursor:pointer;">Voltar ao Início</button>
                </div>
            `;
            return;
        }

        renderCards(games, mainGridContainer);

    } catch (error) {
        console.error("Erro na busca:", error);
        mainGridContainer.innerHTML = '';
        statusMessage.innerHTML = `<p style="color:red; text-align:center;">Erro ao conectar com o servidor.</p>`;
    }
}

async function loadSection(rankingType, qty, container) {
    try {
        const response = await fetch(`${API_URL}/games?ranking=${rankingType}&quantity=${qty}`);
        if (!response.ok) throw new Error('Falha na API');

        const games = await response.json();

        if (games.length === 0) {
            container.innerHTML = '<p style="color:#aaa; padding:15px;">Nenhum jogo disponível.</p>';
            return;
        }

        renderCards(games, container);

    } catch (error) {
        console.error(`Erro em ${rankingType}:`, error);
        container.innerHTML = `<p style="color:red; padding:15px;">Erro ao carregar.</p>`;
    }
}

function renderCards(games, container) {
    container.innerHTML = "";

    games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        const imageUrl = game.backgroundImage || 'img/placeholder.jpg';
        const rating = game.rating ? game.rating.toFixed(1) : 'N/A';

        card.innerHTML = `
            <div class="game-image-container">
                <img src="${imageUrl}" alt="${game.title}" class="game-image" loading="lazy">
            </div>
            <div class="game-info">
                <h3 title="${game.title}">${game.title}</h3>
                <div class="game-rating">⭐ ${rating}</div>
                <a href="game-detail.html?gameId=${game.id}" class="btn-details">Ver Detalhes</a>
            </div>
        `;
        container.appendChild(card);
    });
}
