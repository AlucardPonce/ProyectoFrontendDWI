import { Outlet } from 'react-router-dom';
import "./Styles/main.css";
import Navbar from "../components/Navbar";

const MainLayout = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar />
            <main style={{ 
                marginLeft: "0px", 
                marginTop: "60px",
                padding: "20px",
                minHeight: 'calc(100vh - 60px)'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;