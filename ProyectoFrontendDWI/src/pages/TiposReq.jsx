import React, { useState, useEffect } from 'react';

const TipoReq = () => {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: '', categoriaId: '' });
  const [editando, setEditando] = useState(false);
  const API_URL = 'http://localhost:8001/tipos-requisito';

  // Cargar tipos al iniciar
  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTipos(data);
    } catch (err) {
      console.error('Error al cargar tipos:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';
    const url = editando ? `${API_URL}/${form.id}` : API_URL;

    const payload = {
      nombre: form.nombre,
      categoria: form.categoriaId ? { id: parseInt(form.categoriaId) } : null,
    };

    try {
      await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      fetchTipos();
      setForm({ id: null, nombre: '', categoriaId: '' });
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar:', err);
    }
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
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTipos();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
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
          <label>ID Categoría</label>
          <input
            type="number"
            className="form-control"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
          />
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
            <th>Categoría ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.id}</td>
              <td>{tipo.nombre}</td>
              <td>{tipo.categoria?.id || 'N/A'}</td>
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
