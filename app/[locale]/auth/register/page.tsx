'use client';

import React from 'react';
import { Form, Input, Button, message, Typography, Select, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GlobalOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslations, useLocale } from 'next-intl';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, stripeAPI, handleApiError } from '@/utils/api';
import { useAuthStore } from '@/store';
import { useInvisibleRecaptcha } from '@/hooks/useInvisibleRecaptcha';
import { Link, useRouter } from '@/i18n/routing';
import { locales, languageLabels, type Locale } from '@/i18n/config';
import { RegisterFormData } from '@/types';

const { Text } = Typography;

const RegisterPage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(locale);
  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [registrationData, setRegistrationData] = React.useState<{ user: any; token: string; language: string } | null>(null);
  const { executeRecaptcha } = useInvisibleRecaptcha('register');

  const registerSchema = yup.object({
    name: yup
      .string()
      .required(t('auth.validation.nameRequired'))
      .min(2, t('auth.validation.nameMin'))
      .max(50, t('auth.validation.nameMax')),
    email: yup
      .string()
      .required(t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: yup
      .string()
      .required(t('auth.validation.passwordRequired'))
      .min(12, t('auth.validation.passwordMin')),
    confirmPassword: yup
      .string()
      .required(t('auth.validation.confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('auth.validation.passwordsMismatch')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha();
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        language: selectedLanguage,
        recaptchaToken,
      });

      if (response.success) {
        const userLanguage = response.data.language || selectedLanguage;
        setRegistrationData({
          user: response.data.user,
          token: response.data.token,
          language: userLanguage,
        });
        setShowVerificationModal(true);
      }
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAfterVerification = async () => {
    if (!registrationData) return;
    
    const { user, token, language: userLanguage } = registrationData;
    login(user, token, userLanguage);
    setShowVerificationModal(false);
    
    // Crear sesión de checkout de Stripe y redirigir
    try {
      message.loading(t('auth.register.redirectingToPayment'), 0);
      const checkoutResponse = await stripeAPI.createCheckoutSession(user.id);
      
      if (checkoutResponse.success && checkoutResponse.data.url) {
        window.location.href = checkoutResponse.data.url;
      } else {
        message.destroy();
        router.replace('/dashboard', { locale: userLanguage as Locale });
      }
    } catch (stripeError) {
      message.destroy();
      const stripeApiError = handleApiError(stripeError);
      message.warning(stripeApiError.message);
      router.replace('/dashboard', { locale: userLanguage as Locale });
    }
  };

  return (
    <AuthLayout title={t('auth.register.title')}>
      <Form
        name="register"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label={t('auth.register.name')}
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('auth.register.namePlaceholder')}
            {...register('name')}
            onChange={(e) => setValue('name', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.register.email')}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('auth.register.emailPlaceholder')}
            {...register('email')}
            onChange={(e) => setValue('email', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.register.password')}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.register.passwordPlaceholder')}
            {...register('password')}
            onChange={(e) => setValue('password', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.register.confirmPassword')}
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            {...register('confirmPassword')}
            onChange={(e) => setValue('confirmPassword', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.register.language')}
        >
          <Select
            value={selectedLanguage}
            onChange={(value) => setSelectedLanguage(value)}
            suffixIcon={<GlobalOutlined />}
            options={locales.map((loc) => ({
              value: loc,
              label: languageLabels[loc],
            }))}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%', height: '45px' }}
          >
            {t('auth.register.submit')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text>
            <Link href="/auth/login" style={{ color: '#1890ff' }}>
              {t('auth.register.hasAccount')}
            </Link>
          </Text>
        </div>
      </Form>

      <Modal
        open={showVerificationModal}
        closable={false}
        footer={null}
        centered
        width={480}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
          
          <Typography.Title level={3} style={{ marginBottom: 8 }}>
            {t('auth.register.verificationModal.title')}
          </Typography.Title>
          
          <Typography.Title level={5} type="secondary" style={{ marginBottom: 16, fontWeight: 'normal' }}>
            {t('auth.register.verificationModal.subtitle')}
          </Typography.Title>
          
          <Typography.Paragraph style={{ marginBottom: 16 }}>
            {t('auth.register.verificationModal.description')}
          </Typography.Paragraph>
          
          <div style={{ 
            background: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: 8, 
            padding: 16, 
            marginBottom: 16,
            textAlign: 'left'
          }}>
            <Typography.Text style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <WarningOutlined style={{ color: '#fa8c16', fontSize: 18, marginTop: 2 }} />
              <span>{t('auth.register.verificationModal.warning')}</span>
            </Typography.Text>
          </div>
          
          <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
            {t('auth.register.verificationModal.checkEmail')}
          </Typography.Paragraph>
          
          <Button 
            type="primary" 
            size="large" 
            onClick={handleContinueAfterVerification}
            style={{ minWidth: 200 }}
          >
            {t('auth.register.verificationModal.continueButton')}
          </Button>
        </div>
      </Modal>
    </AuthLayout>
  );
};

export default RegisterPage;
