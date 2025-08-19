// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated()) {
            setRedirect(true);
        } else {
            setRedirect(false);
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <Spin size="large" />
                <p>Validando sesión...</p>
            </div>
        );
    }

    if (redirect) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
