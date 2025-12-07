function entrarComEmail() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput ? emailInput.value.trim() : '';

  if (email) {
    window.location.href = `login.html?email=${encodeURIComponent(email)}`;
  } else {
    window.location.href = "login.html";
  }
}

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
