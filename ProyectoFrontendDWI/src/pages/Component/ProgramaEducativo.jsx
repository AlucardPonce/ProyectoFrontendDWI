import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    message,
} from "antd";
import {
    getAllProgramasEducativos,
    createPrograma,
    updatePrograma,
    deletePrograma,
} from "../../services/programaEducativoService";

export default function ProgramaEducativoCRUD() {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const loadData = async () => {
        const result = await getAllProgramasEducativos();
        setData(result);
    };

    useEffect(() => {
        loadData();
    }, []);

    const showModal = (record = null) => {
        setEditing(record);
        setIsModalOpen(true);
        if (record) {
            form.setFieldsValue(record);
        } else {
            form.resetFields();
        }
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        try {
            if (editing) {
                await updatePrograma(editing.id_pe, values);
                message.success("Programa actualizado");
            } else {
                await createPrograma(values);
                message.success("Programa creado");
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            message.error("Error al guardar");
        }
    };

    const handleDelete = async (record) => {
        await deletePrograma(record.id_pe);
        message.success("Programa eliminado");
        loadData();
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
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
                <>
                    <Button onClick={() => showModal(record)} type="link">Editar</Button>
                    <Button onClick={() => handleDelete(record)} danger type="link">Eliminar</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
                Nuevo Programa
            </Button>
            <Table dataSource={data} rowKey="id_pe" columns={columns} />

            <Modal title={editing ? "Editar Programa" : "Nuevo Programa"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Guardar"
                cancelText="Cancelar">
                <Form form={form} layout="vertical">
                    <Form.Item name="clave" label="Clave" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="programaEducativo" label="Programa Educativo" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="activo" label="Activo" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
