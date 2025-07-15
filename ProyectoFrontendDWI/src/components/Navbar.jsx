import React from 'react';
import {
    HomeOutlined,
    AppstoreOutlined,
    BookOutlined,
    TagsOutlined,
    FileDoneOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
// import logo from '../assets/Logo.png'; // Descomenta si tienes logo

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.navContent}>
                <div style={styles.logo}>
                    <Link to="/home">
                        <img
                            // src={logo}
                            alt="Logo"
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
                    <Link to="/home/tipos-requisitos" style={styles.link}>
                        <FileDoneOutlined /> Requisitos
                    </Link>

                    <div style={styles.searchContainer}>
                        <SearchOutlined style={styles.searchIcon} />
                        <input type="text" placeholder="Buscar..." style={styles.input} />
                    </div>
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
    }
};

export default Navbar;
