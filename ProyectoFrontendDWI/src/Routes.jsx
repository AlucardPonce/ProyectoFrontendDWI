import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Division from './pages/Division';
import ProgramaEducativo from './pages/Component/ProgramaEducativo';
import Categorias from './pages/Categorias';
import TiposReq from './pages/TiposReq';
import MainLayout from './Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

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
        <Route index element={<div style={{ padding: 20 }}>Bienvenido al panel</div>} />

        {/* Rutas protegidas hijas de /home */}
        <Route
          path="division"
          element={
            <ProtectedRoute>
              <Division />
            </ProtectedRoute>
          }
        />
        <Route
          path="programas-educativos"
          element={
            <ProtectedRoute>
              <ProgramaEducativo />
            </ProtectedRoute>
          }
        />
        <Route
          path="categorias"
          element={
            <ProtectedRoute>
              <Categorias />
            </ProtectedRoute>
          }
        />
        <Route
          path="tipos-requisitos"
          element={
            <ProtectedRoute>
              <TiposReq />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
