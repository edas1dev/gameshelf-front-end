import { API_URL, getToken, checkAuth, logout } from './utils.js';

const userInfoDisplay = document.getElementById('user-info-display');
const reviewsContainer = document.getElementById('reviews-container');
const deleteButton = document.getElementById('delete-account-btn');
const updateForm = document.getElementById('update-user-form');
const userNameTitle = document.getElementById('user-name-title');

document.addEventListener("DOMContentLoaded", function() {
    // 1. Verifica se o usuário está logado. Se não, redireciona.
    if (!checkAuth()) return;

    // 2. Carrega as informações do usuário e as reviews
    fetchUserInfo();
    fetchUserReviews();

    // 3. Adiciona listeners para atualizar e deletar
    if (updateForm) updateForm.addEventListener('submit', handleUpdateUser);
    if (deleteButton) deleteButton.addEventListener('click', handleDeleteUser);
});

async function fetchUserInfo() {
    try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/users/profile/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Não foi possível carregar as informações do usuário.");
        }

        const user = await response.json();
        renderUserInfo(user);

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        userInfoDisplay.innerHTML = `<p style="color:red;">Erro ao carregar: ${error.message}</p>`;
    }
}

function renderUserInfo(user) {
    if (!user || !userInfoDisplay) return;

    userNameTitle.textContent = `Perfil de ${user.name}`;
    document.getElementById('info-name').textContent = user.name;
    document.getElementById('info-email').textContent = user.email;
    
    // Preenche o formulário de atualização com o nome atual
    document.getElementById('update-name').value = user.name; 
}

//Busca as avaliações do usuário logado (GET /reviews/me).
async function fetchUserReviews() {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = '<p>Carregando avaliações...</p>';
    
    try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/reviews/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Não foi possível carregar as avaliações.");
        }
        
        const reviews = await response.json();
        renderUserReviews(reviews);

    } catch (error) {
        console.error("Erro ao carregar reviews:", error);
        reviewsContainer.innerHTML = `<p style="color:red;">Erro ao carregar: ${error.message}</p>`;
    }
}

function renderUserReviews(reviews) {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = "";

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = "<p>Você ainda não fez nenhuma avaliação.</p>";
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.classList.add("review-card");
        
        // Assumindo que a review do backend inclui o objeto do jogo (review.game)
        // Se o seu BE não incluir o objeto 'game', use apenas o gameId como fallback.
        const gameTitle = review.game ? review.game.title : `Jogo ID: ${review.gameId}`;
        
        card.innerHTML = `
            <h4>${gameTitle}</h4>
            <p><strong>Nota:</strong> ${review.rating}/10</p>
            <p>${review.content}</p>
        `;
        reviewsContainer.appendChild(card);
    });
}

 //Lida com a atualização do usuário (PUT /users/me).
async function handleUpdateUser(e) {
    e.preventDefault();

    const name = document.getElementById('update-name').value.trim();
    const password = document.getElementById('update-password').value.trim();
    
    const body = {};
    if (name) body.name = name;
    if (password) body.password = password;

    if (Object.keys(body).length === 0) {
        alert("Nenhum campo para atualizar foi preenchido.");
        return;
    }
    
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Falha ao atualizar o perfil.");
        }

        alert("Perfil atualizado com sucesso!");
        // Recarrega os dados para mostrar o novo nome imediatamente
        fetchUserInfo(); 

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert(`Erro na atualização: ${error.message}`);
    }
}

//Lida com a deleção da conta (DELETE /users/me).
async function handleDeleteUser() {
    if (!confirm("Tem certeza que deseja DELETAR sua conta? Esta ação é IRREVERSÍVEL!")) {
        return;
    }

    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Falha ao deletar a conta.");
        }

        alert("Conta deletada com sucesso. Sentiremos sua falta!");
        logout(); // Limpa o token e redireciona para a página inicial

    } catch (error) {
        console.error("Erro ao deletar conta:", error);
        alert(`Erro na deleção: ${error.message}`);
    }
}
