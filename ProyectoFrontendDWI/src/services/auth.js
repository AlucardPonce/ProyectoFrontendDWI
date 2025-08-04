const API_URL = "http://localhost:8083/api/auth";

export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Respuesta del servidor no es JSON válido");
    }

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // Guardar el rol
      localStorage.setItem("user", JSON.stringify(data)); // Guardar todo el usuario si se requiere
      return data;
    } else {
      throw new Error(data.error || "Login failed");
    }
  } catch (error) {
    if (error.name === "SyntaxError") {
      throw new Error("Error de comunicación con el servidor");
    }
    throw error;
  }
}

export async function register(userData) {
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Respuesta del servidor no es JSON válido");
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    if (error.name === "SyntaxError") {
      throw new Error("Error de comunicación con el servidor");
    }
    throw error;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function hasRole(role) {
  return getRole() === role;
}

export function isAdmin() {
  return getRole() === "admin";
}

export function isProfesor() {
  return getRole() === "profesor";
}

export function isAlumno() {
  return getRole() === "alumno";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  // exp está en segundos
  return payload.exp * 1000 < Date.now();
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired()) {
    logout();
    return false;
  }
  return true;
}
