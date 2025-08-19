import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './services/AuthContext';  // 👈 importa tu provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>   {/* 👈 envuelves tu App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
