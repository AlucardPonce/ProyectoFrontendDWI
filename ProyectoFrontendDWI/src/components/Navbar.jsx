import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, message } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    AppstoreOutlined,
    SettingOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            message.success('Sesión cerrada exitosamente');
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            message.error('Error al cerrar sesión');
            navigate('/login'); // Redirigir de todos modos
        }
    };

    const menuItems = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Inicio',
            onClick: () => navigate('/home')
        },
        {
            key: '/home/division',
            icon: <TeamOutlined />,
            label: 'División',
            onClick: () => navigate('/home/division')
        },
        {
            key: '/home/programas-educativos',
            icon: <AppstoreOutlined />,
            label: 'Programas Educativos',
            onClick: () => navigate('/home/programas-educativos')
        },
        {
            key: '/home/categorias',
            icon: <SettingOutlined />,
            label: 'Categorías',
            onClick: () => navigate('/home/categorias')
        },
        {
            key: '/home/tipos-requisitos',
            icon: <SettingOutlined />,
            label: 'Tipos de Requisitos',
            onClick: () => navigate('/home/tipos-requisitos')
        }
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: (
                <div>
                    <div>{user?.nombre} {user?.apellido}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>@{user?.username}</div>
                </div>
            )
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Cerrar Sesión',
            onClick: handleLogout
        }
    ];

    return (
        <Header style={{
            position: 'fixed',
            zIndex: 1000,
            width: '100%',
            height: '60px',
            padding: '0 20px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* Logo/Título */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '18px', marginRight: '20px', color: '#1890ff' }}>
                    Sistema de Gestión
                </Text>
            </div>

            {/* Menú de navegación */}
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{
                    flex: 1,
                    border: 'none',
                    justifyContent: 'center'
                }}
            />

            {/* Usuario y logout */}
            <Space>
                <Text style={{ fontWeight: 500 }}>
                    {user?.nombre} {user?.apellido}
                </Text>
                <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Button
                        type="text"
                        icon={
                            <Avatar
                                size="small"
                                style={{ backgroundColor: '#1890ff' }}
                                icon={<UserOutlined />}
                            />
                        }
                        style={{ display: 'flex', alignItems: 'center' }}
                    />
                </Dropdown>
            </Space>
        </Header>
    );
};

export default Navbar;