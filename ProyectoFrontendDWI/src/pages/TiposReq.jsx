import React, { useState } from 'react';
import CategoriaSelector from './Component/TipoRequisito/CategoriaSelector.jsx';
import TipoRequisitoForm from './Component/TipoRequisito/TipoRequisitoForm';
import TipoRequisitoList from './Component/TipoRequisito/TipoRequisitoList';

const TipoReq = () => {
    const [categoriaId, setCategoriaId] = useState(null);
    const [triggerReload, setTriggerReload] = useState(false);

    const reload = () => setTriggerReload(!triggerReload);

    return (
        <div className="container mt-4">
            <h3>Módulo: Tipos de Requisito</h3>

            <CategoriaSelector onSelect={setCategoriaId} />

            {categoriaId && (
                <>
                    <TipoRequisitoForm categoriaId={categoriaId} onCreated={reload} />
                    <TipoRequisitoList categoriaId={categoriaId} trigger={triggerReload} />
                </>
            )}
        </div>
    );
};

export default TipoReq;
