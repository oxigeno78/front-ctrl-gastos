'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Button, Table, Tag, Space, message } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  PlusOutlined,
  EyeOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { useTransactionStore } from '@/store';
import { formatCurrency, formatDate } from '@/utils/helpers';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { transactions, summary, setTransactions, setSummary, setLoading } = useTransactionStore();
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions({ limit: 5 });
      setTransactions(response.transactions);
      setSummary(response.summary);
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
      setLoadingState(false);
    }
  };

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type === 'income' ? 'Ingreso' : 'Gasto'}
        </Tag>
      ),
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => formatDate(date),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              Resumen Financiero
            </Title>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => router.push('/dashboard/add-transaction')}
              >
                Agregar Movimiento
              </Button>
              <Button 
                icon={<EyeOutlined />}
                onClick={() => router.push('/dashboard/transactions')}
              >
                Ver Todo
              </Button>
            </Space>
          </div>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Ingresos"
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
                  title="Total Gastos"
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
                  title="Balance"
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
                  title="Total Transacciones"
                  value={summary?.transactionCount || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Últimas Transacciones" style={{ marginBottom: '24px' }}>
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
              <Card title="Acciones Rápidas">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/dashboard/add-transaction')}
                    style={{ width: '100%' }}
                  >
                    Agregar Ingreso
                  </Button>
                  <Button 
                    size="large"
                    icon={<ArrowDownOutlined />}
                    onClick={() => router.push('/dashboard/add-transaction?type=expense')}
                    style={{ width: '100%' }}
                  >
                    Registrar Gasto
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Enlaces Útiles">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => router.push('/dashboard/transactions')}
                    style={{ width: '100%' }}
                  >
                    Ver Historial Completo
                  </Button>
                  <Button 
                    size="large"
                    icon={<DollarOutlined />}
                    onClick={() => router.push('/dashboard/reports')}
                    style={{ width: '100%' }}
                  >
                    Ver Reportes
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
