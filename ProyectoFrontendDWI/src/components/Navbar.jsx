import React from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  TagsOutlined,
  FileDoneOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getRole, isAuthenticated, logout, getToken } from "../services/Auth";
// import logo from '../assets/Logo.png'; // Descomenta si tienes logo

const Navbar = () => {
  const role = getRole();
  const authenticated = isAuthenticated();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Llama a tu endpoint de backend para invalidar el token (opcional)
    const username = JSON.parse(localStorage.getItem("user"))?.username;
    const token = getToken();
    try {
      if (username && token) {
        await fetch("http://localhost:8083/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });
      }
    } catch (e) {
      // Ignora errores de red/logout
    }
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        <div style={styles.logo}>
          <Link to="/home">
            <img
              // src={logo}
              alt="Logo"
              style={{
                height: "40px",
                width: "40px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
            />
          </Link>
        </div>

        <div style={styles.navLinks}>
          {authenticated && (
            <>
              <Link to="/home" style={styles.link}>
                <HomeOutlined /> Inicio
              </Link>
              {(role === "admin" || role === "profesor") && (
                <Link to="/home/division" style={styles.link}>
                  <AppstoreOutlined /> División
                </Link>
              )}
              {role === "admin" && (
                <Link to="/home/programas-educativos" style={styles.link}>
                  <BookOutlined /> Programas
                </Link>
              )}
              {(role === "admin" || role === "profesor") && (
                <Link to="/home/categorias" style={styles.link}>
                  <TagsOutlined /> Categorías
                </Link>
              )}
              {(role === "admin" ||
                role === "profesor" ||
                role === "alumno") && (
                <Link to="/home/tipos-requisitos" style={styles.link}>
                  <FileDoneOutlined /> Requisitos
                </Link>
              )}
              <button onClick={handleLogout} style={styles.logoutButton}>
                Cerrar sesión
              </button>
            </>
          )}
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
    position: "fixed",
    top: 0,
    width: "100%",
    backgroundColor: "#001529",
    zIndex: 1000,
    padding: "10px 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "8px",
    color: "#999",
  },
  input: {
    padding: "5px 10px 5px 30px",
    borderRadius: "4px",
    border: "none",
    outline: "none",
  },
  logoutButton: {
    background: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 14px",
    marginLeft: "16px",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default Navbar;
