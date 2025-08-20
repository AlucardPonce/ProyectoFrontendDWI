import { Form, Input, Button, Card, Typography, message, Alert, Tabs } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const { Title } = Typography;
const { TabPane } = Tabs;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (values) => {
    setLoading(true);
    setFormError("");

    try {
      const result = await login(values);

      if (result.success) {
        message.success("Login exitoso");
        navigate("/home");
      } else {
        setFormError(result.error);
      }
    } catch (error) {
      setFormError("Error inesperado en login");
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    setFormError("");

    try {
      const result = await register(values);

      if (result.success) {
        message.success(result.data.message || "Usuario registrado correctamente, ahora puedes iniciar sesión");
        setActiveTab("login");
      } else {
        setFormError(result.error);
      }
    } catch (error) {
      setFormError("Error inesperado en registro");
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Autenticación
        </Title>

        {formError && (
          <Alert message={formError} type="error" showIcon style={{ marginBottom: 20 }} />
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="Iniciar Sesión" key="login">
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Usuario"
                name="username"
                rules={[{ required: true, message: "Ingrese su usuario" }]}
              >
                <Input placeholder="Usuario" />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Ingrese su contraseña" },
                  { min: 6, message: "Mínimo 6 caracteres" },
                ]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Registrar" key="register">
            <Form layout="vertical" onFinish={handleRegister}>
              <Form.Item
                label="Usuario"
                name="username"
                rules={[{ required: true, message: "Ingrese un usuario" }]}
              >
                <Input placeholder="Usuario" />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Ingrese una contraseña" },
                  { min: 6, message: "Mínimo 6 caracteres" },
                ]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Ingrese su email" },
                  { type: "email", message: "Email inválido" }
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[{ required: true, message: "Ingrese su nombre" }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>

              <Form.Item
                label="Apellido"
                name="apellido"
                rules={[{ required: true, message: "Ingrese su apellido" }]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>

              <Form.Item
                label="Teléfono"
                name="telefono"
              >
                <Input placeholder="Teléfono (opcional)" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Registrar
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

export default Login;