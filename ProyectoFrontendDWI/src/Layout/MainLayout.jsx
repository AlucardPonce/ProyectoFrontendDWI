import { Outlet } from 'react-router-dom';
import "./Styles/main.css";
import Navbar from "../components/Navbar"

const MainLayout = () => {

    return (
        <div>
            <Navbar />
            <main style={{ marginLeft: "80px", marginTop: "60px" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
