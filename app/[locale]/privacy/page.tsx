'use client';

import React from 'react';
import { Typography, Card, Divider, Button, List } from 'antd';
import { ArrowLeftOutlined, SafetyOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const { Title, Paragraph, Text } = Typography;

const PrivacyPage: React.FC = () => {
  const t = useTranslations('privacy');

  const dataIdentification = [
    t('sections.dataCollected.identification.name'),
    t('sections.dataCollected.identification.email'),
    t('sections.dataCollected.identification.password'),
  ];

  const dataFinancial = [
    t('sections.dataCollected.financial.income'),
    t('sections.dataCollected.financial.expenses'),
    t('sections.dataCollected.financial.categories'),
    t('sections.dataCollected.financial.balances'),
    t('sections.dataCollected.financial.history'),
  ];

  const dataUsage = [
    t('sections.dataCollected.usage.ip'),
    t('sections.dataCollected.usage.device'),
    t('sections.dataCollected.usage.behavior'),
    t('sections.dataCollected.usage.cookies'),
  ];

  const purposesPrimary = [
    t('sections.purposes.primary.access'),
    t('sections.purposes.primary.subscriptions'),
    t('sections.purposes.primary.reports'),
    t('sections.purposes.primary.support'),
  ];

  const purposesSecondary = [
    t('sections.purposes.secondary.experience'),
    t('sections.purposes.secondary.analytics'),
    t('sections.purposes.secondary.communications'),
  ];

  const transfers = [
    t('sections.transfers.stripe'),
    t('sections.transfers.hosting'),
    t('sections.transfers.authorities'),
  ];

  const securityMeasures = [
    t('sections.security.encryption'),
    t('sections.security.tls'),
    t('sections.security.accessControl'),
    t('sections.security.logs'),
    t('sections.security.isolatedDb'),
  ];

  const arcoRights = [
    t('sections.arco.access'),
    t('sections.arco.rectification'),
    t('sections.arco.cancellation'),
    t('sections.arco.opposition'),
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{ color: '#fff', marginBottom: '20px' }}
          >
            {t('backToHome')}
          </Button>
        </Link>

        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <SafetyOutlined style={{ fontSize: '48px', color: '#667eea' }} />
              <Title level={2} style={{ marginBottom: '0' }} > {t('marca')} </Title>
              <Title level={3} style={{ marginBottom: '8px' }}>{t('title')}</Title>
              <Text type="secondary">{t('lastUpdated')}</Text>
            </div>

            <Card size="small" style={{
                background: '#f6f8fa',
                marginBottom: '24px',
              }}
            >
              <Paragraph style={{ marginBottom: '8px' }}>
                <strong>{t('responsible.title')}:</strong> {t('responsible.value')}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }}>
                <strong>{t('contact.title')}:</strong> {t('contact.value')}
              </Paragraph>
            </Card>

            <Paragraph>{t('intro')}</Paragraph>

            <Divider />

            {/* 1. Datos personales que recabamos */}
            <Title level={4}>{t('sections.dataCollected.title')}</Title>
            <Paragraph>{t('sections.dataCollected.intro')}</Paragraph>

            <Title level={5}>{t('sections.dataCollected.identification.title')}</Title>
            <List size="small" dataSource={dataIdentification} renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>} style={{ marginBottom: '16px' }} />

            <Title level={5}>{t('sections.dataCollected.financial.title')}</Title>
            <Paragraph type="secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>
              {t('sections.dataCollected.financial.note')}
            </Paragraph>
            <List
              size="small"
              dataSource={dataFinancial}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
              style={{ marginBottom: '16px' }}
            />

            <Title level={5}>{t('sections.dataCollected.payment.title')}</Title>
            <Paragraph>{t('sections.dataCollected.payment.content')}</Paragraph>

            <Title level={5}>{t('sections.dataCollected.usage.title')}</Title>
            <List
              size="small"
              dataSource={dataUsage}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
            />

            <Divider />

            {/* 2. Finalidades del tratamiento */}
            <Title level={4}>{t('sections.purposes.title')}</Title>

            <Title level={5}>{t('sections.purposes.primary.title')}</Title>
            <List
              size="small"
              dataSource={purposesPrimary}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
              style={{ marginBottom: '16px' }}
            />

            <Title level={5}>{t('sections.purposes.secondary.title')}</Title>
            <List
              size="small"
              dataSource={purposesSecondary}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
              style={{ marginBottom: '16px' }}
            />

            <Paragraph type="secondary">
              {t('sections.purposes.optOut')}
            </Paragraph>

            <Divider />

            {/* 3. Transferencias de datos */}
            <Title level={4}>{t('sections.transfers.title')}</Title>
            <Paragraph>{t('sections.transfers.intro')}</Paragraph>
            <List
              size="small"
              dataSource={transfers}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
              style={{ marginBottom: '16px' }}
            />
            <Paragraph>
              <strong>{t('sections.transfers.noSale')}</strong>
            </Paragraph>

            <Divider />

            {/* 4. Medidas de seguridad */}
            <Title level={4}>{t('sections.security.title')}</Title>
            <Paragraph>{t('sections.security.intro')}</Paragraph>
            <List
              size="small"
              dataSource={securityMeasures}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
            />

            <Divider />

            {/* 5. Derechos ARCO */}
            <Title level={4}>{t('sections.arco.title')}</Title>
            <Paragraph>{t('sections.arco.intro')}</Paragraph>
            <List
              size="small"
              dataSource={arcoRights}
              renderItem={(item) => <List.Item style={{ padding: '4px 0' }}>• {item}</List.Item>}
              style={{ marginBottom: '16px' }}
            />
            <Paragraph>
              {t('sections.arco.howTo')}
            </Paragraph>
            <Paragraph type="secondary">
              {t('sections.arco.verification')}
            </Paragraph>

            <Divider />

            {/* 6. Uso de cookies */}
            <Title level={4}>{t('sections.cookies.title')}</Title>
            <Paragraph>{t('sections.cookies.content')}</Paragraph>
            <Paragraph type="secondary">{t('sections.cookies.warning')}</Paragraph>

            <Divider />

            {/* 7. Cambios al Aviso de Privacidad */}
            <Title level={4}>{t('sections.changes.title')}</Title>
            <Paragraph>{t('sections.changes.content')}</Paragraph>
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
