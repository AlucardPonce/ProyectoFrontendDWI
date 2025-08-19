import React, { useState, useEffect } from 'react';

const TipoReq = () => {
  const [tipos, setTipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: '', categoriaId: '' });
  const [editando, setEditando] = useState(false);

  const API_TIPOS = 'http://20.119.81.0:8082/tipos-requisito';
  const API_CATEGORIAS = 'http://20.119.81.0:8082/api/categorias';

  useEffect(() => {
    fetchTipos();
    fetchCategorias(); // 🔄 Cargar categorías
  }, []);

  const fetchTipos = async () => {
    const res = await fetch(API_TIPOS);
    const data = await res.json();
    setTipos(data);
  };

  const fetchCategorias = async () => {
    const res = await fetch(API_CATEGORIAS);
    const data = await res.json();
    setCategorias(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const url = editando ? `${API_TIPOS}/${form.id}` : API_TIPOS;

    const payload = {
      nombre: form.nombre,
      categoria: form.categoriaId ? { id: parseInt(form.categoriaId) } : null,
    };

    await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    fetchTipos();
    setForm({ id: null, nombre: '', categoriaId: '' });
    setEditando(false);
  };

  const handleEditar = (tipo) => {
    setForm({
      id: tipo.id,
      nombre: tipo.nombre,
      categoriaId: tipo.categoria?.id || '',
    });
    setEditando(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este tipo?')) return;
    await fetch(`${API_TIPOS}/${id}`, { method: 'DELETE' });
    fetchTipos();
  };

  return (
    <div className="container mt-4">
      <h3>Módulo: Tipos de Requisito</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Nombre del Tipo</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Categoría</label>
          <select
            className="form-control"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombreCategoria}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary me-2" type="submit">
          {editando ? 'Actualizar' : 'Crear'}
        </button>
        {editando && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditando(false);
              setForm({ id: null, nombre: '', categoriaId: '' });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.id}</td>
              <td>{tipo.nombre}</td>
              <td>{tipo.categoria?.nombreCategoria || 'N/A'}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(tipo)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(tipo.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TipoReq;
