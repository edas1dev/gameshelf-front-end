function entrarComEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput ? emailInput.value.trim() : '';
  
  // redireciona para a página de login com o e-mail pré-preenchido
  if (email) {
    window.location.href = `login.html?email=${encodeURIComponent(email)}`;
  } else {
    window.location.href = "login.html";
  }
}

// Expõe a função para ser usada pelo atributo onclick no HTML
window.entrarComEmail = entrarComEmail; 

document.addEventListener("DOMContentLoaded", () => {
    // Adiciona o listener para o menu mobile, se existir
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
