'use client';

import React from 'react';
import { Card, Descriptions, Typography, Space, Alert } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      <MainLayout>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={2} style={{ margin: 0 }}>
            Perfil de Usuario
          </Title>

          {!user && (
            <Alert
              type="warning"
              message="No se encontraron datos de usuario"
              description="Vuelve a iniciar sesión para ver la información de tu perfil."
              showIcon
            />
          )}

          {user && (
            <Card>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Nombre">
                  <Text strong>{user.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Correo electrónico">
                  <Text>{user.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="ID de usuario">
                  <Text type="secondary">{user.id}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Space>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
