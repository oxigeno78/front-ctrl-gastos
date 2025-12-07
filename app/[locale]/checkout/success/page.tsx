'use client';

import React, { useEffect } from 'react';
import { Result, Button, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store';

const CheckoutSuccessPage: React.FC = () => {
  const t = useTranslations('stripe.checkout.success');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          maxWidth: '500px',
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '72px' }} />}
          title={t('title')}
          subTitle={t('subtitle')}
          extra={
            <div>
              <p style={{ marginBottom: '24px', color: '#666' }}>
                {t('description')}
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handleGoToDashboard}
                style={{
                  height: '48px',
                  paddingInline: '32px',
                  fontSize: '16px',
                }}
              >
                {t('goToDashboard')}
              </Button>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;
