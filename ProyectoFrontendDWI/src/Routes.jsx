import { Routes, Route } from "react-router-dom";
import Division from "./pages/Division";
import ProgramaEducativo from "./pages/Component/ProgramaEducativo";
import Cateforias from "./pages/Categorias";
import TiposReq from "./pages/TiposReq";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/division" element={<Division />} />
      <Route path="/programas-educativos" element={<ProgramaEducativo />} />
      <Route path="/categorias" element={<Cateforias />} />
      <Route path="/tipos-requisitos" element={<TiposReq />} />

      <Route path="/" element={<h2>Bienvenido al Home</h2>} />
    </Routes>
  );
}

export default AppRoutes;