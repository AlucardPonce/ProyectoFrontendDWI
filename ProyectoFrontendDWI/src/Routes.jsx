import { Routes, Route } from "react-router-dom";
import Division from "./pages/Division";
import ProgramaEducativo from "./pages/Component/ProgramaEducativo";
import Cateforias from "./pages/Categorias";
import TiposReq from "./pages/TiposReq";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Login />} />
      <Route path="/" element={<Register />} />
      <Route path="/division" element={<Division />} />
      <Route path="/programas-educativos" element={<ProgramaEducativo />} />
      <Route path="/categorias" element={<Cateforias />} />
      <Route path="/tipos-requisitos" element={<TiposReq />} />
    </Routes>
  );
}

export default AppRoutes;
