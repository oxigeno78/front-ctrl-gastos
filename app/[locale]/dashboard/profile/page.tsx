'use client';

import React, { useState } from 'react';
import { Card, Descriptions, Typography, Space, Alert, Button, Modal, Input, message } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { authAPI, handleApiError } from '@/utils/api';

const { Title, Text } = Typography;

const CONFIRM_TEXT = 'ELIMINAR MI CUENTA';

const ProfilePage: React.FC = () => {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const openModal = () => {
    setConfirmValue('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isDeleting) return;
    setIsModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmValue !== CONFIRM_TEXT) return;
    setIsDeleting(true);
    try {
      await authAPI.deleteAccount();
      message.success('Tu cuenta ha sido eliminada correctamente.');
      logout();
      router.push('/auth/login');
    } catch (error: any) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !token) {
      message.error('No se pudo obtener la sesión actual. Vuelve a iniciar sesión.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      message.warning('Por favor completa todos los campos.');
      return;
    }

    if (newPassword.length < 8) {
      message.warning('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.warning('La confirmación de la contraseña no coincide.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authAPI.changePassword({ token, email: user.email, password: newPassword });
      message.success('Tu contraseña se actualizó correctamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

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
            <>
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

              <Card title="Cambiar contraseña">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Input.Password
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Input.Password
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Input.Password
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="primary"
                    onClick={handleChangePassword}
                    loading={isChangingPassword}
                  >
                    Actualizar contraseña
                  </Button>
                </Space>
              </Card>

              <Card style={{ borderColor: '#ff4d4f' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Title level={4} style={{ margin: 0, color: '#cf1322' }}>
                    Zona de peligro
                  </Title>
                  <Text>
                    Si eliminas tu cuenta, se borrarán de forma permanente todos tus datos y movimientos
                    asociados. Esta acción es irreversible y tu sesión se cerrará automáticamente.
                  </Text>
                  <Button danger type="primary" onClick={openModal}>
                    Eliminar cuenta permanentemente
                  </Button>
                </Space>
              </Card>

              <Modal
                title="Confirmar eliminación de cuenta"
                open={isModalOpen}
                onOk={handleDeleteAccount}
                onCancel={closeModal}
                okText="Sí, eliminar mi cuenta"
                cancelText="Cancelar"
                okButtonProps={{
                  danger: true,
                  disabled: confirmValue !== CONFIRM_TEXT,
                  loading: isDeleting,
                }}
                cancelButtonProps={{ disabled: isDeleting }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>
                    Esta operación es <Text strong>irreversible</Text> y cerrará tu sesión inmediatamente.
                    Para confirmar que entiendes y estás de acuerdo, escribe exactamente el siguiente texto:
                  </Text>
                  <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ff4d4f' }}>
                    <Text strong>{CONFIRM_TEXT}</Text>
                  </Card>
                  <Input
                    placeholder="Escribe aquí la frase de confirmación"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    disabled={isDeleting}
                  />
                </Space>
              </Modal>
            </>
          )}
        </Space>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;

