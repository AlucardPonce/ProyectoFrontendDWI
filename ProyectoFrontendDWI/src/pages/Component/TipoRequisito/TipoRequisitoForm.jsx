import React, { useState } from 'react';
import { createTipoRequisito  } from '../../../services/tipoRequisitoService.js';
import { showSuccess, showError } from '../../../helpers/alerts.js';

const TipoRequisitoForm = ({ categoriaId, onCreated }) => {
    const [nombre, setNombre] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoriaId || !nombre.trim()) {
            return showError('Campos obligatorios', 'Debes ingresar un nombre y seleccionar una categoría');
        }

        try {
            await createTipoRequisito({ nombre, categoriaId });
            setNombre('');
            onCreated(); // recargar lista
            showSuccess('Agregado', 'Requisito creado correctamente');
        } catch (err) {
            console.error(err);
            showError('Error al crear', 'Ocurrió un error al guardar el requisito');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <div className="form-group">
                <label>Nombre del requisito</label>
                <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary mt-2">Agregar Requisito</button>
        </form>
    );
};

export default TipoRequisitoForm;
