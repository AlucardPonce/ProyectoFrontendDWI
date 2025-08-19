import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Division from './pages/Division';
import ProgramaEducativo from './pages/Component/ProgramaEducativo';
import Categorias from './pages/Categorias';
import TiposReq from './pages/TiposReq';
import MainLayout from './Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './services/AuthContext';
import { Navigate } from 'react-router-dom';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si está cargando, no mostrar nada o mostrar un spinner
  if (loading) {
    return null;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/" 
        element={
          isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />
        } 
      />

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
          element={
            <div style={{ 
              padding: 20,
              background: 'white',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2>¡Bienvenido al panel de administración!</h2>
              <p>Selecciona una opción del menú para comenzar.</p>
            </div>
          } 
        />

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

      {/* Ruta para manejar 404 o rutas no válidas */}
      <Route 
        path="*" 
        element={
          isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;