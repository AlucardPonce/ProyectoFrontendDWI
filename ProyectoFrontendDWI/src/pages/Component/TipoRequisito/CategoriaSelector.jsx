import React, { useEffect, useState } from 'react';
import { getCategorias } from '../../../services/tipoRequisitoService.js';
import { showError } from '../../../helpers/alerts.js';

const CategoriaSelector = ({ onSelect }) => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        getCategorias()
            .then(res => setCategorias(res.data))
            .catch(err => {
                console.error(err);
                showError('Error al cargar categorías', 'Verifica la conexión con el servidor');
            });
    }, []);

    return (
        <div className="form-group">
            <label htmlFor="categoria">Selecciona una categoría:</label>
            <select className="form-control" id="categoria" onChange={(e) => onSelect(e.target.value)}>
                <option value="">-- Selecciona --</option>
                {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
            </select>
        </div>
    );
};

export default CategoriaSelector;
