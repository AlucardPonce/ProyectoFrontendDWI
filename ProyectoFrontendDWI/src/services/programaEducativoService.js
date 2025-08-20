const API_URL = "http://20.119.81.0:8080/api/pe";

// Siempre enviamos ?soloActivos=false para obtener todos
export async function getAllProgramasEducativos() {
    const res = await fetch(`${API_URL}?soloActivos=false`);
    if (!res.ok) throw new Error("Error al obtener programas educativos");

    const data = await res.json();
    // Nos aseguramos que sea un array
    return Array.isArray(data) ? data : [];
}

export async function createPrograma(p) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error("Error al crear programa");
    return res.json();
}

export async function updatePrograma(id, p) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error("Error al actualizar programa");
    return res.json();
}

export async function deletePrograma(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar programa");
}

// Servicio para divisiones
export const getDivisiones = async () => {
    const response = await fetch('http://20.119.81.0:8080/api/division?soloActivos=true');
    if (!response.ok) throw new Error('Error al obtener divisiones');
    return response.json();
};
