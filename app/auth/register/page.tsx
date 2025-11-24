'use client';

import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, handleApiError } from '@/utils/api';
import { useAuthStore } from '@/store';
import { useInvisibleRecaptcha } from '@/hooks/useInvisibleRecaptcha';

const { Text } = Typography;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(12, 'La contraseña debe tener al menos 12 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const { executeRecaptcha } = useInvisibleRecaptcha('register');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha();
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        recaptchaToken,
      });

      if (response.success) {
        message.success('Usuario registrado exitosamente');
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
    <AuthLayout title="Registro">
      <Form
        name="register"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Nombre completo"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Tu nombre completo"
            {...register('name')}
            onChange={(e) => setValue('name', e.target.value)}
          />
        </Form.Item>

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
            placeholder="Mínimo 12 caracteres"
            {...register('password')}
            onChange={(e) => setValue('password', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Repite tu contraseña"
            {...register('confirmPassword')}
            onChange={(e) => setValue('confirmPassword', e.target.value)}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%', height: '45px' }}
          >
            Crear cuenta
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text>
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" style={{ color: '#1890ff' }}>
              Inicia sesión
            </Link>
          </Text>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
