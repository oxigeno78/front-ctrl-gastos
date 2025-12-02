'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Input, Select, Button, Space, Typography, message, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { Transaction, TransactionFilters } from '@/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { useCategories } from '@/hooks/useCategories';

const { Title } = Typography;
const { Option } = Select;

const TransactionsPage: React.FC = () => {
  const t = useTranslations();
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
      title: t('transactions.type'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
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
      title: t('transactions.category'),
      dataIndex: 'category',
      key: 'category',
      width: 150,
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
      width: 120,
      render: (date: string) => formatDate(date),
      sorter: (a: Transaction, b: Transaction) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: t('history.created'),
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
            {t('history.title')}
          </Title>

          <Card style={{ marginBottom: '16px' }}>
            <Space wrap>
              <Input
                placeholder={t('history.searchPlaceholder')}
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
                placeholder={t('history.filterByType')}
                style={{ width: 150 }}
                allowClear
                onChange={(value) => handleFilterChange('type', value)}
              >
                <Option value="income">{t('transactions.incomes')}</Option>
                <Option value="expense">{t('transactions.expenses')}</Option>
              </Select>

              <Select
                placeholder={t('history.filterByCategory')}
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
                {t('history.clearFilters')}
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
                  t('history.paginationTotal', { start: range[0], end: range[1], total })
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
