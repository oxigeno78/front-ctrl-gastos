'use client';

import React from 'react';
import { Form, Input, Button, message, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslations, useLocale } from 'next-intl';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, stripeAPI, handleApiError } from '@/utils/api';
import { useAuthStore } from '@/store';
import { useInvisibleRecaptcha } from '@/hooks/useInvisibleRecaptcha';
import { Link, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import { RegisterFormData } from '@/types';

const { Text } = Typography;

const languageLabels: Record<Locale, string> = {
  esp: 'Español',
  eng: 'English',
};

const RegisterPage: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(locale);
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
        message.success(t('auth.register.success'));
        const userLanguage = response.data.language || selectedLanguage;
        login(response.data.user, response.data.token, userLanguage);
        
        // Crear sesión de checkout de Stripe y redirigir
        try {
          message.loading(t('auth.register.redirectingToPayment'), 0);
          const checkoutResponse = await stripeAPI.createCheckoutSession(response.data.user.id);
          
          if (checkoutResponse.success && checkoutResponse.data.url) {
            // Redirigir a Stripe Checkout
            window.location.href = checkoutResponse.data.url;
          } else {
            // Si falla, redirigir al dashboard
            message.destroy();
            router.replace('/dashboard', { locale: userLanguage as Locale });
          }
        } catch (stripeError) {
          // Si hay error con Stripe, redirigir al dashboard de todos modos
          message.destroy();
          const stripeApiError = handleApiError(stripeError);
          message.warning(stripeApiError.message);
          router.replace('/dashboard', { locale: userLanguage as Locale });
        }
      }
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
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
            {t('auth.register.hasAccount')}{' '}
            <Link href="/auth/login" style={{ color: '#1890ff' }}>
              {t('auth.register.login')}
            </Link>
          </Text>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
