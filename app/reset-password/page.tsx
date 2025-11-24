'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, message } from 'antd';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, handleApiError } from '@/utils/api';

const { Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const isParamsValid = useMemo(() => !!token && !!email, [token, email]);

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!isParamsValid) {
      message.error('El enlace de recuperación es inválido o ha expirado');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        token,
        email,
        password: values.password,
      });
      message.success('Tu contraseña ha sido actualizada correctamente');
      router.push('/auth/login');
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Restablecer contraseña">
      {!isParamsValid ? (
        <Text type="danger">
          El enlace de recuperación es inválido o ha expirado. Solicita uno nuevo desde la opción "Recuperar contraseña".
        </Text>
      ) : (
        <Form
          name="reset-password"
          layout="vertical"
          size="large"
          onFinish={onSubmit}
        >
          <Form.Item label="Email">
            <Input value={decodeURIComponent(email)} disabled />
          </Form.Item>

          <Form.Item
            label="Nueva contraseña"
            name="password"
            rules={[
              { required: true, message: 'Por favor, ingresa tu nueva contraseña' },
              { min: 12, message: 'La contraseña debe tener al menos 12 caracteres' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Por favor, confirma tu nueva contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: '45px' }}
            >
              Guardar nueva contraseña
            </Button>
          </Form.Item>
        </Form>
      )}
    </AuthLayout>
  );
}
