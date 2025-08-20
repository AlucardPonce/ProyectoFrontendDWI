import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  message, 
  Tabs,
  Popconfirm,
  Divider,
  Typography,
  Row,
  Col,
  Radio
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Division = () => {
  // Estados principales
  const [categorias, setCategorias] = useState([]);
  const [tiposRequisito, setTiposRequisito] = useState([]);
  const [requisitos, setRequisitos] = useState([]);
  
  // Estados para modales
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);
  const [modalTipoRequisitoVisible, setModalTipoRequisitoVisible] = useState(false);
  const [modalRequisitoVisible, setModalRequisitoVisible] = useState(false);
  
  // Estados para edición
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editingTipoRequisito, setEditingTipoRequisito] = useState(null);
  const [editingRequisito, setEditingRequisito] = useState(null);
  
  // Estados adicionales para el formulario
  const [tipoCategoriaSeleccionado, setTipoCategoriaSeleccionado] = useState('ambas');
  
  // Estados para vista detalle
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  
  // Formularios
  const [formCategoria] = Form.useForm();
  const [formTipoRequisito] = Form.useForm();
  const [formRequisito] = Form.useForm();

  // Base URL de la API 
  const API_BASE_URL = 'http://20.119.81.0:8082/api';

  // Cargar datos iniciales de la API
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar categorías
      const responseCategorias = await fetch(`${API_BASE_URL}/categorias`);
      if (responseCategorias.ok) {
        const categoriasData = await responseCategorias.json();
        // Adaptar los datos de la API al formato del componente
        const categoriasAdaptadas = categoriasData.map(cat => ({
          ...cat,
          categoriaAnterior: cat.categoriaAnterior || null,
          tipoCategoria: determinarTipoCategoria(cat.categoriaFederal, cat.categoriaEstatal)
        }));
        setCategorias(categoriasAdaptadas);
      }

      // Cargar tipos de requisito
      const responseTipos = await fetch(`${API_BASE_URL}/tipos-requisito`);
      if (responseTipos.ok) {
        const tiposData = await responseTipos.json();
        // Adaptar estructura de la API
        const tiposAdaptados = tiposData.map(tipo => ({
          id: tipo.id,
          nombre: tipo.nombre,
          descripcion: tipo.descripcion,
          categoriaId: tipo.categoria?.id || null
        }));
        setTiposRequisito(tiposAdaptados);
      }

      // Cargar requisitos
      const responseRequisitos = await fetch(`${API_BASE_URL}/requisitos`);
      if (responseRequisitos.ok) {
        const requisitosData = await responseRequisitos.json();
        // Adaptar estructura de la API
        const requisitosAdaptados = requisitosData.map(req => ({
          id: req.id,
          descripcion: req.descripcion,
          tipoRequisitoId: req.tipoRequisito?.id || null
        }));
        setRequisitos(requisitosAdaptados);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      message.error('Error al cargar los datos desde el servidor');
    }
  };

  // Función auxiliar para determinar el tipo de categoría
  const determinarTipoCategoria = (federal, estatal) => {
    if (federal && estatal) return 'ambas';
    if (federal && !estatal) return 'federal';
    if (!federal && estatal) return 'estatal';
    return 'ambas'; // por defecto
  };

  // Funciones para Categorías
  const handleCreateCategoria = async (values) => {
    try {
      // Preparar datos según el tipo de categoría
      const categoriaData = {
        nombreCategoria: values.nombreCategoria,
        categoriaFederal: values.categoriaFederal || null,
        categoriaEstatal: values.categoriaEstatal || null
      };

      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaData)
      });

      if (response.ok) {
        const newCategoria = await response.json();
        // Adaptar la respuesta y agregar al estado local
        const categoriaAdaptada = {
          ...newCategoria,
          categoriaAnterior: values.categoriaAnterior || null,
          tipoCategoria: determinarTipoCategoria(newCategoria.categoriaFederal, newCategoria.categoriaEstatal)
        };
        setCategorias([...categorias, categoriaAdaptada]);
        setModalCategoriaVisible(false);
        setTipoCategoriaSeleccionado('ambas');
        formCategoria.resetFields();
        message.success('Categoría creada exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al crear categoría: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  const handleUpdateCategoria = async (values) => {
    try {
      const categoriaData = {
        nombreCategoria: values.nombreCategoria,
        categoriaFederal: values.categoriaFederal || null,
        categoriaEstatal: values.categoriaEstatal || null
      };

      const response = await fetch(`${API_BASE_URL}/categorias/${editingCategoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaData)
      });

      if (response.ok) {
        // Actualizar estado local
        const updatedCategorias = categorias.map(cat => 
          cat.id === editingCategoria.id ? {
            ...cat,
            ...values,
            tipoCategoria: determinarTipoCategoria(values.categoriaFederal, values.categoriaEstatal)
          } : cat
        );
        setCategorias(updatedCategorias);
        setModalCategoriaVisible(false);
        setEditingCategoria(null);
        setTipoCategoriaSeleccionado('ambas');
        formCategoria.resetFields();
        message.success('Categoría actualizada exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al actualizar categoría: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  const handleDeleteCategoria = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCategorias(categorias.filter(cat => cat.id !== id));
        message.success('Categoría eliminada exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al eliminar categoría: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  // Funciones para Tipos de Requisito
  const handleCreateTipoRequisito = async (values) => {
    try {
      const tipoData = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        categoria: {
          id: values.categoriaId
        }
      };

      const response = await fetch(`${API_BASE_URL}/tipos-requisito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipoData)
      });

      if (response.ok) {
        const newTipo = await response.json();
        // Adaptar la respuesta
        const tipoAdaptado = {
          id: newTipo.id,
          nombre: newTipo.nombre,
          descripcion: newTipo.descripcion,
          categoriaId: newTipo.categoria?.id || values.categoriaId
        };
        setTiposRequisito([...tiposRequisito, tipoAdaptado]);
        setModalTipoRequisitoVisible(false);
        formTipoRequisito.resetFields();
        message.success('Tipo de requisito creado exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al crear tipo de requisito: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  const handleUpdateTipoRequisito = async (values) => {
    try {
      const tipoData = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        categoria: {
          id: values.categoriaId
        }
      };

      const response = await fetch(`${API_BASE_URL}/tipos-requisito/${editingTipoRequisito.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipoData)
      });

      if (response.ok) {
        const updatedTipos = tiposRequisito.map(tipo => 
          tipo.id === editingTipoRequisito.id ? { ...tipo, ...values } : tipo
        );
        setTiposRequisito(updatedTipos);
        setModalTipoRequisitoVisible(false);
        setEditingTipoRequisito(null);
        formTipoRequisito.resetFields();
        message.success('Tipo de requisito actualizado exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al actualizar tipo de requisito: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  const handleDeleteTipoRequisito = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tipos-requisito/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTiposRequisito(tiposRequisito.filter(tipo => tipo.id !== id));
        message.success('Tipo de requisito eliminado exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al eliminar tipo de requisito: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  // Funciones para Requisitos
  const handleCreateRequisito = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requisitos/tipo/${values.tipoRequisitoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: values.descripcion
        })
      });

      if (response.ok) {
        const newRequisito = await response.json();
        // Adaptar la respuesta
        const requisitoAdaptado = {
          id: newRequisito.id,
          descripcion: newRequisito.descripcion,
          tipoRequisitoId: newRequisito.tipoRequisito?.id || values.tipoRequisitoId
        };
        setRequisitos([...requisitos, requisitoAdaptado]);
        setModalRequisitoVisible(false);
        formRequisito.resetFields();
        message.success('Requisito creado exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al crear requisito: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  const handleUpdateRequisito = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requisitos/${editingRequisito.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: values.descripcion
        })
      });

      if (response.ok) {
        const updatedRequisitos = requisitos.map(req => 
          req.id === editingRequisito.id ? { ...req, descripcion: values.descripcion } : req
        );
        setRequisitos(updatedRequisitos);
        setModalRequisitoVisible(false);
        setEditingRequisito(null);
        formRequisito.resetFields();
        message.success('Requisito actualizado exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al actualizar requisito: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  const handleDeleteRequisito = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requisitos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRequisitos(requisitos.filter(req => req.id !== id));
        message.success('Requisito eliminado exitosamente');
      } else {
        const errorData = await response.text();
        message.error(`Error al eliminar requisito: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error de conexión al servidor');
    }
  };

  // Funciones auxiliares
  const getNombreCategoria = (id) => {
    const categoria = categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombreCategoria : 'Sin categoría';
  };

  const getNombreTipoRequisito = (id) => {
    const tipo = tiposRequisito.find(tipo => tipo.id === id);
    return tipo ? tipo.nombre : 'Sin tipo';
  };

  const getTiposPorCategoria = (categoriaId) => {
    return tiposRequisito.filter(tipo => tipo.categoriaId === categoriaId);
  };

  const getRequisitosPorTipo = (tipoId) => {
    return requisitos.filter(req => req.tipoRequisitoId === tipoId);
  };

  // Configuración de columnas para tablas
  const columnsCategorias = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Nombre de Categoría',
      dataIndex: 'nombreCategoria',
      key: 'nombreCategoria',
    },
    {
      title: 'Categoría Anterior',
      dataIndex: 'categoriaAnterior',
      key: 'categoriaAnterior',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoCategoria',
      key: 'tipoCategoria',
      render: (tipo) => {
        const colors = {
          federal: '#1890ff',
          estatal: '#52c41a',
          ambas: '#722ed1'
        };
        const labels = {
          federal: 'Federal',
          estatal: 'Estatal',
          ambas: 'Ambas'
        };
        return (
          <span style={{ 
            color: colors[tipo], 
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}>
            {labels[tipo]}
          </span>
        );
      }
    },
    {
      title: 'Categoría Federal',
      dataIndex: 'categoriaFederal',
      key: 'categoriaFederal',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Categoría Estatal',
      dataIndex: 'categoriaEstatal',
      key: 'categoriaEstatal',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => setSelectedCategoria(record)}
            size="small"
            type="primary"
            ghost
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingCategoria(record);
              setTipoCategoriaSeleccionado(record.tipoCategoria || 'ambas');
              formCategoria.setFieldsValue(record);
              setModalCategoriaVisible(true);
            }}
            size="small"
          />
          <Popconfirm
            title="¿Está seguro de eliminar esta categoría?"
            onConfirm={() => handleDeleteCategoria(record.id)}
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsTiposRequisito = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Categoría',
      dataIndex: 'categoriaId',
      key: 'categoriaId',
      render: (categoriaId) => getNombreCategoria(categoriaId)
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingTipoRequisito(record);
              formTipoRequisito.setFieldsValue(record);
              setModalTipoRequisitoVisible(true);
            }}
            size="small"
          />
          <Popconfirm
            title="¿Está seguro de eliminar este tipo de requisito?"
            onConfirm={() => handleDeleteTipoRequisito(record.id)}
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsRequisitos = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Tipo de Requisito',
      dataIndex: 'tipoRequisitoId',
      key: 'tipoRequisitoId',
      render: (tipoId) => getNombreTipoRequisito(tipoId)
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingRequisito(record);
              formRequisito.setFieldsValue(record);
              setModalRequisitoVisible(true);
            }}
            size="small"
          />
          <Popconfirm
            title="¿Está seguro de eliminar este requisito?"
            onConfirm={() => handleDeleteRequisito(record.id)}
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Sistema de Gestión de Categorías y Requisitos</Title>
      
      <Tabs defaultActiveKey="1" type="card">
        {/* Tab de Categorías */}
        <TabPane tab="Categorías" key="1">
          <Card
            title="Gestión de Categorías"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCategoria(null);
                  setTipoCategoriaSeleccionado('ambas');
                  formCategoria.resetFields();
                  setModalCategoriaVisible(true);
                }}
              >
                Nueva Categoría
              </Button>
            }
          >
            <Table 
              columns={columnsCategorias}
              dataSource={categorias}
              rowKey="id"
              size="small"
            />
          </Card>
        </TabPane>

        {/* Tab de Tipos de Requisito */}
        <TabPane tab="Tipos de Requisito" key="2">
          <Card
            title="Gestión de Tipos de Requisito"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTipoRequisito(null);
                  formTipoRequisito.resetFields();
                  setModalTipoRequisitoVisible(true);
                }}
              >
                Nuevo Tipo
              </Button>
            }
          >
            <Table 
              columns={columnsTiposRequisito}
              dataSource={tiposRequisito}
              rowKey="id"
              size="small"
            />
          </Card>
        </TabPane>

        {/* Tab de Requisitos */}
        <TabPane tab="Requisitos" key="3">
          <Card
            title="Gestión de Requisitos"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRequisito(null);
                  formRequisito.resetFields();
                  setModalRequisitoVisible(true);
                }}
              >
                Nuevo Requisito
              </Button>
            }
          >
            <Table 
              columns={columnsRequisitos}
              dataSource={requisitos}
              rowKey="id"
              size="small"
            />
          </Card>
        </TabPane>

        {/* Tab de Vista Jerárquica */}
        <TabPane tab="Vista Jerárquica" key="4">
          <Card title="Estructura Jerárquica">
            {categorias.map(categoria => (
              <Card 
                key={categoria.id} 
                type="inner" 
                title={categoria.nombreCategoria}
                style={{ marginBottom: 16 }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Tipo: </Text>
                    <span style={{ 
                      color: categoria.tipoCategoria === 'federal' ? '#1890ff' : 
                             categoria.tipoCategoria === 'estatal' ? '#52c41a' : '#722ed1',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {categoria.tipoCategoria === 'ambas' ? 'Federal y Estatal' : 
                       categoria.tipoCategoria === 'federal' ? 'Solo Federal' : 'Solo Estatal'}
                    </span><br/>
                    {categoria.categoriaFederal && (
                      <><Text strong>Federal: </Text>{categoria.categoriaFederal}<br/></>
                    )}
                    {categoria.categoriaEstatal && (
                      <><Text strong>Estatal: </Text>{categoria.categoriaEstatal}<br/></>
                    )}
                    {categoria.categoriaAnterior && (
                      <><Text strong>Anterior: </Text>{categoria.categoriaAnterior}</>
                    )}
                  </Col>
                </Row>
                
                <Divider orientation="left">Tipos de Requisito</Divider>
                {getTiposPorCategoria(categoria.id).map(tipo => (
                  <Card 
                    key={tipo.id}
                    size="small"
                    style={{ marginBottom: 8 }}
                    title={tipo.nombre}
                  >
                    <Text type="secondary">{tipo.descripcion}</Text>
                    
                    <div style={{ marginTop: 8 }}>
                      <Text strong>Requisitos:</Text>
                      <ul style={{ marginTop: 4, marginBottom: 0 }}>
                        {getRequisitosPorTipo(tipo.id).map(requisito => (
                          <li key={requisito.id}>{requisito.descripcion}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </Card>
            ))}
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal para Categorías */}
      <Modal
        title={editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
        open={modalCategoriaVisible}
        onCancel={() => {
          setModalCategoriaVisible(false);
          setEditingCategoria(null);
          formCategoria.resetFields();
        }}
        footer={null}
      >
        <Form
          form={formCategoria}
          layout="vertical"
          onFinish={editingCategoria ? handleUpdateCategoria : handleCreateCategoria}
        >
          <Form.Item
            name="nombreCategoria"
            label="Nombre de Categoría"
            rules={[{ required: true, message: 'Ingrese el nombre de la categoría' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="categoriaAnterior"
            label="Categoría Anterior"
          >
            <Select allowClear placeholder="Seleccione una categoría anterior">
              {categorias.map(cat => (
                <Option key={cat.id} value={cat.nombreCategoria}>
                  {cat.nombreCategoria}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tipoCategoria"
            label="Tipo de Categoría"
            rules={[{ required: true, message: 'Seleccione el tipo de categoría' }]}
            initialValue="ambas"
          >
            <Radio.Group 
              onChange={(e) => setTipoCategoriaSeleccionado(e.target.value)}
              value={tipoCategoriaSeleccionado}
            >
              <Radio.Button value="federal">Solo Federal</Radio.Button>
              <Radio.Button value="estatal">Solo Estatal</Radio.Button>
              <Radio.Button value="ambas">Ambas</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {(tipoCategoriaSeleccionado === 'federal' || tipoCategoriaSeleccionado === 'ambas') && (
            <Form.Item
              name="categoriaFederal"
              label="Categoría Federal"
              rules={[{ required: true, message: 'Ingrese la categoría federal' }]}
            >
              <Input placeholder="Ej: PTC, PMT, PA" />
            </Form.Item>
          )}

          {(tipoCategoriaSeleccionado === 'estatal' || tipoCategoriaSeleccionado === 'ambas') && (
            <Form.Item
              name="categoriaEstatal"
              label="Categoría Estatal"
              rules={[{ required: true, message: 'Ingrese la categoría estatal' }]}
            >
              <Input placeholder="Ej: E-PTC, E-PMT, E-PA" />
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategoria ? 'Actualizar' : 'Crear'}
              </Button>
              <Button onClick={() => {
                setModalCategoriaVisible(false);
                setEditingCategoria(null);
                setTipoCategoriaSeleccionado('ambas');
                formCategoria.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para Tipos de Requisito */}
      <Modal
        title={editingTipoRequisito ? "Editar Tipo de Requisito" : "Nuevo Tipo de Requisito"}
        open={modalTipoRequisitoVisible}
        onCancel={() => {
          setModalTipoRequisitoVisible(false);
          setEditingTipoRequisito(null);
          formTipoRequisito.resetFields();
        }}
        footer={null}
      >
        <Form
          form={formTipoRequisito}
          layout="vertical"
          onFinish={editingTipoRequisito ? handleUpdateTipoRequisito : handleCreateTipoRequisito}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre del tipo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: 'Ingrese la descripción' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="categoriaId"
            label="Categoría"
            rules={[{ required: true, message: 'Seleccione una categoría' }]}
          >
            <Select placeholder="Seleccione una categoría">
              {categorias.map(cat => (
                <Option key={cat.id} value={cat.id}>
                  {cat.nombreCategoria}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTipoRequisito ? 'Actualizar' : 'Crear'}
              </Button>
              <Button onClick={() => {
                setModalTipoRequisitoVisible(false);
                setEditingTipoRequisito(null);
                formTipoRequisito.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para Requisitos */}
      <Modal
        title={editingRequisito ? "Editar Requisito" : "Nuevo Requisito"}
        open={modalRequisitoVisible}
        onCancel={() => {
          setModalRequisitoVisible(false);
          setEditingRequisito(null);
          formRequisito.resetFields();
        }}
        footer={null}
      >
        <Form
          form={formRequisito}
          layout="vertical"
          onFinish={editingRequisito ? handleUpdateRequisito : handleCreateRequisito}
        >
          <Form.Item
            name="descripcion"
            label="Descripción del Requisito"
            rules={[{ required: true, message: 'Ingrese la descripción del requisito' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="tipoRequisitoId"
            label="Tipo de Requisito"
            rules={[{ required: true, message: 'Seleccione un tipo de requisito' }]}
          >
            <Select placeholder="Seleccione un tipo de requisito">
              {tiposRequisito.map(tipo => (
                <Option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRequisito ? 'Actualizar' : 'Crear'}
              </Button>
              <Button onClick={() => {
                setModalRequisitoVisible(false);
                setEditingRequisito(null);
                formRequisito.resetFields();
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Division;