import { API_URL, saveToken } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.querySelector(".login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

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
                    const errorMessage = data.message || "E-mail ou senha inválidos.";
                    alert(`Falha no Login: ${errorMessage}`);
                    return;
                }
                saveToken(data.access_token);
                alert("Login realizado com sucesso!");

                window.location.href = "homepage.html"; 
                
            } catch (error) {
                console.error('Erro de rede ou na requisição:', error);
                alert("Erro ao conectar com o servidor. Tente novamente.");
            }
        });
    }
});
