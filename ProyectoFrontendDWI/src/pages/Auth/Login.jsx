import React, { useState } from "react";
import { Form, Input, Button, Alert, Progress } from "antd";
import './Login.css';

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
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Iniciar Sesión</h1>
            <Form onFinish={onFinish} className="login-form">
              <Form.Item
                  label="Usuario"
                  name="username"
                  rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
              >
                <Input className="custom-input" />
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
                    className="custom-input"
                />
              </Form.Item>
              {password && (
                  <div className="password-strength-container">
                    <Progress
                        percent={percent}
                        status={status}
                        showInfo={false}
                        strokeWidth={8}
                        className="password-progress"
                    />
                    <div className="strength-text">
                      Fortaleza: {strengthText}
                    </div>
                  </div>
              )}
              {error && (
                  <Alert
                      message={error}
                      type="error"
                      showIcon
                      className="error-alert"
                  />
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="submit-button">
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
  );
}