const API_URL = "http://20.119.81.0:8080/api/pe";

export async function getAllProgramasEducativos() {
    const res = await fetch(API_URL);
    return await res.json();
}

export async function createPrograma(p) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
    });
    return await res.json();
}

export async function updatePrograma(id, p) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
    });
    return await res.json();
}

export async function deletePrograma(id) {
    return await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

// src/services/divisionService.js
export const getDivisiones = async () => {
    const response = await fetch('http://20.119.81.0:8080/api/division?soloActivos=true');
    if (!response.ok) throw new Error('Error al obtener divisiones');
    return response.json();
};
