import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    Select,
    message,
    Space,
    Tag,
} from "antd";
import {
    getAllProfesores,
    createProfesor,
    updateProfesor,
    deleteProfesor,
    getProgramasEducativos,
    updateProfesorPrograma
} from "../../services/profesorService";

export default function ProfesorCRUD() {
    const [data, setData] = useState([]);
    const [programasEducativos, setProgramasEducativos] = useState([]);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getAllProfesores();
            setData(result);
        } catch (error) {
            message.error("Error al cargar profesores");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadProgramasEducativos = async () => {
        try {
            const programas = await getProgramasEducativos();
            setProgramasEducativos(programas);
        } catch (error) {
            message.error("Error al cargar programas educativos");
        }
    };

    useEffect(() => {
        loadData();
        loadProgramasEducativos();
    }, []);

    const showModal = (record = null) => {
        setEditing(record);
        setIsModalOpen(true);

        if (record) {
            form.setFieldsValue({
                nombre: record.nombre,
                apellidos: record.apellidos,
                genero: record.genero,
                id_pe: record.id_pe,
                activo: record.activo,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ activo: true });
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (editing) {
                await updateProfesor(editing.id, values);
                message.success("Profesor actualizado");
            } else {
                await createProfesor(values);
                message.success("Profesor creado");
            }

            setIsModalOpen(false);
            form.resetFields();
            loadData();
        } catch (err) {
            if (err.errorFields) {
                message.error("Por favor, complete todos los campos requeridos");
            } else {
                message.error("Error al guardar profesor");
                console.error(err);
            }
        }
    };

    const handleDelete = async (record) => {
        Modal.confirm({
            title: 'Confirmar eliminación',
            content: `¿Estás seguro de eliminar al profesor ${record.nombre} ${record.apellidos}?`,
            onOk: async () => {
                try {
                    await deleteProfesor(record.id);
                    message.success("Profesor eliminado");
                    loadData();
                } catch (error) {
                    message.error("Error al eliminar profesor");
                    console.error(error);
                }
            },
        });
    };

    const handleAsignarPrograma = async (profesorId, programaClave) => {
        try {
            await updateProfesorPrograma(profesorId, programaClave);
            message.success("Programa asignado correctamente");
            loadData();
        } catch (error) {
            message.error("Error al asignar programa");
            console.error(error);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70,
        },
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
            sorter: (a, b) => a.nombre.localeCompare(b.nombre),
        },
        {
            title: "Apellidos",
            dataIndex: "apellidos",
            key: "apellidos",
            sorter: (a, b) => a.apellidos.localeCompare(b.apellidos),
        },
        {
            title: "Género",
            dataIndex: "genero",
            key: "genero",
            width: 100,
        },
        {
            title: "Programa Educativo",
            dataIndex: "id_pe",
            key: "id_pe",
            render: (id_pe, record) => (
                <div>
                    {id_pe ? (
                        <Tag color="blue">{id_pe}</Tag>
                    ) : (
                        <Select
                            placeholder="Asignar programa"
                            style={{ width: 200 }}
                            onChange={(value) => handleAsignarPrograma(record.id, value)}
                            allowClear
                        >
                            {programasEducativos.map((programa) => (
                                <Select.Option key={programa.clave} value={programa.clave}>
                                    {programa.clave} - {programa.programaEducativo}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </div>
            ),
        },
        {
            title: "Estado",
            dataIndex: "activo",
            key: "activo",
            render: (activo) => (
                <Tag color={activo ? "green" : "red"}>
                    {activo ? "Activo" : "Inactivo"}
                </Tag>
            ),
            filters: [
                { text: 'Activo', value: true },
                { text: 'Inactivo', value: false },
            ],
            onFilter: (value, record) => record.activo === value,
        },
        {
            title: "Acciones",
            key: "acciones",
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        onClick={() => showModal(record)}
                        type="link"
                        size="small"
                    >
                        Editar
                    </Button>
                    <Button
                        onClick={() => handleDelete(record)}
                        danger
                        type="link"
                        size="small"
                    >
                        Eliminar
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Gestión de Profesores</h3>
                <Button
                    type="primary"
                    onClick={() => showModal()}
                >
                    Nuevo Profesor
                </Button>
            </div>

            <Table
                dataSource={data}
                rowKey="id"
                columns={columns}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} de ${total} profesores`,
                }}
                scroll={{ x: 1000 }}
            />

            <Modal
                title={editing ? "Editar Profesor" : "Nuevo Profesor"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                okText="Guardar"
                cancelText="Cancelar"
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="nombre"
                        label="Nombre"
                        rules={[
                            { required: true, message: 'El nombre es requerido' },
                            { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                        ]}
                    >
                        <Input placeholder="Ingrese el nombre" />
                    </Form.Item>

                    <Form.Item
                        name="apellidos"
                        label="Apellidos"
                        rules={[
                            { required: true, message: 'Los apellidos son requeridos' },
                            { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres' }
                        ]}
                    >
                        <Input placeholder="Ingrese los apellidos" />
                    </Form.Item>

                    <Form.Item
                        name="genero"
                        label="Género"
                        rules={[{ required: true, message: 'Seleccione un género' }]}
                    >
                        <Select placeholder="Seleccione un género">
                            <Select.Option value="Masculino">Masculino</Select.Option>
                            <Select.Option value="Femenino">Femenino</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="id_pe"
                        label="Programa Educativo (Opcional)"
                    >
                        <Select
                            placeholder="Seleccione un programa educativo"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {programasEducativos.map((programa) => (
                                <Select.Option key={programa.clave} value={programa.clave}>
                                    {programa.clave} - {programa.programaEducativo}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="activo"
                        label="Estado"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch
                            checkedChildren="Activo"
                            unCheckedChildren="Inactivo"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}