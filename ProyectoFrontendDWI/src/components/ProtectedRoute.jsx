import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar spinner mientras se valida el token
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

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar los children
  return children;
};

export default ProtectedRoute;