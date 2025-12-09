'use client';

import React, { useEffect } from 'react';
import { Button, Card, Typography, Row, Col, Space } from 'antd';
import {
  CheckCircleOutlined,
  DollarOutlined,
  PieChartOutlined,
  SafetyOutlined,
  MobileOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store';
import { Link, useRouter } from '@/i18n/routing';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const t = useTranslations('home');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Con HTTP-only cookies, solo verificamos el estado del store
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    { icon: <DollarOutlined style={{ fontSize: 32, color: '#667eea' }} />, key: 'trackExpenses' },
    { icon: <PieChartOutlined style={{ fontSize: 32, color: '#764ba2' }} />, key: 'reports' },
    { icon: <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />, key: 'secure' },
    { icon: <MobileOutlined style={{ fontSize: 32, color: '#1890ff' }} />, key: 'responsive' },
    { icon: <ThunderboltOutlined style={{ fontSize: 32, color: '#faad14' }} />, key: 'realtime' },
    { icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#eb2f96' }} />, key: 'categories' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 20px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title style={{ color: '#fff', fontSize: 48, marginBottom: 16 }}>
            {t('hero.title')}
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, marginBottom: 32 }}>
            {t('hero.subtitle')}
          </Paragraph>
          <Space size="large">
            <Link href="/auth/login">
              <Button type="primary" size="large" style={{ height: 50, paddingInline: 40, fontSize: 16 }}>
                {t('hero.loginButton')}
              </Button>
            </Link>
            {/* <Link href="/auth/register">
              <Button
                size="large"
                style={{
                  height: 50,
                  paddingInline: 40,
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.2)',
                  borderColor: '#fff',
                  color: '#fff',
                }}
              >
                {t('hero.registerButton')}
              </Button>
            </Link> */}
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
          {t('features.title')}
        </Title>
        <Row gutter={[32, 32]}>
          {features.map((feature) => (
            <Col xs={24} sm={12} md={8} key={feature.key}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                <Title level={4}>{t(`features.${feature.key}.title`)}</Title>
                <Paragraph type="secondary">{t(`features.${feature.key}.description`)}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Pricing Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
            {t('pricing.title')}
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 32 }}>
            {t('pricing.subtitle')}
          </Paragraph>

          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 0' }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {t('pricing.plan')}
              </Text>
              <div style={{ margin: '16px 0' }}>
                <Text style={{ fontSize: 48, fontWeight: 700, color: '#667eea' }}>$10</Text>
                <Text type="secondary" style={{ fontSize: 18 }}> MXN/{t('pricing.month')}</Text>
              </div>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                {t('pricing.description')}
              </Paragraph>

              <div style={{ textAlign: 'left', marginBottom: 24 }}>
                {['unlimited', 'reports', 'categories', 'multidevice'].map((item) => (
                  <div key={item} style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                    <Text>{t(`pricing.features.${item}`)}</Text>
                  </div>
                ))}
              </div>

              <Link href="/auth/register">
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{
                    height: 50,
                    fontSize: 16,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  {t('pricing.cta')}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a1a2e', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <LanguageSwitcher />
        </div>
        <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
            © {new Date().getFullYear()} Control Gastos. {t('footer.rights')}
          </Text>
          <Space split={<Text style={{ color: 'rgba(255,255,255,0.3)' }}>|</Text>}>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('footer.terms')}
            </Link>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('footer.privacy')}
            </Link>
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default HomePage;
