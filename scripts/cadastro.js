import { API_URL } from './utils.js';

const formCadastro = document.querySelector(".cadastro-form");

async function handleCadastro(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/users`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar usuário.");
        }

        alert("Cadastro realizado com sucesso! Você será redirecionado para o Login.");
        window.location.href = "login.html";

    } catch (error) {
        alert("Erro no Cadastro: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmSenha = document.getElementById("confirm-password").value.trim();
            
            if (password !== confirmSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            await handleCadastro(name, email, password);
        });
    }
});
