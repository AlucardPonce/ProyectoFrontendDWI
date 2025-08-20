const API_URL = "http://20.119.81.0:8081/api/profesores";

// Obtener todos los profesores
export async function getAllProfesores() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener profesores");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

// Obtener profesor por ID
export async function getProfesorById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Error al obtener profesor");
    return res.json();
}

// Obtener profesor con detalles del programa educativo
export async function getProfesorConPrograma(id) {
    const res = await fetch(`${API_URL}/${id}/detalle`);
    if (!res.ok) throw new Error("Error al obtener profesor con programa");
    return res.json();
}

// Crear nuevo profesor
export async function createProfesor(profesor) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profesor),
    });
    if (!res.ok) throw new Error("Error al crear profesor");
    return res.json();
}

// Actualizar profesor
export async function updateProfesor(id, profesor) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profesor),
    });
    if (!res.ok) throw new Error("Error al actualizar profesor");
    return res.json();
}

// Actualizar solo el id_pe del profesor
export async function updateProfesorPrograma(id, idPe) {
    const res = await fetch(`${API_URL}/${id}/idpe`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPe }),
    });
    if (!res.ok) throw new Error("Error al actualizar programa del profesor");
    return res.json();
}

// Eliminar profesor
export async function deleteProfesor(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Error al eliminar profesor");
}

// Servicio para obtener programas educativos (para el selector)
export const getProgramasEducativos = async () => {
    const response = await fetch('http://20.119.81.0:8080/api/pe?soloActivos=true');
    if (!response.ok) throw new Error('Error al obtener programas educativos');
    return response.json();
};