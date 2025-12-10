import { API_URL, getToken, checkAuth } from './utils.js';

const formAvaliacao = document.getElementById("form-avaliacao");
const listaAvaliacoesContainer = document.getElementById("avaliacoes-container");
const selectJogo = document.getElementById("select-jogo");

// Função para postar a nova review
async function handlePostReview({ game_id, rating, content, title }) {
    try {
        const response = await fetch(`${API_URL}/reviews/`, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}` 
            },
            body: JSON.stringify({ gameId: String(game_id), rating, content, title }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Falha ao criar avaliação");
        }

        alert("Avaliação enviada com sucesso!");
        formAvaliacao.reset();
        await fetchAndRenderMinhasReviews();
        
    } catch (error) {
        alert("Erro ao Enviar Avaliação: " + error.message);
    }
}

// Função para buscar e renderizar as reviews do usuário
async function fetchAndRenderMinhasReviews() {
    listaAvaliacoesContainer.innerHTML = '<h4>Carregando suas avaliações...</h4>';
    try {
        const response = await fetch(`${API_URL}/reviews/me`, {
            headers: { "Authorization": `Bearer ${getToken()}` }
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

        const gameTitle = review.game ? review.game.title : `Jogo ID: ${review.gameId}`;
        card.innerHTML = `
            <h4>${gameTitle}</h4>
            <p><strong>Nota:</strong> ${review.rating}/10</p>
            <p>${review.content}</p>
            <small>Jogo avaliado: ${review.title}</small>
        `;
        listaAvaliacoesContainer.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    if (checkAuth()) {
        await fetchAndRenderMinhasReviews();
    }

    if (formAvaliacao) {
        formAvaliacao.addEventListener("submit", async (e) => {
            e.preventDefault();
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const game_id = urlParams.get('gameId');
            const rating = parseFloat(document.getElementById("nota").value);
            const content = document.getElementById("comentario").value.trim();
            const title = document.getElementById("titulo").value.trim();

            if (!game_id) {
                alert("Selecione um jogo válido!");
                return;
            }

            await handlePostReview({ game_id, rating, content, title });
        });
    }
});
