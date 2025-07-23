import React, { useState } from "react";
import { Form, Input, Button, Alert, Progress } from "antd";

// Lista negra de contraseñas
const worstPasswords = [
  "123456",
  "password",
  "123456789",
  "12345",
  "12345678",
  "qwerty",
  "1234567",
  "111111",
  "123123",
  "abc123",
];

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    !worstPasswords.includes(password)
  );
}

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (!worstPasswords.includes(password)) score += 1;
  return score;
}

export default function Login() {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = (values) => {
    const { password } = values;
    if (!isStrongPassword(password)) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    setError("");
    alert("¡Inicio de sesión exitoso!");
  };

  const strength = passwordStrength(password);
  const percent = (strength / 5) * 100;
  const status =
    percent < 40 ? "exception" : percent < 80 ? "normal" : "success";
  const strengthText =
    percent < 40 ? "Débil" : percent < 80 ? "Media" : "Fuerte";

  return (
    <div style={{ maxWidth: 350, margin: "40px auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Registro</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Por favor ingresa tu contraseña" },
            {
              validator: (_, value) =>
                !value || isStrongPassword(value)
                  ? Promise.resolve()
                  : Promise.reject(
                      "La contraseña debe tener al menos 8 caracteres, un carácter especial"
                    ),
            },
          ]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        {password && (
          <div style={{ marginBottom: 16 }}>
            <Progress
              percent={percent}
              status={status}
              showInfo={false}
              strokeWidth={10}
            />
            <div style={{ textAlign: "right", fontSize: 12, color: "#888" }}>
              Fortaleza: {strengthText}
            </div>
          </div>
        )}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
