import React from 'react';
import {
    HomeOutlined,
    AppstoreOutlined,
    BookOutlined,
    TagsOutlined,
    FileDoneOutlined,
    SearchOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext'; // Ajusta la ruta a tu AuthContext
import logo from '../assets/Logo Monkey D. Luffy (Logo One Piece).png'; // Descomenta si tienes logo

const Navbar = () => {
    const { setUser } = useAuth(); // Función para actualizar estado del usuario
    const navigate = useNavigate();

    const handleLogout = () => {
        // Limpiar almacenamiento local
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Actualizar estado global de AuthContext
        setUser(null);
        // Redirigir al login
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navContent}>
                <div style={styles.logo}>
                    <Link to="/home">
                        <img
                            src={logo}
                            alt="../assets/Logo Monkey D. Luffy (Logo One Piece).png"
                            style={{
                                height: '40px',
                                width: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                borderRadius: '50%'
                            }}
                        />
                    </Link>
                </div>

                <div style={styles.navLinks}>
                    <Link to="/home" style={styles.link}>
                        <HomeOutlined /> Inicio
                    </Link>
                    <Link to="/home/division" style={styles.link}>
                        <AppstoreOutlined /> División
                    </Link>
                    <Link to="/home/programas-educativos" style={styles.link}>
                        <BookOutlined /> Programas
                    </Link>
                    <Link to="/home/categorias" style={styles.link}>
                        <TagsOutlined /> Categorías
                    </Link>
                    <Link to="/home/profesores" style={styles.link}>
                        <UserOutlined /> Profesores
                    </Link>

                    <div style={styles.searchContainer}>
                        <SearchOutlined style={styles.searchIcon} />
                        <input type="text" placeholder="Buscar..." style={styles.input} />
                    </div>

                    {/* Botón de Cerrar Sesión */}
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        <LogoutOutlined /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: '#001529',
        zIndex: 1000,
        padding: '10px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    navContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center'
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    searchContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchIcon: {
        position: 'absolute',
        left: '8px',
        color: '#999'
    },
    input: {
        padding: '5px 10px 5px 30px',
        borderRadius: '4px',
        border: 'none',
        outline: 'none'
    },
    logoutButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    }
};

export default Navbar;
