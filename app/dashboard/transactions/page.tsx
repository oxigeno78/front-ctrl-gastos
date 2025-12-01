'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Input, Select, Button, Space, Typography, message, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { Transaction, TransactionFilters } from '@/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { useCategories } from '@/hooks/useCategories';

const { Title } = Typography;
const { Option } = Select;

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
  });
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions(filters);
      setTransactions(response.data.transactions);
      setPagination({
        current: response.data.pagination.page,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.total,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    setFilters({
      ...filters,
      page,
      limit: pageSize || filters.limit,
    });
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filtering
    });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 100,
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
      width: 120,
      render: (amount: number) => (
        <span style={{ 
          color: amount >= 0 ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
      width: 120,
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
      width: 120,
      render: (date: string) => formatDate(date),
      sorter: (a: Transaction, b: Transaction) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Creado',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => formatDate(date),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <Title level={2} style={{ marginBottom: '24px' }}>
            Historial de Transacciones
          </Title>

          <Card style={{ marginBottom: '16px' }}>
            <Space wrap>
              <Input
                placeholder="Buscar por descripción..."
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({
                    ...filters,
                    description: value || undefined,
                    page: 1,
                  });
                }}
              />
              
              <Select
                placeholder="Filtrar por tipo"
                style={{ width: 150 }}
                allowClear
                onChange={(value) => handleFilterChange('type', value)}
              >
                <Option value="income">Ingresos</Option>
                <Option value="expense">Gastos</Option>
              </Select>

              <Select
                placeholder="Filtrar por categoría"
                style={{ width: 150 }}
                allowClear
                loading={categoriesLoading}
                onChange={(value) => handleFilterChange('category', value)}
              >
                {categories.map((category) => (
                  <Option key={category._id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>

              <Button 
                icon={<FilterOutlined />}
                onClick={clearFilters}
              >
                Limpiar Filtros
              </Button>
            </Space>
          </Card>

          <Card>
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="_id"
              loading={loading}
              pagination={false}
              scroll={{ x: 800 }}
            />
            
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} de ${total} transacciones`
                }
                onChange={handleTableChange}
                onShowSizeChange={handleTableChange}
              />
            </div>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default TransactionsPage;
