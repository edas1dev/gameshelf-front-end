export const API_URL = "http://localhost:3000"; 

export function getToken() {
  return localStorage.getItem("access_token");
}

export function saveToken(token) {
  localStorage.setItem("access_token", token);
}

export function logout() {
  localStorage.removeItem("access_token");
  // Opcional: remover dados do usuário se estiverem salvos
  // localStorage.removeItem("user_data");
  window.location.href = "index.html";
}

/**
 * Verifica a autenticação e redireciona se necessário (apenas para páginas protegidas).
 * @param {boolean} redirect Se deve redirecionar para o login.
 * @returns {boolean} Se o usuário está autenticado.
 */
export function checkAuth(redirect = true) {
  const token = getToken();
  if (!token && redirect) {
    setTimeout(() => {
        window.location.href = "login.html";
    }, 10);
    return false;
  }
  return !!token;
}
