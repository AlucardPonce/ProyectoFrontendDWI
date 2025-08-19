import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, Switch, Space, Spin, message } from 'antd';

// ✅ Definimos la base URL en una constante
const BASE_URL = "http://20.119.81.0:8080/api";

const Division = () => {
  const [divisiones, setDivisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);
  const [form] = Form.useForm();

  const fetchDivisiones = () => {
    setLoading(true);
    fetch(`${BASE_URL}/division?soloActivos=false`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener divisiones');
        return res.json();
      })
      .then((data) => {
        setDivisiones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al cargar divisiones');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDivisiones();
  }, []);

  const showAddModal = () => {
    setEditando(null);
    setCreando(true);
    form.resetFields();
    form.setFieldsValue({ activo: true });
  };

  const handleEditar = (division) => {
    setEditando(division.id);
    form.setFieldsValue({
      nombre: division.nombre,
      clave: division.clave,
      activo: division.activo,
    });
  };

  const handleEliminar = (id) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de eliminar esta división?',
      onOk: () => {
        fetch(`${BASE_URL}/division/${id}`, { method: 'DELETE' })
          .then((res) => {
            if (!res.ok) throw new Error('Error al eliminar');
            message.success('División eliminada');
            fetchDivisiones();
          })
          .catch((err) => {
            console.error(err);
            message.error('Error al eliminar división');
          });
      },
    });
  };

  const handleGuardar = () => {
    form
      .validateFields()
      .then((values) => {
        fetch(`${BASE_URL}/division/${editando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al editar');
            message.success('División editada');
            setEditando(null);
            fetchDivisiones();
          })
          .catch((err) => {
            console.error(err);
            message.error('Error al editar división');
          });
      })
      .catch(() => {});
  };

  const handleCrear = () => {
    form
      .validateFields()
      .then((values) => {
        fetch(`${BASE_URL}/division`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al crear división');
            return res.json();
          })
          .then(() => {
            message.success('División creada');
            setCreando(false);
            form.resetFields();
            fetchDivisiones();
          })
          .catch((err) => {
            console.error(err);
            message.error('Error al crear división');
          });
      })
      .catch(() => {});
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Clave', dataIndex: 'clave', key: 'clave' },
    { title: 'Activo', dataIndex: 'activo', key: 'activo', render: (activo) => (activo ? 'Sí' : 'No') },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditar(record)}>Editar</Button>
          <Button type="link" danger onClick={() => handleEliminar(record.id)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 20 }}>
        Agregar División
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table columns={columns} dataSource={divisiones} rowKey="id" />
      )}

      <Modal
        title={editando ? 'Editar División' : 'Crear División'}
        open={editando !== null || creando}
        onOk={editando ? handleGuardar : handleCrear}
        onCancel={() => {
          setEditando(null);
          setCreando(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre de la división' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clave"
            label="Clave"
            rules={[{ required: true, message: 'Ingrese la clave de la división' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="activo" label="Activo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Division;
