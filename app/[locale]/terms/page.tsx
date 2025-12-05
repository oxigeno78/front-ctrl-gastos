'use client';

import React from 'react';
import { Typography, Card, Divider, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const { Title, Paragraph, Text } = Typography;

const TermsPage: React.FC = () => {
  const t = useTranslations('terms');

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
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
              {t('title')}
            </Title>

            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '30px' }}>
              {t('lastUpdated')}
            </Text>

            <Divider />

            <Title level={4}>{t('sections.acceptance.title')}</Title>
            <Paragraph>{t('sections.acceptance.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.service.title')}</Title>
            <Paragraph>{t('sections.service.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.account.title')}</Title>
            <Paragraph>{t('sections.account.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.privacy.title')}</Title>
            <Paragraph>{t('sections.privacy.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.userResponsibilities.title')}</Title>
            <Paragraph>{t('sections.userResponsibilities.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.dataProtection.title')}</Title>
            <Paragraph>{t('sections.dataProtection.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.limitations.title')}</Title>
            <Paragraph>{t('sections.limitations.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.modifications.title')}</Title>
            <Paragraph>{t('sections.modifications.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.termination.title')}</Title>
            <Paragraph>{t('sections.termination.content')}</Paragraph>

            <Divider />

            <Title level={4}>{t('sections.contact.title')}</Title>
            <Paragraph>{t('sections.contact.content')}</Paragraph>
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
