import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Spin,
  message,
  Card,
  Typography,
  Tag,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Divider,
  Alert,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ✅ Base URL configurada
const BASE_URL = "http://20.119.81.0:8080/api";

const Division = () => {
  const [divisiones, setDivisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);
  const [soloActivos, setSoloActivos] = useState(false);
  const [form] = Form.useForm();

  // Estadísticas calculadas
  const totalDivisiones = divisiones.length;
  const divisionesActivas = divisiones.filter(d => d.activo).length;
  const divisionesInactivas = totalDivisiones - divisionesActivas;

  const fetchDivisiones = () => {
    setLoading(true);
    fetch(`${BASE_URL}/division?soloActivos=${soloActivos}`)
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
  }, [soloActivos]);

  const showAddModal = () => {
    setEditando(null);
    setCreando(true);
    form.resetFields();
    form.setFieldsValue({ activo: true });
  };

  const handleEditar = (division) => {
    setEditando(division.id);
    setCreando(true);
    form.setFieldsValue({
      nombre: division.nombre,
      clave: division.clave,
      activo: division.activo,
    });
  };

  const handleEliminar = (id, nombre) => {
    fetch(`${BASE_URL}/division/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        message.success(`División "${nombre}" eliminada correctamente`);
        fetchDivisiones();
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al eliminar división. Puede que tenga programas asociados.');
      });
  };

  const handleGuardar = () => {
    form
      .validateFields()
      .then((values) => {
        const url = editando 
          ? `${BASE_URL}/division/${editando}`
          : `${BASE_URL}/division`;
        const method = editando ? 'PUT' : 'POST';
        
        fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al guardar');
            message.success(`División ${editando ? 'actualizada' : 'creada'} correctamente`);
            setEditando(null);
            setCreando(false);
            form.resetFields();
            fetchDivisiones();
          })
          .catch((err) => {
            console.error(err);
            message.error(`Error al ${editando ? 'actualizar' : 'crear'} división`);
          });
      })
      .catch(() => {});
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Clave',
      dataIndex: 'clave',
      key: 'clave',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 100,
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      onFilter: (value, record) => record.activo === value,
      render: (activo) => (
        <Tag 
          icon={activo ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={activo ? 'success' : 'error'}
        >
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Programas',
      dataIndex: 'programasEducativos',
      key: 'programas',
      width: 100,
      render: (programas) => (
        <Tooltip title={`${programas?.length || 0} programas educativos`}>
          <Tag icon={<TeamOutlined />} color="orange">
            {programas?.length || 0}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditar(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Eliminar división"
            description={`¿Estás seguro de eliminar "${record.nombre}"?`}
            onConfirm={() => handleEliminar(record.id, record.nombre)}
            okText="Sí"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Eliminar">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <TeamOutlined style={{ marginRight: '8px' }} />
            Gestión de Divisiones
          </Title>
          <Text type="secondary">
            Administra las divisiones académicas de la institución
          </Text>
        </div>

        {/* Estadísticas */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total de Divisiones"
                value={totalDivisiones}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Divisiones Activas"
                value={divisionesActivas}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Divisiones Inactivas"
                value={divisionesInactivas}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Controles */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
                size="large"
              >
                Nueva División
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchDivisiones}
                loading={loading}
              >
                Actualizar
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text>Mostrar solo activas:</Text>
              <Switch
                checked={soloActivos}
                onChange={setSoloActivos}
                checkedChildren="Sí"
                unCheckedChildren="No"
              />
            </Space>
          </Col>
        </Row>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Cargando divisiones...</Text>
            </div>
          </div>
        ) : divisiones.length === 0 ? (
          <Alert
            message="No hay divisiones"
            description={
              soloActivos 
                ? "No se encontraron divisiones activas." 
                : "No se han creado divisiones aún."
            }
            type="info"
            showIcon
            style={{ textAlign: 'center' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={divisiones}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} divisiones`,
            }}
            scroll={{ x: 800 }}
            bordered
            size="middle"
          />
        )}
      </Card>

      {/* Modal para crear/editar */}
      <Modal
        title={
          <Space>
            {editando ? <EditOutlined /> : <PlusOutlined />}
            {editando ? 'Editar División' : 'Nueva División'}
          </Space>
        }
        open={creando}
        onOk={handleGuardar}
        onCancel={() => {
          setEditando(null);
          setCreando(false);
          form.resetFields();
        }}
        okText={editando ? 'Actualizar' : 'Crear'}
        cancelText="Cancelar"
        width={500}
        destroyOnClose
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="nombre"
            label="Nombre de la División"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
              { max: 45, message: 'El nombre no puede exceder 45 caracteres' }
            ]}
          >
            <Input
              placeholder="Ej: División de Ingeniería"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="clave"
            label="Clave de la División"
            rules={[
              { required: true, message: 'La clave es obligatoria' },
              { min: 2, message: 'La clave debe tener al menos 2 caracteres' },
              { max: 45, message: 'La clave no puede exceder 45 caracteres' }
            ]}
          >
            <Input
              placeholder="Ej: DIV001"
              size="large"
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => {
                form.setFieldsValue({ clave: e.target.value.toUpperCase() });
              }}
            />
          </Form.Item>

          <Form.Item
            name="activo"
            label="Estado"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              size="default"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Division;