import { API_URL, saveToken } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.querySelector(".login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Preenche o email se ele veio da página inicial
    const urlParams = new URLSearchParams(window.location.search);
    const prefilledEmail = urlParams.get('email');
    if (prefilledEmail && emailInput) {
        emailInput.value = prefilledEmail;
    }

    if (formLogin) {
        formLogin.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Geralmente 401 Unauthorized ou 400 Bad Request
                    const errorMessage = data.message || "E-mail ou senha inválidos.";
                    alert(`Falha no Login: ${errorMessage}`);
                    return;
                }

                // 1. Salva o token (a resposta deve conter { access_token: "..." })
                saveToken(data.access_token);
                alert("Login realizado com sucesso!");

                // 2. Redireciona para a página de perfil ou catálogo
                window.location.href = "jogos.html"; 
                
            } catch (error) {
                console.error('Erro de rede ou na requisição:', error);
                alert("Erro ao conectar com o servidor. Tente novamente.");
            }
        });
    }
});
