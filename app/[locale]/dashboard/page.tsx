'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Button, Table, Tag, Space, message } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  PlusOutlined,
  EyeOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { useTransactionStore } from '@/store';
import { useFormatters } from '@/hooks/useFormatters';
import { formatDate } from '@/utils/helpers';
import { Transaction } from '@/types';
import { useRouter } from '@/i18n/routing';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const { formatCurrency } = useFormatters();
  const { transactions, summary, setTransactions, setSummary, setLoading } = useTransactionStore();
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions({ limit: 5 });
      setTransactions(response.data.transactions);
      setSummary(response.data.summary);
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
      setLoadingState(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionAPI.deleteTransaction(id);
      loadTransactions();
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    }
  };

  const columns = [
    {
      title: t('transactions.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type === 'income' ? t('transactions.income') : t('transactions.expense')}
        </Tag>
      ),
    },
    {
      title: t('transactions.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: t('transactions.category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('transactions.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('transactions.date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => formatDate(date),
    },
    {
      title: t('transactions.periodicity'),
      dataIndex: 'periodicityText',
      key: 'periodicityText',
      render: (periodicityText: string = '') => {
        return t(`transactions.periodicity${periodicityText.charAt(0).toUpperCase() + periodicityText.slice(1)}`);
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (record: Transaction) => (
        <Space>
          <Button 
            type="link"
            icon={<EditOutlined />}
            onClick={() => router.push(`/dashboard/transactions/${record._id}`)}
          />
          <Button 
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    }
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              {t('dashboard.title')}
            </Title>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => router.push('/dashboard/add-transaction')}
              >
                {t('dashboard.addTransaction')}
              </Button>
              <Button 
                icon={<EyeOutlined />}
                onClick={() => router.push('/dashboard/transactions')}
              >
                {t('dashboard.viewAll')}
              </Button>
            </Space>
          </div>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.totalIncome')}
                  value={summary?.totalIncome || 0}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  suffix={<ArrowUpOutlined />}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.totalExpenses')}
                  value={summary?.totalExpense || 0}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                  suffix={<ArrowDownOutlined />}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.balance')}
                  value={summary?.balance || 0}
                  precision={2}
                  valueStyle={{ 
                    color: (summary?.balance || 0) >= 0 ? '#3f8600' : '#cf1322' 
                  }}
                  suffix={<DollarOutlined />}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.totalTransactions')}
                  value={summary?.transactionCount || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title={t('dashboard.recentTransactions')} style={{ marginBottom: '24px' }}>
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="_id"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title={t('dashboard.quickActions')}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/dashboard/add-transaction')}
                    style={{ width: '100%' }}
                  >
                    {t('dashboard.addIncome')}
                  </Button>
                  <Button 
                    size="large"
                    icon={<ArrowDownOutlined />}
                    onClick={() => router.push('/dashboard/add-transaction?type=expense')}
                    style={{ width: '100%' }}
                  >
                    {t('dashboard.addExpense')}
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title={t('dashboard.usefulLinks')}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => router.push('/dashboard/transactions')}
                    style={{ width: '100%' }}
                  >
                    {t('dashboard.viewHistory')}
                  </Button>
                  <Button 
                    size="large"
                    icon={<DollarOutlined />}
                    onClick={() => router.push('/dashboard/reports')}
                    style={{ width: '100%' }}
                  >
                    {t('dashboard.viewReports')}
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
