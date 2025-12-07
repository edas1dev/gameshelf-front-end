import { API_URL, saveToken } from './utils.js';

const formLogin = document.querySelector(".login-form");

async function handleLogin(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Credenciais inválidas. Tente novamente.");
        }

        const data = await response.json();
        saveToken(data.access_token); 
        
        alert("Login realizado com sucesso!");
        window.location.href = "jogos.html";

    } catch (error) {
        alert("Erro no Login: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const emailFromIndex = params.get('email');
    const emailInput = document.getElementById("email");
    if (emailFromIndex && emailInput) {
        emailInput.value = emailFromIndex;
    }

    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            await handleLogin(email, password);
        });
    }
});
