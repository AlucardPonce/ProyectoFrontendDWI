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
  Select,
  Radio
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  BookOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// ✅ Base URL configurada para microservicios
const BASE_URL_PROFESORES = "http://20.119.81.0:8081/api"; // Microservicio de Profesores
const BASE_URL_PE = "http://20.119.81.0:8080/api"; // Microservicio de ProgramaEducativo

const Profesor = () => {
  const [profesores, setProfesores] = useState([]);
  const [programasEducativos, setProgramasEducativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);
  const [soloActivos, setSoloActivos] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [profesorDetalle, setProfesorDetalle] = useState(null);
  const [form] = Form.useForm();

  // Estadísticas calculadas
  const totalProfesores = profesores.length;
  const profesoresActivos = profesores.filter(p => p.activo).length;
  const profesoresInactivos = totalProfesores - profesoresActivos;
  const profesoresMasculinos = profesores.filter(p => p.genero === 'M').length;
  const profesoresFemeninos = profesores.filter(p => p.genero === 'F').length;

  const fetchProfesores = () => {
    setLoading(true);
    fetch(`${BASE_URL_PROFESORES}/profesores`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener profesores');
        return res.json();
      })
      .then((data) => {
        // Filtrar solo activos si está habilitado
        const profesoresFiltrados = soloActivos 
          ? data.filter(p => p.activo) 
          : data;
        setProfesores(profesoresFiltrados);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al cargar profesores');
        setLoading(false);
      });
  };

  const fetchProgramasEducativos = () => {
    fetch(`${BASE_URL_PE}/pe?soloActivos=true`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener programas');
        return res.json();
      })
      .then((data) => {
        setProgramasEducativos(data);
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al cargar programas educativos');
      });
  };

  useEffect(() => {
    fetchProfesores();
  }, [soloActivos]);

  useEffect(() => {
    fetchProgramasEducativos();
  }, []);

  const showAddModal = () => {
    setEditando(null);
    setCreando(true);
    form.resetFields();
    form.setFieldsValue({ activo: true, genero: 'M' });
  };

  const handleEditar = (profesor) => {
    setEditando(profesor.id);
    setCreando(true);
    form.setFieldsValue({
      nombre: profesor.nombre,
      apellidos: profesor.apellidos,
      genero: profesor.genero,
      id_pe: profesor.id_pe,
      activo: profesor.activo,
    });
  };

  const handleEliminar = (id, nombre) => {
    fetch(`${BASE_URL_PROFESORES}/profesores/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        message.success(`Profesor "${nombre}" eliminado correctamente`);
        fetchProfesores();
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al eliminar profesor');
      });
  };

  const handleVerDetalle = (profesor) => {
    setLoading(true);
    fetch(`${BASE_URL_PROFESORES}/profesores/${profesor.id}/detalle`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener detalle');
        return res.json();
      })
      .then((data) => {
        setProfesorDetalle(data);
        setDetalleVisible(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error('Error al cargar detalle del profesor');
        setLoading(false);
      });
  };

  const handleGuardar = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          nombre: values.nombre,
          apellidos: values.apellidos,
          genero: values.genero,
          id_pe: values.id_pe,
          activo: values.activo,
        };

        const url = editando 
          ? `${BASE_URL_PROFESORES}/profesores/${editando}`
          : `${BASE_URL_PROFESORES}/profesores`;
        const method = editando ? 'PUT' : 'POST';
        
        fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al guardar');
            return res.json();
          })
          .then(() => {
            message.success(`Profesor ${editando ? 'actualizado' : 'creado'} correctamente`);
            setEditando(null);
            setCreando(false);
            form.resetFields();
            fetchProfesores();
          })
          console.log(payload)
          .catch((err) => {
            console.error(err);
            message.error(`Error al ${editando ? 'actualizar' : 'crear'} profesor`);
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
      title: 'Nombre Completo',
      key: 'nombreCompleto',
      sorter: (a, b) => `${a.nombre} ${a.apellidos}`.localeCompare(`${b.nombre} ${b.apellidos}`),
      render: (_, record) => (
        <Text strong>{`${record.nombre} ${record.apellidos}`}</Text>
      ),
    },
    {
      title: 'Género',
      dataIndex: 'genero',
      key: 'genero',
      width: 100,
      filters: [
        { text: 'Masculino', value: 'M' },
        { text: 'Femenino', value: 'F' },
      ],
      onFilter: (value, record) => record.genero === value,
      render: (genero) => (
        <Tag color={genero === 'M' ? 'blue' : 'pink'}>
          {genero === 'M' ? 'Masculino' : 'Femenino'}
        </Tag>
      ),
    },
    {
      title: 'Programa Educativo',
      dataIndex: 'id_pe',
      key: 'id_pe',
      width: 150,
      render: (id_pe) => {
        const programa = programasEducativos.find(p => p.id_pe === parseInt(id_pe));
        return programa ? (
          <Tag icon={<BookOutlined />} color="green">
            {programa.clave}
          </Tag>
        ) : (
          <Tag color="default">Sin asignar</Tag>
        );
      },
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalle">
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              size="small"
              onClick={() => handleVerDetalle(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditar(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Eliminar profesor"
            description={`¿Estás seguro de eliminar a "${record.nombre} ${record.apellidos}"?`}
            onConfirm={() => handleEliminar(record.id, `${record.nombre} ${record.apellidos}`)}
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
            <UserOutlined style={{ marginRight: '8px' }} />
            Gestión de Profesores
          </Title>
          <Text type="secondary">
            Administra los profesores y sus asignaciones de programas educativos
          </Text>
        </div>

        {/* Estadísticas */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total de Profesores"
                value={totalProfesores}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Profesores Activos"
                value={profesoresActivos}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Profesores Masculinos"
                value={profesoresMasculinos}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Profesores Femeninos"
                value={profesoresFemeninos}
                valueStyle={{ color: '#eb2f96' }}
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
                Nuevo Profesor
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchProfesores}
                loading={loading}
              >
                Actualizar
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
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
              <Text>Cargando profesores...</Text>
            </div>
          </div>
        ) : profesores.length === 0 ? (
          <Alert
            message="No hay profesores"
            description={
              soloActivos 
                ? "No se encontraron profesores activos." 
                : "No se han registrado profesores aún."
            }
            type="info"
            showIcon
            style={{ textAlign: 'center' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={profesores}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} profesores`,
            }}
            scroll={{ x: 1200 }}
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
            {editando ? 'Editar Profesor' : 'Nuevo Profesor'}
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
        destroyOnHidden
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[
                  { required: true, message: 'El nombre es obligatorio' },
                  { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
                  { max: 50, message: 'El nombre no puede exceder 50 caracteres' }
                ]}
              >
                <Input
                  placeholder="Ej: Juan Carlos"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apellidos"
                label="Apellidos"
                rules={[
                  { required: true, message: 'Los apellidos son obligatorios' },
                  { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres' },
                  { max: 50, message: 'Los apellidos no pueden exceder 50 caracteres' }
                ]}
              >
                <Input
                  placeholder="Ej: García López"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="genero"
                label="Género"
                rules={[
                  { required: true, message: 'Debe seleccionar un género' }
                ]}
              >
                <Radio.Group size="large">
                  <Radio value="M">Masculino</Radio>
                  <Radio value="F">Femenino</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Form.Item
            name="id_pe"
            label="Programa Educativo"
            rules={[
              { required: true, message: 'Debe seleccionar un programa educativo' }
            ]}
          >
            <Select
              placeholder="Seleccione un programa educativo"
              size="large"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {programasEducativos.map(programa => (
                <Option key={programa.id_pe} value={programa.id_pe.toString()}>
                  <Space>
                    <BookOutlined />
                    {programa.programaEducativo} ({programa.clave})
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de detalle */}
      <Modal
        title={
          <Space>
            <InfoCircleOutlined />
            Detalle del Profesor
          </Space>
        }
        open={detalleVisible}
        onCancel={() => setDetalleVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetalleVisible(false)}>
            Cerrar
          </Button>
        ]}
        width={500}
      >
        {profesorDetalle && (
          <div>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card size="small">
                  <Title level={4}>{profesorDetalle.nombre} {profesorDetalle.apellidos}</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>ID: </Text>
                      <Text>{profesorDetalle.id}</Text>
                    </div>
                    <div>
                      <Text strong>Género: </Text>
                      <Tag color={profesorDetalle.genero === 'M' ? 'blue' : 'pink'}>
                        {profesorDetalle.genero === 'M' ? 'Masculino' : 'Femenino'}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Estado: </Text>
                      <Tag color={profesorDetalle.activo ? 'success' : 'error'}>
                        {profesorDetalle.activo ? 'Activo' : 'Inactivo'}
                      </Tag>
                    </div>
                    {profesorDetalle.programaEducativo && (
                      <div>
                        <Text strong>Programa Educativo: </Text>
                        <Card size="small" style={{ marginTop: 8 }}>
                          <Text strong>{profesorDetalle.programaEducativo.programaEducativo}</Text>
                          <br />
                          <Text type="secondary">Clave: {profesorDetalle.programaEducativo.clave}</Text>
                          <br />
                          <Text type="secondary">
                            División: {profesorDetalle.programaEducativo.division?.nombre}
                          </Text>
                        </Card>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Profesor;