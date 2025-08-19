import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const API_URL = "http://20.119.81.0:8083/api";

    // Configurar axios para incluir el token en todas las peticiones
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Validar token al cargar la aplicación
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const response = await axios.post(`${API_URL}/validate`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Token inválido:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        validateToken();
    }, [token]);

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);

            // Tu backend devuelve: token, id, username, email, nombre, apellido
            const { token: newToken, id, username, email, nombre, apellido } = response.data;

            const userData = { id, username, email, nombre, apellido };

            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error en autenticación'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error en registro'
            };
        }
    };

    const logout = async () => {
        try {
            if (user && token) {
                await axios.post(`${API_URL}/logout`,
                    { username: user.username },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const isAuthenticated = () => {
        return !!(token && user);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};