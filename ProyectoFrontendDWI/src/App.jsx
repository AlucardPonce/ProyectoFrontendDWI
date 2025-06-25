import { BrowserRouter } from "react-router-dom";
import { Layout } from "antd";
import AppMenu from "./Menu";
import AppRoutes from "./Routes";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <AppMenu />
        </Header>
        <Content style={{ padding: "24px" }}>
          <AppRoutes />
        </Content>
        <Footer style={{ textAlign: "center" }}>
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;