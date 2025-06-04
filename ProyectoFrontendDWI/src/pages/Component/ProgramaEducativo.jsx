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
} from "antd";
import {
    getAllProgramasEducativos,
    createPrograma,
    updatePrograma,
    deletePrograma,
    getDivisiones
} from "../../services/programaEducativoService";

export default function ProgramaEducativoCRUD() {
    const [data, setData] = useState([]);
    const [divisiones, setDivisiones] = useState([]);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const loadData = async () => {
        const result = await getAllProgramasEducativos();
        setData(result);
    };

    const loadDivisiones = async () => {
        try {
            const divs = await getDivisiones();
            setDivisiones(divs);
        } catch (error) {
            message.error("Error al cargar divisiones");
        }
    };

    useEffect(() => {
        loadData();
        loadDivisiones();
    }, []);

    const showModal = (record = null) => {
        setEditing(record);
        setIsModalOpen(true);

        if (record) {
            // Precarga la división usando el id de division
            form.setFieldsValue({
                ...record,
                divisionId: record.division?.id || null,
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
            const payload = {
                clave: values.clave,
                programaEducativo: values.programaEducativo,
                activo: values.activo,
                division: {
                    id: values.divisionId,
                },
            };

            if (editing) {
                await updatePrograma(editing.id_pe, payload);
                message.success("Programa actualizado");
            } else {
                await createPrograma(payload);
                message.success("Programa creado");
            }

            setIsModalOpen(false);
            loadData();
        } catch (err) {
            message.error("Error al guardar");
        }
    };

    const handleDelete = async (record) => {
        try {
            await deletePrograma(record.id_pe);
            message.success("Programa eliminado");
            loadData();
        } catch {
            message.error("Error al eliminar");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id_pe", key: "id_pe" },
        { title: "Clave", dataIndex: "clave", key: "clave" },
        { title: "Programa Educativo", dataIndex: "programaEducativo", key: "programaEducativo" },
        {
            title: "Activo",
            dataIndex: "activo",
            key: "activo",
            render: (activo) => (activo ? "Sí" : "No"),
        },
        {
            title: "División",
            dataIndex: ["division", "nombre"],
            key: "division",
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <>
                    <Button onClick={() => showModal(record)} type="link">
                        Editar
                    </Button>
                    <Button onClick={() => handleDelete(record)} danger type="link">
                        Eliminar
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Nuevo Programa
            </Button>
            <Table dataSource={data} rowKey="id_pe" columns={columns} />

            <Modal
                title={editing ? "Editar Programa" : "Nuevo Programa"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="clave"
                        label="Clave"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="programaEducativo"
                        label="Programa Educativo"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="activo"
                        label="Activo"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="divisionId"
                        label="División"
                        rules={[
                            { required: true, message: "Selecciona una división" },
                        ]}
                    >
                        <Select placeholder="Selecciona una división" allowClear>
                            {divisiones.map((d) => (
                                <Select.Option key={d.id} value={d.id}>
                                    {d.nombre}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
