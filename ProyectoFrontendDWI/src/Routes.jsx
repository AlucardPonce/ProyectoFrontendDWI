import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Division from "./pages/Division";
import ProgramaEducativo from "./pages/Component/ProgramaEducativo";
import Categorias from "./pages/Categorias";
import TiposReq from "./pages/TiposReq";
import MainLayout from "./Layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import { isAuthenticated } from "./services/auth";

const RedirectToHome = () => {
  return isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<RedirectToHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rutas protegidas anidadas dentro del layout */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Esta es la ruta principal que renderiza en /home */}
        <Route
          index
          element={<div style={{ padding: 20 }}>Bienvenido al panel</div>}
        />

        {/* Rutas protegidas hijas de /home */}
        <Route
          path="division"
          element={
            <ProtectedRoute roles={["admin", "profesor"]}>
              <Division />
            </ProtectedRoute>
          }
        />
        <Route
          path="programas-educativos"
          element={
            <ProtectedRoute roles={["admin", "profesor"]}>
              <ProgramaEducativo />
            </ProtectedRoute>
          }
        />
        <Route
          path="categorias"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Categorias />
            </ProtectedRoute>
          }
        />
        <Route
          path="tipos-requisitos"
          element={
            <ProtectedRoute roles={["admin", "profesor", "alumno"]}>
              <TiposReq />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
