import { API_URL, logout, getToken, checkAuth } from './utils.js';

const gameId = new URLSearchParams(window.location.search).get("gameId");

const headerImg = document.getElementById("header-image");
const boxImg = document.getElementById("box-image");
const gameTitle = document.getElementById("game-title");
const gameRating = document.getElementById("game-rating");
const gameDescription = document.getElementById("game-description");
const screenshotsContainer = document.getElementById("screenshots");
const reviewsContainer = document.getElementById("reviews-container");
const btnAvaliar = document.getElementById("btn-avaliar");

async function loadGameDetails() {
    try {
        checkAuth();
        const response = await fetch(`${API_URL}/games/details/${gameId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
        });
        const game = await response.json();
        console.log(game.title)

        headerImg.src = game.backgroundImage;
        boxImg.src = game.backgroundImageAdditional;
        gameTitle.textContent = game.title;
        gameRating.textContent = game.rating
            ? `⭐ ${game.rating} / ${game.ratingTop}`
            : "Sem Avaliação";
        gameDescription.innerHTML = game.description || "Sem descrição.";
        screenshotsContainer.innerHTML = "";
        game.screenshots?.slice(0, 6).forEach(img => {
            const el = document.createElement("img");
            el.src = img;
            screenshotsContainer.appendChild(el);
        });

        loadReviews();

    } catch (err) {
        console.error(err);
    }
}

// Buscar avaliações
async function loadReviews() {
    const response = await fetch(`${API_URL}/reviews?gameId=${gameId}`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    });

    const reviews = await response.json();

    if (!reviews.length) {
        reviewsContainer.innerHTML = "<p>Nenhuma avaliação encontrada.</p>";
        return;
    }

    reviewsContainer.innerHTML = "";
    reviews.forEach(r => {
        const card = document.createElement("div");
        card.classList.add("review-card");
        card.innerHTML = `
            <strong>Nota: ${r.rating}/10</strong>
            <p>${r.content}</p>
        `;
        reviewsContainer.appendChild(card);
    });
}

btnAvaliar.addEventListener("click", () => {
    window.location.href = `avaliacao.html?gameId=${gameId}`;
});

loadGameDetails();
