import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

// ✅ Definimos la base URL en una constante
const BASE_URL = "http://20.119.81.0:8080/api";

const Division = () => {
  const [divisiones, setDivisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ nombre: '', clave: '', activo: true });

  const fetchDivisiones = () => {
    setLoading(true);
    fetch(`${BASE_URL}/division?soloActivos=false`)
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

  const showaddModal = () => {
    setEditando(null);
    setForm({ nombre: '', clave: '', activo: true });
    setCreando(true);
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta división?')) return;
    fetch(`${BASE_URL}/division/${id}`, {
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
    fetch(`${BASE_URL}/division/${editando}`, {
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

  const handleCrear = () => {
    fetch(`${BASE_URL}/division`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al crear división');
        return res.json();
      })
      .then(() => {
        setCreando(false);
        setForm({ nombre: '', clave: '', activo: true });
        fetchDivisiones();
      })
      .catch(console.error);
  };

  return (
    <div className="container">

      <Button 
        type="primary"
        onClick={showaddModal}
        style={{ marginBottom: '20px' }}
      >
        Agregar División
      </Button>

      {/* Resto del código igual */}
      {/* ... */}
    </div>
  );
};

export default Division;
