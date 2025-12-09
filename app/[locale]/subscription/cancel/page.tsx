'use client';

import React from 'react';
import { Result, Button, Card, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store';
import { stripeAPI, handleApiError } from '@/utils/api';
import { message } from 'antd';

const CheckoutCancelPage: React.FC = () => {
  const t = useTranslations('stripe.checkout.cancel');
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const handleTryAgain = async () => {
    if (!user?.id) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const checkoutResponse = await stripeAPI.createCheckoutSession(user.id);
      
      if (checkoutResponse.success && checkoutResponse.data.url) {
        window.location.href = checkoutResponse.data.url;
      } else {
        message.error(t('error'));
      }
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
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
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '72px' }} />}
          title={t('title')}
          subTitle={t('subtitle')}
          extra={
            <div>
              <p style={{ marginBottom: '24px', color: '#666' }}>
                {t('description')}
              </p>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {isAuthenticated && (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleTryAgain}
                    loading={loading}
                    style={{
                      height: '48px',
                      paddingInline: '32px',
                      fontSize: '16px',
                      width: '100%',
                    }}
                  >
                    {t('tryAgain')}
                  </Button>
                )}
                <Link href="/" style={{ width: '100%', display: 'block' }}>
                  <Button
                    size="large"
                    style={{
                      height: '48px',
                      paddingInline: '32px',
                      fontSize: '16px',
                      width: '100%',
                    }}
                  >
                    {t('backToHome')}
                  </Button>
                </Link>
              </Space>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CheckoutCancelPage;
