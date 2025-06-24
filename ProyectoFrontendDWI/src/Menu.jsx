import { Menu } from "antd";
import { Link } from "react-router-dom";

function AppMenu() {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
      <Menu.Item key="division">
        <Link to="/division">Divisiones</Link>
      </Menu.Item>
      <Menu.Item key="pe">
        <Link to="/programas-educativos">Programas Educativos</Link>
      </Menu.Item>
        <Menu.Item key="Categorias">
        <Link to="/categorias">Categorias</Link>
      </Menu.Item>
        <Menu.Item key="TiposReq">
        <Link to="/tipos-requisitos">Tipos de Requisitos</Link>
      </Menu.Item>
    </Menu>
  );
}

export default AppMenu;