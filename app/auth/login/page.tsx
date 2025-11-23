'use client';

import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, handleApiError } from '@/utils/api';
import { useAuthStore } from '@/store';

const { Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  password: yup
    .string()
    .required('La contraseña es requerida'),
});

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

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
      const response = await authAPI.login({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        message.success('Inicio de sesión exitoso');
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
    <AuthLayout title="Iniciar Sesión">
      <Form
        name="login"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="tu@email.com"
            {...register('email')}
            onChange={(e) => setValue('email', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Tu contraseña"
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
            Iniciar sesión
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text>
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" style={{ color: '#1890ff' }}>
              Regístrate aquí
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text>
            ¿Olvidaste tu contraseña?{' '}
            <Link href="/auth/recoverypass" style={{ color: '#1890ff' }}>
              Recupera tu contraseña aquí
            </Link>
          </Text>
        </div>

      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
