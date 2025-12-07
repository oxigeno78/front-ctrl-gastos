'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Typography, Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ReferenceLine } from 'recharts';
import { useTranslations } from 'next-intl';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { useFormatters } from '@/hooks/useFormatters';
import { getMonthName } from '@/utils/helpers';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface MonthlyStats {
  month: number;
  year: number;
  stats: Array<{
    _id: string;
    categories: Array<{
      category: string;
      total: number;
      count: number;
      color?: string;
    }>;
    total: number;
    count: number;
  }>;
}

const ReportsPage: React.FC = () => {
  const t = useTranslations();
  const { formatCurrency } = useFormatters();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [trendStats, setTrendStats] = useState<Array<{ month: string; type: string; value: number; label: string; currencyValueFormatted: string }>>([]); // Datos de tendencia de 6 meses
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);

  useEffect(() => {
    loadMonthlyStats();
  }, [selectedYear, selectedMonth]);

  // Cargar datos de tendencia de los últimos 6 meses
  useEffect(() => {
    loadTrendStats();
  }, []);

  const loadMonthlyStats = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getMonthlyStats(selectedYear, selectedMonth);
      setMonthlyStats(response.data);
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendStats = async () => {
    try {
      const currentDate = dayjs();
      // Calcular fecha de inicio (hace 6 meses) y fin (hoy)
      const startDate = currentDate.subtract(5, 'month').startOf('month').format('YYYY-MM-DD');
      const endDate = currentDate.endOf('month').format('YYYY-MM-DD');
      const monthlyTotals: Record<string, { income: number; expense: number }> = {};

      // Transformar a formato para la gráfica
      const trendData: Array<{ month: string; type: string; value: number; label: string; currencyValueFormatted: string }> = [];

      // Una sola llamada a la API con rango de fechas
      const response = await transactionAPI.getTransactions({
        startDate,
        endDate,
        limit: 1000, // Obtener todas las transacciones del período
      });

      // Agrupar transacciones por mes y tipo

      // Inicializar los 6 meses con valores en 0
      for (let i = 5; i >= 0; i--) {
        const monthKey = currentDate.subtract(i, 'month').format('MMM YYYY');
        monthlyTotals[monthKey] = { income: 0, expense: 0 };
      }

      // Sumar transacciones por mes
      response.data?.transactions?.forEach((transaction: any) => {
        const transactionDate = dayjs(transaction.date);
        const monthKey = transactionDate.format('MMM YYYY');

        if (monthlyTotals[monthKey]) {
          if (transaction.type === 'income') {
            monthlyTotals[monthKey].income += Number(transaction.amount) || 0;
          } else {
            monthlyTotals[monthKey].expense += Number(transaction.amount) || 0;
          }
        }
      });

      // Mantener orden cronológico
      for (let i = 5; i >= 0; i--) {
        const monthKey = currentDate.subtract(i, 'month').format('MMM YYYY');
        const totals = monthlyTotals[monthKey];

        trendData.push({
          month: monthKey,
          type: 'income',
          value: totals.income,
          label: t('transactions.incomes'),
          currencyValueFormatted: formatCurrency(totals.income)
        });
        trendData.push({
          month: monthKey,
          type: 'expense',
          value: totals.expense,
          label: t('transactions.expenses'),
          currencyValueFormatted: formatCurrency(totals.expense)
        });
      }

      setTrendStats(trendData);
    } catch (error) {
      console.error('Error loading trend stats:', error);
    }
  };

  // Preparar datos para gráfica de barras - todas las transacciones agrupadas por categoría
  const getCategoryData = () => {
    if (!monthlyStats?.stats) return [];

    // Agrupar por nombre de categoría (sin importar tipo income/expense)
    const categoryMap: Record<string, { amount: number; count: number; color?: string }> = {};

    monthlyStats.stats.forEach(stat => {
      stat.categories.forEach(cat => {
        const name = cat.category;
        if (categoryMap[name]) {
          categoryMap[name].amount += Number(cat.total) || 0;
          categoryMap[name].count += Number(cat.count) || 0;
        } else {
          categoryMap[name] = {
            amount: Number(cat.total) || 0,
            count: Number(cat.count) || 0,
            color: cat.color,
          };
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
  const getBalanceByCategoryData = () => {
    if (!monthlyStats?.stats) return [];

    // Agrupar por categoría separando ingresos y gastos
    const categoryMap: Record<string, { income: number; expense: number; color?: string }> = {};

    monthlyStats.stats.forEach(stat => {
      const isIncome = stat._id === 'income';
      stat.categories.forEach(cat => {
        const name = cat.category;
        if (!categoryMap[name]) {
          categoryMap[name] = { income: 0, expense: 0, color: cat.color };
        }
        if (isIncome) {
          categoryMap[name].income += Number(cat.total) || 0;
        } else {
          categoryMap[name].expense += Number(cat.total) || 0;
        }
      });
    });

    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      income: data.income,
      expense: -data.expense, // Negativo para mostrar hacia abajo
      color: data.color,
    }));
  };

  // Preparar datos para gráfica circular
  const getPieData = () => {
    if (!monthlyStats?.stats) return [];

    return monthlyStats.stats.map(stat => ({
      type: stat._id === 'income' ? t('transactions.incomes') : t('transactions.expenses'),
      value: Number(stat.total) || 0,
      count: Number(stat.count) || 0,
    }));
  };

  // Los datos de tendencia ahora vienen del estado trendStats

  const categoryData = getCategoryData();
  const balanceByCategoryData = getBalanceByCategoryData();
  const pieData = getPieData();
  const totalPie = pieData.reduce((sum: number, d: any) => sum + (Number(d.value) || 0), 0);

  // Colores para el pie chart
  const PIE_COLORS = ['#52c41a', '#ff4d4f'];

  // Preparar datos para el gráfico de líneas (formato que Recharts espera)
  const getTrendChartData = () => {
    const dataByMonth: Record<string, { month: string; income: number; expense: number }> = {};
    
    trendStats.forEach(item => {
      if (!dataByMonth[item.month]) {
        dataByMonth[item.month] = { month: item.month, income: 0, expense: 0 };
      }
      if (item.type === 'income') {
        dataByMonth[item.month].income = item.value;
      } else {
        dataByMonth[item.month].expense = item.value;
      }
    });

    return Object.values(dataByMonth);
  };

  const trendChartData = getTrendChartData();

  // Tooltip personalizado para el gráfico de barras
  const CategoryTooltip = ({ active, payload }: any) => {
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
  const PieTooltip = ({ active, payload }: any) => {
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
  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
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
  const BalanceTooltip = ({ active, payload }: any) => {
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
          <p style={{ margin: 0, fontWeight: 'bold', marginTop: '4px' }}>
            {t('reports.balance')}: {formatCurrency(data.income + data.expense)}
          </p>
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                style={{ width: 120 }}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = dayjs().year() - i;
                  return (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  );
                })}
              </Select>

              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                style={{ width: 150 }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title={`${t('reports.transactionsByCategory')} - ${getMonthName(selectedMonth)} ${selectedYear}`}>
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
                <Card title={`${t('reports.balanceByCategory')} - ${getMonthName(selectedMonth)} ${selectedYear}`}>
                  {balanceByCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={balanceByCategoryData} margin={{ left: 20}}>
                        <XAxis dataKey="category" />
                        <YAxis tickFormatter={(v) => formatCurrency(v)} />
                        <Tooltip content={<BalanceTooltip />} />
                        <Legend formatter={(value) => value === 'income' ? t('transactions.incomes') : t('transactions.expenses')} />
                        <ReferenceLine y={0} stroke="#666" />
                        <Bar dataKey="income" fill="#52c41a" name="income" stackId="balance" />
                        <Bar dataKey="expense" fill="#ff4d4f" name="expense" stackId="balance" />
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
                <Card title={`${t('reports.incomeVsExpenses')} - ${getMonthName(selectedMonth)} ${selectedYear}`}>
                  {totalPie > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ payload, percent }: any) => `${payload.type}: ${((percent || 0) * 100).toFixed(1)}%`}
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
                <Card title={t('reports.last6MonthsTrend')}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

