import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../services/Auth";

const ProtectedRoute = ({ children, roles }) => {
  if (!isAuthenticated()) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(getRole())) {
    // Si el usuario no tiene el rol requerido, redirige a una página de no autorizado
    return <Navigate to="/unauthorized" replace />;
  }

  // Si está autenticado y tiene el rol permitido, renderiza la ruta protegida
  return children;
};

export default ProtectedRoute;
