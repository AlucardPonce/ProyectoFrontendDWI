import React, { useEffect, useState } from 'react';

const Division = () => {
  const [divisiones, setDivisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null); // división que se está editando
  const [form, setForm] = useState({ nombre: '', clave: '', activo: true });

  const fetchDivisiones = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/division?soloActivos=false')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener divisiones');
        return res.json();
      })
      .then((data) => {
        setDivisiones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDivisiones();
  }, []);

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta división?')) return;
    fetch(`http://localhost:8080/api/division/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        fetchDivisiones();
      })
      .catch(console.error);
  };

  const handleEditar = (division) => {
    setEditando(division.id);
    setForm({
      nombre: division.nombre,
      clave: division.clave,
      activo: division.activo,
    });
  };

  const handleGuardar = () => {
    fetch(`http://localhost:8080/api/division/${editando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al editar');
        setEditando(null);
        fetchDivisiones();
      })
      .catch(console.error);
  };

  return (
    <div className="container">
      <h1>Divisiones</h1>
      {loading ? (
        <p>Cargando divisiones...</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Clave</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {divisiones.map((div) => (
              <tr key={div.id}>
                <td>{div.id}</td>
                <td>
                  {editando === div.id ? (
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                  ) : (
                    div.nombre
                  )}
                </td>
                <td>
                  {editando === div.id ? (
                    <input
                      type="text"
                      value={form.clave}
                      onChange={(e) => setForm({ ...form, clave: e.target.value })}
                    />
                  ) : (
                    div.clave
                  )}
                </td>
                <td>
                  {editando === div.id ? (
                    <select
                      value={form.activo}
                      onChange={(e) => setForm({ ...form, activo: e.target.value === 'true' })}
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  ) : div.activo ? 'Sí' : 'No'}
                </td>
                <td>
                  {editando === div.id ? (
                    <button onClick={handleGuardar}>Guardar</button>
                  ) : (
                    <button onClick={() => handleEditar(div)}>Editar</button>
                  )}
                  <button onClick={() => handleEliminar(div.id)} style={{ marginLeft: '10px' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Division;
