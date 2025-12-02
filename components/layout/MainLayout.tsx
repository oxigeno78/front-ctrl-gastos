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
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store';
import { authAPI } from '@/utils/api';
import { Link, useRouter, usePathname } from '@/i18n/routing';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">{t('navigation.dashboard')}</Link>,
    },
    {
      key: '/dashboard/categories',
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/categories">{t('navigation.categories')}</Link>,
    },
    {
      key: '/dashboard/transactions',
      icon: <HistoryOutlined />,
      label: <Link href="/dashboard/transactions">{t('navigation.history')}</Link>,
    },
    {
      key: '/dashboard/reports',
      icon: <BarChartOutlined />,
      label: <Link href="/dashboard/reports">{t('navigation.reports')}</Link>,
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
      label: t('auth.profile'),
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
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
            {t('common.appName')}
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
