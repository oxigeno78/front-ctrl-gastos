'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, DatePicker, Typography, Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ReferenceLine } from 'recharts';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { useFormatters } from '@/hooks/useFormatters';
import {
  MonthlyStats,
  StatGroup,
  CategoryChartData,
  BalanceCategoryData,
  PieChartData,
  TrendChartData,
  RechartsTooltipProps,
  CategoryStat,
} from '@/types';
import dayjs from 'dayjs';

const { Title } = Typography;

const ReportsPage: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency } = useFormatters();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [trendData, setTrendChartData] = useState<TrendChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(dayjs().subtract(2, 'month').startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));

  useEffect(() => {
    loadMonthlyStats();
    loadTrendChartData();
  }, [startDate, endDate]);

  const loadMonthlyStats = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getMonthlyStats(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );
      setMonthlyStats(response.data);
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendChartData = async () => {
    try {
      const response = await transactionAPI.getTransactions({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        limit: 10000,
      });

      const monthsCount = getMonthsCount();
      const dataByMonth: Record<string, TrendChartData> = {};

      // Inicializar todos los meses en el rango con valores en 0
      for (let i = monthsCount - 1; i >= 0; i--) {
        const monthKey = endDate.subtract(i, 'month').format('MMM YYYY');
        dataByMonth[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      // Agrupar transacciones por mes
      response.data?.transactions?.forEach((transaction) => {
        const transactionDate = dayjs(transaction.date);
        const monthKey = transactionDate.format('MMM YYYY');

        if (dataByMonth[monthKey]) {
          const amount = Number(transaction.amount) || 0;
          if (transaction.type === 'income') {
            dataByMonth[monthKey].income += amount;
          } else {
            dataByMonth[monthKey].expense += amount;
          }
        }
      });

      setTrendChartData(Object.values(dataByMonth));
    } catch (error) {
      console.error('Error loading trend data:', error);
    }
  };

  // Calcular cantidad de meses en el rango seleccionado
  const getMonthsCount = () => {
    return endDate.diff(startDate, 'month') + 1;
  };

  // Preparar datos para gráfica de barras - todas las transacciones agrupadas por categoría
  const getCategoryChartData = (): CategoryChartData[] => {
    if (!monthlyStats?.stats) return [];

    const categoryMap: Record<string, { amount: number; count: number; color?: string }> = {};

    monthlyStats.stats.forEach((stat: StatGroup) => {
      stat.categories.forEach((cat: CategoryStat) => {
        const name = cat.category;
        const total = Number(cat.total) || 0;
        const count = Number(cat.count) || 0;

        if (categoryMap[name]) {
          categoryMap[name].amount += total;
          categoryMap[name].count += count;
        } else {
          categoryMap[name] = { amount: total, count, color: cat.color };
        }
      });
    });

    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      color: data.color,
    }));
  };

  // Preparar datos para gráfica de balance por categoría (ingresos positivos, gastos negativos)
  const getBalanceByCategoryChartData = (): BalanceCategoryData[] => {
    if (!monthlyStats?.stats) return [];

    const categoryMap: Record<string, { income: number; expense: number; count: number; color?: string }> = {};

    monthlyStats.stats.forEach((stat: StatGroup) => {
      const isIncome = stat._id === 'income';
      stat.categories.forEach((cat: CategoryStat) => {
        const name = cat.category;
        const total = Number(cat.total) || 0;
        const count = Number(cat.count) || 0;

        if (!categoryMap[name]) {
          categoryMap[name] = { income: 0, expense: 0, count: 0, color: cat.color };
        }
        categoryMap[name].count += count;
        if (isIncome) {
          categoryMap[name].income += total;
        } else {
          categoryMap[name].expense += total;
        }
      });
    });

    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      income: data.income,
      expense: -data.expense,
      count: data.count,
      color: data.color,
    }));
  };

  // Preparar datos para gráfica circular
  const getPieChartData = (): PieChartData[] => {
    if (!monthlyStats?.stats) return [];

    return monthlyStats.stats.map((stat: StatGroup) => ({
      type: stat._id === 'income' ? t('transactions.incomes') : t('transactions.expenses'),
      value: Number(stat.total) || 0,
      count: Number(stat.count) || 0,
    }));
  };

  const categoryData = getCategoryChartData();
  const balanceByCategoryChartData = getBalanceByCategoryChartData();
  const pieData = getPieChartData();
  const totalPie = pieData.reduce((sum, d) => sum + d.value, 0);

  // Colores para el pie chart
  const PIE_COLORS = ['#52c41a', '#ff4d4f'];

  const monthsCount = getMonthsCount();

  // Tooltip personalizado para el gráfico de barras
  const CategoryTooltip = ({ active, payload }: RechartsTooltipProps<CategoryChartData>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.category}</p>
          <p style={{ margin: 0 }}>{formatCurrency(data.amount)}</p>
          <p style={{ margin: 0, color: '#666' }}>{data.count} {t('reports.transactions')}</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para el pie chart
  const PieTooltip = ({ active, payload }: RechartsTooltipProps<PieChartData>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = totalPie > 0 ? ((data.value / totalPie) * 100).toFixed(2) : '0.00';
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.type}</p>
          <p style={{ margin: 0 }}>{formatCurrency(data.value)} ({percent}%)</p>
          <p style={{ margin: 0, color: '#666' }}>{data.count} {t('reports.transactions')}</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para el gráfico de líneas
  const TrendTooltip = ({ active, payload, label }: RechartsTooltipProps<TrendChartData>) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {entry.name === 'income' ? t('transactions.incomes') : t('transactions.expenses')}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para el gráfico de balance por categoría
  const BalanceTooltip = ({ active, payload }: RechartsTooltipProps<BalanceCategoryData>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.category}</p>
          {data.income > 0 && (
            <p style={{ margin: 0, color: '#52c41a' }}>
              {t('transactions.incomes')}: {formatCurrency(data.income)}
            </p>
          )}
          {data.expense < 0 && (
            <p style={{ margin: 0, color: '#ff4d4f' }}>
              {t('transactions.expenses')}: {formatCurrency(Math.abs(data.expense))}
            </p>
          )}
          <p style={{ margin: 0, color: '#666' }}>{data.count} {t('reports.transactions')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              {t('reports.title')}
            </Title>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <DatePicker
                value={startDate}
                onChange={(date) => date && setStartDate(date)}
                format="YYYY-MM-DD"
                placeholder={t('common.startDate')}
                allowClear={false}
              />
              <span>-</span>
              <DatePicker
                value={endDate}
                onChange={(date) => date && setEndDate(date)}
                format="YYYY-MM-DD"
                placeholder={t('common.endDate')}
                allowClear={false}
              />
            </div>
          </div>

          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title={`${t('reports.transactionsByCategory')} - ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`}>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData} margin={{ left: 20 }}>
                        <XAxis dataKey="category" />
                        <YAxis tickFormatter={(v) => formatCurrency(v)} />
                        <Tooltip content={<CategoryTooltip />} />
                        <Bar dataKey="amount" fill="#1890ff">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#1890ff'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                      {t('reports.noDataToShow')}
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={`${t('reports.balanceByCategory')} - ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`}>
                  {balanceByCategoryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={balanceByCategoryChartData} margin={{ left: 20}}>
                        <XAxis dataKey="category" />
                        <YAxis tickFormatter={(v) => formatCurrency(v)} />
                        <Tooltip content={<BalanceTooltip />} />
                        <ReferenceLine y={0} stroke="#666" />
                        <Bar dataKey="income" name="income" stackId="balance">
                          {balanceByCategoryChartData.map((entry, index) => (
                            <Cell key={`cell-income-${index}`} fill={entry.color || '#52c41a'} />
                          ))}
                        </Bar>
                        <Bar dataKey="expense" name="expense" stackId="balance">
                          {balanceByCategoryChartData.map((entry, index) => (
                            <Cell key={`cell-expense-${index}`} fill={entry.color || '#ff4d4f'} opacity={0.6} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                      {t('reports.noDataToShow')}
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={`${t('reports.incomeVsExpenses')} - ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`}>
                  {totalPie > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ payload, percent }) => payload ? `${(payload as PieChartData).type}: ${((percent || 0) * 100).toFixed(1)}%` : ''}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                      {t('reports.noDataToShow')}
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={`${t('reports.trend')} - ${monthsCount} ${monthsCount === 1 ? t('reports.month') : t('reports.months')}`}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => formatCurrency(v)} />
                      <Tooltip content={<TrendTooltip />} />
                      <Legend formatter={(value) => value === 'income' ? t('transactions.incomes') : t('transactions.expenses')} />
                      <Line type="monotone" dataKey="income" stroke="#52c41a" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="expense" stroke="#ff4d4f" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {monthlyStats && (
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        {formatCurrency(monthlyStats.stats.find(s => s._id === 'income')?.total || 0)}
                      </div>
                      <div style={{ color: '#666' }}>{t('reports.totalIncome')}</div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                        {formatCurrency(monthlyStats.stats.find(s => s._id === 'expense')?.total || 0)}
                      </div>
                      <div style={{ color: '#666' }}>{t('reports.totalExpenses')}</div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: (monthlyStats.stats.find(s => s._id === 'income')?.total || 0) -
                          (monthlyStats.stats.find(s => s._id === 'expense')?.total || 0) >= 0 ? '#52c41a' : '#ff4d4f'
                      }}>
                        {formatCurrency(
                          (monthlyStats.stats.find(s => s._id === 'income')?.total || 0) -
                          (monthlyStats.stats.find(s => s._id === 'expense')?.total || 0)
                        )}
                      </div>
                      <div style={{ color: '#666' }}>{t('reports.balance')}</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            )}
          </Spin>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ReportsPage;

