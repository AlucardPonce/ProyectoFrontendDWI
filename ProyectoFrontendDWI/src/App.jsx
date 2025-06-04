import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Division from "./pages/Division";
import ProgramaEducativo from "./pages/Component/ProgramaEducativo";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
            <Menu.Item key="division">
              <Link to="/division">Divisiones</Link>
            </Menu.Item>
            <Menu.Item key="pe">
              <Link to="/programas-educativos">Programas Educativos</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: "24px" }}>
          <Routes>
            <Route path="/division" element={<Division />} />
            <Route path="/programas-educativos" element={<ProgramaEducativo />} />
            <Route path="*" element={<h2>Bienvenido al Home</h2>} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          CRUD App ©2025 UTEQ
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
