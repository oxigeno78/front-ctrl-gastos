'use client';

import React, { useState } from 'react';
import { Card, Descriptions, Typography, Space, Alert, Button, Modal, Input, message, Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslations, useLocale } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store';
import { useRouter } from '@/i18n/routing';
import { authAPI, handleApiError } from '@/utils/api';
import { locales, type Locale } from '@/i18n/config';

const { Title, Text } = Typography;

const languageLabels: Record<Locale, string> = {
  esp: 'Español',
  eng: 'English',
};

const ProfilePage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const CONFIRM_TEXT = t('profile.deleteAccountConfirmText');
  const { user, logout, token, setUserLanguage } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

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
      message.success(t('profile.accountDeleted'));
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
      message.error(t('profile.sessionError'));
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      message.warning(t('profile.fillAllFields'));
      return;
    }

    if (newPassword.length < 8) {
      message.warning(t('profile.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      message.warning(t('profile.passwordMismatch'));
      return;
    }

    setIsChangingPassword(true);
    try {
      await authAPI.changePassword({ token, email: user.email, password: newPassword });
      message.success(t('profile.passwordUpdated'));
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

  const handleChangeLanguage = async (newLanguage: string) => {
    setIsChangingLanguage(true);
    try {
      await authAPI.updateLanguage(newLanguage);
      setUserLanguage(newLanguage);
      message.success(t('profile.languageUpdated'));
      // Cambiar el idioma de la aplicación
      router.replace('/dashboard/profile', { locale: newLanguage as Locale });
    } catch (error: any) {
      const apiError = handleApiError(error);
      message.error(apiError.message || t('profile.languageUpdateError'));
    } finally {
      setIsChangingLanguage(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={2} style={{ margin: 0 }}>
            {t('profile.title')}
          </Title>

          {!user && (
            <Alert
              type="warning"
              message={t('profile.noUserData')}
              description={t('profile.noUserDataDescription')}
              showIcon
            />
          )}

          {user && (
            <>
              <Card>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label={t('profile.name')}>
                    <Text strong>{user.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('profile.email')}>
                    <Text>{user.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('profile.userId')}>
                    <Text type="secondary">{user.id}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title={t('profile.languagePreference')}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Text>{t('profile.language')}</Text>
                  <Select
                    value={user.language || locale}
                    onChange={handleChangeLanguage}
                    style={{ width: 200 }}
                    suffixIcon={<GlobalOutlined />}
                    loading={isChangingLanguage}
                    disabled={isChangingLanguage}
                    options={locales.map((loc) => ({
                      value: loc,
                      label: languageLabels[loc],
                    }))}
                  />
                </Space>
              </Card>

              <Card title={t('profile.changePassword')}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Input.Password
                    placeholder={t('profile.currentPassword')}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Input.Password
                    placeholder={t('profile.newPassword')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Input.Password
                    placeholder={t('profile.confirmNewPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <Button
                    type="primary"
                    onClick={handleChangePassword}
                    loading={isChangingPassword}
                  >
                    {t('profile.updatePassword')}
                  </Button>
                </Space>
              </Card>

              <Card style={{ borderColor: '#ff4d4f' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Title level={4} style={{ margin: 0, color: '#cf1322' }}>
                    {t('profile.dangerZone')}
                  </Title>
                  <Text>
                    {t('profile.dangerZoneDescription')}
                  </Text>
                  <Button danger type="primary" onClick={openModal}>
                    {t('profile.deleteAccount')}
                  </Button>
                </Space>
              </Card>

              <Modal
                title={t('profile.deleteAccountConfirmTitle')}
                open={isModalOpen}
                onOk={handleDeleteAccount}
                onCancel={closeModal}
                okText={t('profile.deleteAccountConfirmButton')}
                cancelText={t('common.cancel')}
                okButtonProps={{
                  danger: true,
                  disabled: confirmValue !== CONFIRM_TEXT,
                  loading: isDeleting,
                }}
                cancelButtonProps={{ disabled: isDeleting }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>
                    {t('profile.deleteAccountConfirmDescription')}
                  </Text>
                  <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ff4d4f' }}>
                    <Text strong>{CONFIRM_TEXT}</Text>
                  </Card>
                  <Input
                    placeholder={t('profile.deleteAccountConfirmPlaceholder')}
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

