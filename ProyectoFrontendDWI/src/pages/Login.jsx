import { Form, Input, Button, Card, Typography, message, Modal, Alert } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:3001";

  const onFinish = async (values) => {
    setLoading(true);
    setFormError("");

    try {
      const response = await axios.post(`${API_URL}/login`, values);

      if (response.data.token) {
        handleLoginSuccess(response.data.token);
      } else {
        // Para pruebas sin token válido
        message.info("Login exitoso (modo prueba)");
        navigate("/home");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error en la autenticación";
      setFormError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token) => {
    // Guardamos el token incluso si no es válido, para pruebas
    localStorage.setItem("token", token);
    navigate('/home');

    // Si quisieras validar token, puedes descomentar esto:
    /*
    if (typeof token === 'string' && token.split('.').length === 3) {
      localStorage.setItem("token", token);
      navigate('/home');
    } else {
      console.error('Token recibido no válido:', token);
      message.error('Error en autenticación');
    }
    */
  };

  const handleResetPassword = () => {
    let email = "";

    Modal.confirm({
      title: "Restablecer contraseña",
      content: (
        <Input
          placeholder="Ingresa tu correo electrónico"
          onChange={(e) => (email = e.target.value)}
          type="email"
        />
      ),
      onOk: async () => {
        try {
          await axios.post(`${API_URL}/reset-password`, { email });
          message.success("Correo de recuperación enviado");
        } catch (error) {
          message.error(error.response?.data?.message || "Error al enviar correo");
        }
      },
    });
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={styles.title}>
          Iniciar Sesión
        </Title>

        {formError && (
          <Alert
            message={formError}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form layout="vertical" onFinish={onFinish}>
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
              { min: 6, message: "Mínimo 6 caracteres" }
            ]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={styles.button}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>

          <div style={styles.footer}>
            <Button
              type="link"
              onClick={handleResetPassword}
              style={styles.linkButton}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333'
  },
  button: {
    height: 40,
    fontWeight: 500
  },
  footer: {
    marginTop: 16,
    textAlign: 'center'
  },
  linkButton: {
    padding: 0
  }
};

export default LoginPage;
