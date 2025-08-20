import React from "react";
import ProfesorCRUD from "../pages/Component/Profesor";

export default function Profesor() {
    return (
        <div style={{
            padding: 20,
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <ProfesorCRUD />
        </div>
    );
}