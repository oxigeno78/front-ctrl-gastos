'use client';

import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, handleApiError } from '@/utils/api';
import { useAuthStore } from '@/store';
import { useInvisibleRecaptcha } from '@/hooks/useInvisibleRecaptcha';
import { Link, useRouter } from '@/i18n/routing';

const { Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const { executeRecaptcha } = useInvisibleRecaptcha('login');

  const loginSchema = yup.object({
    email: yup
      .string()
      .required(t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: yup
      .string()
      .required(t('auth.validation.passwordRequired')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha();
      const response = await authAPI.login({
        email: data.email,
        password: data.password,
        recaptchaToken,
      });

      if (response.success) {
        message.success(t('auth.login.success'));
        login(response.data.user, response.data.token);
        router.push('/dashboard');
      }
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.login.title')}>
      <Form
        name="login"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label={t('auth.login.email')}
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('auth.login.emailPlaceholder')}
            {...register('email')}
            onChange={(e) => setValue('email', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.login.password')}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.login.passwordPlaceholder')}
            {...register('password')}
            onChange={(e) => setValue('password', e.target.value)}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%', height: '45px' }}
          >
            {t('auth.login.submit')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text>
            {t('auth.login.noAccount')}{' '}
            <Link href="/auth/register" style={{ color: '#1890ff' }}>
              {t('auth.login.register')}
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text>
            {t('auth.login.forgotPassword')}{' '}
            <Link href="/auth/recoverypass" style={{ color: '#1890ff' }}>
              {t('auth.login.recoverPassword')}
            </Link>
          </Text>
        </div>

      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
