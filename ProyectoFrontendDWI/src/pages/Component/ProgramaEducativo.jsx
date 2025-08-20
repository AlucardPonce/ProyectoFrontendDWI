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
  Tooltip,
  Select
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  BankOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// ✅ Base URL configurada
const BASE_URL = "http://20.119.81.0:8080/api";

const ProgramaEducativo = () => {
  const [programas, setProgramas] = useState([]);
  const [divisiones, setDivisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);
  const [soloActivos, setSoloActivos] = useState(false);
  const [divisionFiltro, setDivisionFiltro] = useState(null);
  const [form] = Form.useForm();

  // Estadísticas calculadas
  const totalProgramas = programas.length;
  const programasActivos = programas.filter(p => p.activo).length;
  const programasInactivos = totalProgramas - programasActivos;

  const fetchProgramas = () => {
    setLoading(true);
    let url = `${BASE_URL}/pe?soloActivos=${soloActivos}`;
    
    if (divisionFiltro) {
      url = `${BASE_URL}/pe/division/${divisionFiltro}?soloActivos=${soloActivos}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener programas');
        return res.json();
      })
      .then((data) => {
        setProgramas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al cargar programas educativos');
        setLoading(false);
      });
  };

  const fetchDivisiones = () => {
    fetch(`${BASE_URL}/division?soloActivos=true`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener divisiones');
        return res.json();
      })
      .then((data) => {
        setDivisiones(data);
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al cargar divisiones');
      });
  };

  useEffect(() => {
    fetchProgramas();
  }, [soloActivos, divisionFiltro]);

  useEffect(() => {
    fetchDivisiones();
  }, []);

  const showAddModal = () => {
    setEditando(null);
    setCreando(true);
    form.resetFields();
    form.setFieldsValue({ activo: true });
  };

  const handleEditar = (programa) => {
    setEditando(programa.id_pe);
    setCreando(true);
    form.setFieldsValue({
      programaEducativo: programa.programaEducativo,
      clave: programa.clave,
      activo: programa.activo,
      divisionId: programa.division?.id,
    });
  };

  const handleEliminar = (id, nombre) => {
    fetch(`${BASE_URL}/pe/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        message.success(`Programa "${nombre}" eliminado correctamente`);
        fetchProgramas();
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al eliminar programa educativo');
      });
  };

  const handleGuardar = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          programaEducativo: values.programaEducativo,
          clave: values.clave,
          activo: values.activo,
          division: {
            id: values.divisionId
          }
        };

        const url = editando 
          ? `${BASE_URL}/pe/${editando}`
          : `${BASE_URL}/pe`;
        const method = editando ? 'PUT' : 'POST';
        
        fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al guardar');
            message.success(`Programa ${editando ? 'actualizado' : 'creado'} correctamente`);
            setEditando(null);
            setCreando(false);
            form.resetFields();
            fetchProgramas();
          })
          .catch((err) => {
            console.error(err);
            message.error(`Error al ${editando ? 'actualizar' : 'crear'} programa educativo`);
          });
      })
      .catch(() => {});
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_pe',
      key: 'id_pe',
      width: 70,
      sorter: (a, b) => a.id_pe - b.id_pe,
    },
    {
      title: 'Programa Educativo',
      dataIndex: 'programaEducativo',
      key: 'programaEducativo',
      sorter: (a, b) => a.programaEducativo.localeCompare(b.programaEducativo),
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
      title: 'División',
      dataIndex: ['division', 'nombre'],
      key: 'division',
      width: 200,
      render: (text, record) => (
        <Tag icon={<BankOutlined />} color="green">
          {text || 'Sin división'}
        </Tag>
      ),
      filters: divisiones.map(d => ({ text: d.nombre, value: d.id })),
      onFilter: (value, record) => record.division?.id === value,
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
            title="Eliminar programa educativo"
            description={`¿Estás seguro de eliminar "${record.programaEducativo}"?`}
            onConfirm={() => handleEliminar(record.id_pe, record.programaEducativo)}
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
            <BookOutlined style={{ marginRight: '8px' }} />
            Gestión de Programas Educativos
          </Title>
          <Text type="secondary">
            Administra los programas educativos de cada división
          </Text>
        </div>

        {/* Estadísticas */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total de Programas"
                value={totalProgramas}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Programas Activos"
                value={programasActivos}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Programas Inactivos"
                value={programasInactivos}
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
                Nuevo Programa
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchProgramas}
                loading={loading}
              >
                Actualizar
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text>División:</Text>
              <Select
                placeholder="Todas las divisiones"
                allowClear
                style={{ width: 200 }}
                value={divisionFiltro}
                onChange={setDivisionFiltro}
              >
                {divisiones.map(division => (
                  <Option key={division.id} value={division.id}>
                    {division.nombre}
                  </Option>
                ))}
              </Select>
              <Text>Solo activos:</Text>
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
              <Text>Cargando programas educativos...</Text>
            </div>
          </div>
        ) : programas.length === 0 ? (
          <Alert
            message="No hay programas educativos"
            description={
              divisionFiltro 
                ? "No se encontraron programas para la división seleccionada."
                : soloActivos 
                  ? "No se encontraron programas activos." 
                  : "No se han creado programas educativos aún."
            }
            type="info"
            showIcon
            style={{ textAlign: 'center' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={programas}
            rowKey="id_pe"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} programas`,
            }}
            scroll={{ x: 1000 }}
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
            {editando ? 'Editar Programa Educativo' : 'Nuevo Programa Educativo'}
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
        width={600}
        destroyOnClose
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="programaEducativo"
            label="Nombre del Programa Educativo"
            rules={[
              { required: true, message: 'El nombre del programa es obligatorio' },
              { min: 5, message: 'El nombre debe tener al menos 5 caracteres' },
              { max: 100, message: 'El nombre no puede exceder 100 caracteres' }
            ]}
          >
            <Input
              placeholder="Ej: Ingeniería en Sistemas Computacionales"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="clave"
            label="Clave del Programa"
            rules={[
              { required: true, message: 'La clave es obligatoria' },
              { min: 3, message: 'La clave debe tener al menos 3 caracteres' },
              { max: 10, message: 'La clave no puede exceder 10 caracteres' }
            ]}
          >
            <Input
              placeholder="Ej: ISC001"
              size="large"
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => {
                form.setFieldsValue({ clave: e.target.value.toUpperCase() });
              }}
            />
          </Form.Item>

          <Form.Item
            name="divisionId"
            label="División"
            rules={[
              { required: true, message: 'Debe seleccionar una división' }
            ]}
          >
            <Select
              placeholder="Seleccione una división"
              size="large"
              allowClear
            >
              {divisiones.map(division => (
                <Option key={division.id} value={division.id}>
                  <Space>
                    <BankOutlined />
                    {division.nombre} ({division.clave})
                  </Space>
                </Option>
              ))}
            </Select>
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

export default ProgramaEducativo;