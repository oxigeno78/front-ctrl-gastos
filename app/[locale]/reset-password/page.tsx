'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, handleApiError } from '@/utils/api';
import { useRouter } from '@/i18n/routing';

const { Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const isParamsValid = useMemo(() => !!token && !!email, [token, email]);

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!isParamsValid) {
      message.error(t('auth.resetPassword.invalidLink'));
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        token,
        email,
        password: values.password,
      });
      message.success(t('auth.resetPassword.success'));
      router.push('/auth/login');
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.resetPassword.title')}>
      {!isParamsValid ? (
        <Text type="danger">
          {t('auth.resetPassword.invalidLink')}
        </Text>
      ) : (
        <Form
          name="reset-password"
          layout="vertical"
          size="large"
          onFinish={onSubmit}
        >
          <Form.Item label={t('auth.resetPassword.email')}>
            <Input value={decodeURIComponent(email)} disabled />
          </Form.Item>

          <Form.Item
            label={t('auth.resetPassword.newPassword')}
            name="password"
            rules={[
              { required: true, message: t('auth.resetPassword.newPasswordRequired') },
              { min: 12, message: t('auth.resetPassword.newPasswordMin') },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label={t('auth.resetPassword.confirmPassword')}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: t('auth.resetPassword.confirmPasswordRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('auth.resetPassword.passwordsMismatch')));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: '45px' }}
            >
              {t('auth.resetPassword.submit')}
            </Button>
          </Form.Item>
        </Form>
      )}
    </AuthLayout>
  );
}
