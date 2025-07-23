const API_URL = "http://localhost:8080/api/auth";

export async function login(credentials) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        throw new Error("Error al iniciar sesión");
    }
    return await res.json();
}

export async function register(userData) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        throw new Error("Error al registrar usuario");
    }
    return await res.json();
}
