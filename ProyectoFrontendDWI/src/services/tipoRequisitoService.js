import axios from 'axios';

const API_URL = 'http://localhost:8001/tipos-requisito';

export const getCategorias = () =>
    axios.get(`${API_URL}/categorias`);

export const getTiposRequisitoByCategoria = (categoriaId) =>
    axios.get(`${API_URL}/categorias/${categoriaId}/tipos-requisito`);

export const createTipoRequisito = (data) =>
    axios.post(`${API_URL}/tipos-requisito`, data);

export const deleteTipoRequisito = (id) =>
    axios.delete(`${API_URL}/tipos-requisito/${id}`);
