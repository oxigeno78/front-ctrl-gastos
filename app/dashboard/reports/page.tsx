'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Typography, Spin, message } from 'antd';
import { Column, Pie, Line, ColumnConfig } from '@ant-design/charts';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { transactionAPI, handleApiError } from '@/utils/api';
import { formatCurrency, getMonthName } from '@/utils/helpers';
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
    }>;
    total: number;
    count: number;
  }>;
}

const ReportsPage: React.FC = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);

  useEffect(() => {
    loadMonthlyStats();
  }, [selectedYear, selectedMonth]);

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

  // Preparar datos para gráfica de barras por categoría
  const getCategoryData = () => {
    if (!monthlyStats?.stats) return [];

    const categoryData: any[] = [];
    
    monthlyStats.stats.forEach(stat => {
      stat.categories.forEach(cat => {
        categoryData.push({
          category: cat.category,
          type: stat._id === 'income' ? 'Ingresos' : 'Gastos',
          amount: cat.total,
          count: cat.count,
        });
      });
    });

    return categoryData;
  };

  // Preparar datos para gráfica circular
  const getPieData = () => {
    if (!monthlyStats?.stats) return [];

    return monthlyStats.stats.map(stat => ({
      type: stat._id === 'income' ? 'Ingresos' : 'Gastos',
      value: stat.total,
      count: stat.count,
    }));
  };

  // Preparar datos para gráfica de líneas (tendencia mensual)
  const getTrendData = () => {
    // Para esta demo, generamos datos de los últimos 6 meses
    const months = [];
    const currentDate = dayjs();
    
    for (let i = 5; i >= 0; i--) {
      const date = currentDate.subtract(i, 'month');
      months.push({
        month: date.format('MMM YYYY'),
        monthNumber: date.month() + 1,
        year: date.year(),
        income: Math.random() * 5000 + 2000, // Datos simulados
        expense: Math.random() * 4000 + 1500,
      });
    }

    return months;
  };

  const categoryData = getCategoryData();
  const pieData = getPieData();
  const trendData = getTrendData();

  const columnConfig: ColumnConfig = {
    data: categoryData,
    xField: 'category',
    yField: 'amount',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f'],
    label: {
      position: 'top',
      formatter: (datum: any) => formatCurrency(datum.amount),
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${formatCurrency(datum.amount)} (${datum.count} transacciones)`,
      }),
    },
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#52c41a', '#ff4d4f'],
    label: {
      text: (datum: any) => `${datum.type}: ${(datum.percent * 100).toFixed(1)}%`,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${formatCurrency(datum.value)} (${datum.count} transacciones)`,
      }),
    },
  };

  const lineConfig = {
    data: trendData,
    xField: 'month',
    yField: 'income',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f'],
    point: {
      size: 4,
      shape: 'circle',
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type === 'income' ? 'Ingresos' : 'Gastos',
        value: formatCurrency(datum.value),
      }),
    },
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              Reportes y Análisis
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
                <Card title={`Gastos por Categoría - ${getMonthName(selectedMonth)} ${selectedYear}`}>
                  {categoryData.length > 0 ? (
                    <Column {...columnConfig} height={300} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                      No hay datos para mostrar
                    </div>
                  )}
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title={`Distribución Ingresos vs Gastos - ${getMonthName(selectedMonth)} ${selectedYear}`}>
                  {pieData.length > 0 ? (
                    <Pie {...pieConfig} height={300} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                      No hay datos para mostrar
                    </div>
                  )}
                </Card>
              </Col>
              
              <Col xs={24}>
                <Card title="Tendencia de los Últimos 6 Meses">
                  <Line {...lineConfig} height={300} />
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
                      <div style={{ color: '#666' }}>Total Ingresos</div>
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                        {formatCurrency(monthlyStats.stats.find(s => s._id === 'expense')?.total || 0)}
                      </div>
                      <div style={{ color: '#666' }}>Total Gastos</div>
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
                      <div style={{ color: '#666' }}>Balance</div>
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
