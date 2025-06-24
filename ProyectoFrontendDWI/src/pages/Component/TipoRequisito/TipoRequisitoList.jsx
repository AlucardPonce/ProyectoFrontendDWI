import React, { useEffect, useState } from 'react';
import { getTiposRequisitoByCategoria, deleteTipoRequisito } from '../../../services/tipoRequisitoService.js';
import { confirmDelete, showSuccess, showError } from '../../../helpers/alerts.js';

const TipoRequisitoList = ({ categoriaId, trigger }) => {
    const [requisitos, setRequisitos] = useState([]);

    const cargarDatos = async () => {
        if (!categoriaId) return;
        try {
            const res = await getTiposRequisitoByCategoria(categoriaId);
            setRequisitos(res.data);
        } catch (err) {
            console.error(err);
            alert('Error al cargar los requisitos');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [categoriaId, trigger]); // trigger permite recargar al crear/eliminar

    const eliminar = async (id) => {
        const confirmed = await confirmDelete('este requisito');
        if (!confirmed) return;

        try {
            await deleteTipoRequisito(id);
            cargarDatos();
            showSuccess('Eliminado', 'Requisito eliminado correctamente');
        } catch (err) {
            console.error(err);
            showError('Error al eliminar', 'No se pudo eliminar el requisito');
        }
    };

    return (
        <div>
            <h5>Tipos de Requisito</h5>
            {requisitos.length === 0 ? (
                <p>No hay requisitos para esta categoría.</p>
            ) : (
                <ul className="list-group">
                    {requisitos.map(r => (
                        <li key={r.id} className="list-group-item d-flex justify-content-between">
                            {r.nombre}
                            <button className="btn btn-sm btn-danger" onClick={() => eliminar(r.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TipoRequisitoList;
