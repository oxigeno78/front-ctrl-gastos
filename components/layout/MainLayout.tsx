'use client';

import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { authAPI } from '@/utils/api';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: '/dashboard/categories',
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/categories">Categorías</Link>,
    },
    {
      key: '/dashboard/transactions',
      icon: <HistoryOutlined />,
      label: <Link href="/dashboard/transactions">Historial</Link>,
    },
    {
      key: '/dashboard/reports',
      icon: <BarChartOutlined />,
      label: <Link href="/dashboard/reports">Reportes</Link>,
    },
  ];

  const handleLogout = async () => {
    user && await authAPI.logout({email: user.email});
    logout();
    router.push('/auth/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
        }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
            Control Gastos
          </Text>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ 
            border: 'none',
            background: 'transparent'
          }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: 250,
          minHeight: '100vh',
        }}
      >
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'fixed',
            top: 0,
            left: 250,
            right: 0,
            zIndex: 10,
          }}
        >
          <div>
            <Text strong style={{ fontSize: '20px' }}></Text>
          </div>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{user?.name}</Text>
            </Button>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: '24px',
            marginTop: 88,
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
