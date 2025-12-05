'use client';

import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Typography, Space, Alert, Button, Modal, Input, message, Select, Tag, Spin, Row, Col } from 'antd';
import { GlobalOutlined, CreditCardOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslations, useLocale } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store';
import { useRouter } from '@/i18n/routing';
import { authAPI, stripeAPI, handleApiError } from '@/utils/api';
import { StripeSubscriptionStatusResponse } from '@/types';
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<StripeSubscriptionStatusResponse['data'] | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState(false);
  const [isActivatingSubscription, setIsActivatingSubscription] = useState(false);

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (!user?.id) return;

      setIsLoadingSubscription(true);
      setSubscriptionError(false);
      try {
        const response = await stripeAPI.getSubscriptionStatus(user.id);
        if (response.success) {
          setSubscriptionStatus(response.data);
        }
      } catch (error) {
        console.error('Error loading subscription status:', error);
        setSubscriptionError(true);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    loadSubscriptionStatus();
  }, [user?.id]);

  const handleActivateSubscription = async () => {
    if (!user?.id) return;

    setIsActivatingSubscription(true);
    try {
      const response = await stripeAPI.createCheckoutSession(user.id);
      if (response.success && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setIsActivatingSubscription(false);
    }
  };

  const getStatusTag = (status: string | null | undefined) => {
    const validStatuses = ['active', 'trialing', 'past_due', 'canceled', 'inactive'];
    const safeStatus = status && validStatuses.includes(status) ? status : 'inactive';

    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'success', icon: <CheckCircleOutlined /> },
      trialing: { color: 'processing', icon: <ClockCircleOutlined /> },
      past_due: { color: 'warning', icon: <ExclamationCircleOutlined /> },
      canceled: { color: 'error', icon: <CloseCircleOutlined /> },
      inactive: { color: 'default', icon: <CloseCircleOutlined /> },
    };
    const config = statusConfig[safeStatus];
    return (
      <Tag color={config.color} icon={config.icon}>
        {t(`profile.subscription.${safeStatus}`)}
      </Tag>
    );
  };

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      trialing: t('profile.subscription.trialDescription'),
      inactive: t('profile.subscription.inactiveDescription'),
      past_due: t('profile.subscription.pastDueDescription'),
      canceled: t('profile.subscription.canceledDescription'),
    };
    return descriptions[status] || null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(locale === 'esp' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
      if (!user) {
        message.error(t('profile.sessionError'));
        setIsChangingLanguage(false);
        return;
      }
      const email = user.email;
      if (!email) {
        message.error(t('profile.emailRequired'));
        setIsChangingLanguage(false);
        return;
      }
      console.log('Changing language to:', newLanguage, 'for email:', email);
      await authAPI.updateLanguage(newLanguage, email);
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
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
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
                </Col>
                <Col xs={24} lg={12}>
                  <Card title={
                    <Space>
                      <CreditCardOutlined />
                      {t('profile.subscription.title')}
                    </Space>
                  }
                    style={{ height: '100%' }} >
                    {isLoadingSubscription ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin />
                        <Text style={{ display: 'block', marginTop: '10px' }}>
                          {t('profile.subscription.loading')}
                        </Text>
                      </div>
                    ) : subscriptionError ? (
                      <Alert
                        type="error"
                        message={t('profile.subscription.error')}
                        showIcon
                      />
                    ) : subscriptionStatus ? (
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Descriptions column={1} bordered size="small">
                          <Descriptions.Item label={t('profile.subscription.status')}>
                            {getStatusTag(subscriptionStatus.status)}
                          </Descriptions.Item>
                          <Descriptions.Item label={t('profile.subscription.plan')}>
                            <Text>{t('profile.subscription.monthlyPlan')}</Text>
                          </Descriptions.Item>
                          {subscriptionStatus.status === 'active' && subscriptionStatus.currentPeriodEnd && (
                            <Descriptions.Item label={t('profile.subscription.nextBilling')}>
                              <Text>{formatDate(subscriptionStatus.currentPeriodEnd)}</Text>
                            </Descriptions.Item>
                          )}
                          {subscriptionStatus.status === 'trialing' && subscriptionStatus.currentPeriodEnd && (
                            <Descriptions.Item label={t('profile.subscription.trialEnds')}>
                              <Text type="warning">{formatDate(subscriptionStatus.currentPeriodEnd)}</Text>
                            </Descriptions.Item>
                          )}
                        </Descriptions>

                        {getStatusDescription(subscriptionStatus.status) && (
                          <Alert
                            type={subscriptionStatus.status === 'trialing' ? 'info' : 'warning'}
                            message={getStatusDescription(subscriptionStatus.status)}
                            showIcon
                          />
                        )}

                        {subscriptionStatus.status !== 'active' && (
                          <Button
                            type="primary"
                            icon={<CreditCardOutlined />}
                            onClick={handleActivateSubscription}
                            loading={isActivatingSubscription}
                            size="large"
                          >
                            {t('profile.subscription.activateSubscription')}
                          </Button>
                        )}
                      </Space>
                    ) : (
                      <Alert
                        type="info"
                        message={t('profile.subscription.inactiveDescription')}
                        showIcon
                        action={
                          <Button
                            type="primary"
                            size="small"
                            onClick={handleActivateSubscription}
                            loading={isActivatingSubscription}
                          >
                            {t('profile.subscription.activateSubscription')}
                          </Button>
                        }
                      />
                    )}
                  </Card>
                </Col>
              </Row>

              {/* Sección de Estado de Suscripción y Preferencia de Idioma */}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card title={t('profile.languagePreference')} style={{ height: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <Text>{t('profile.language')}</Text>
                      <Select
                        value={user.language || locale}
                        onChange={handleChangeLanguage}
                        style={{ width: '100%', maxWidth: 200 }}
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
                </Col>

                <Col xs={24} lg={12}>
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
                </Col>
              </Row>


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

