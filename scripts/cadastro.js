import { API_URL, saveToken } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    const formCadastro = document.querySelector(".cadastro-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                // 1. Envia os dados para o endpoint de Cadastro (POST /users/)
                const response = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Trata erros de validação ou de servidor
                    const errorMessage = data.message || "Erro desconhecido ao cadastrar.";
                    alert(`Falha no Cadastro: ${errorMessage}`);
                    return;
                }

                // 2. Se o cadastro for bem-sucedido, faz o login automático (POST /auth/login)
                const loginResponse = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const loginData = await loginResponse.json();

                if (!loginResponse.ok || !loginData.access_token) {
                    // O cadastro funcionou, mas o login falhou. Redireciona para login manual.
                    alert("Cadastro realizado com sucesso! Por favor, faça login.");
                    window.location.href = "login.html";
                    return;
                }

                // 3. Salva o token e redireciona
                saveToken(loginData.access_token);
                alert("Cadastro e Login realizados com sucesso!");
                window.location.href = "homepage.html";

            } catch (error) {
                console.error('Erro de rede ou na requisição:', error);
                alert("Erro ao conectar com o servidor. Tente novamente.");
            }
        });
    }
});
