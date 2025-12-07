/**
 * Tipos para la página de reportes y gráficas
 */

// Datos de categoría en estadísticas
export interface CategoryStat {
  category: string;
  total: number;
  count: number;
  color?: string;
}

// Grupo de estadísticas (income/expense)
export interface StatGroup {
  _id: 'income' | 'expense';
  categories: CategoryStat[];
  total: number;
  count: number;
}

// Estadísticas mensuales
export interface MonthlyStats {
  month: number;
  year: number;
  stats: StatGroup[];
}

// Respuesta de API de estadísticas mensuales
export interface MonthlyStatsResponse {
  success: boolean;
  data: MonthlyStats;
}

// Datos para gráfica de categorías
export interface CategoryChartData {
  category: string;
  amount: number;
  count: number;
  color?: string;
}

// Datos para gráfica de balance por categoría
export interface BalanceCategoryData {
  category: string;
  income: number;
  expense: number;
  count: number;
  color?: string;
}

// Datos para gráfica circular
export interface PieChartData {
  type: string;
  value: number;
  count: number;
  [key: string]: string | number;
}

// Datos para gráfica de tendencia
export interface TrendChartData {
  month: string;
  income: number;
  expense: number;
}

// Tipos para tooltips de Recharts
export interface TooltipPayloadItem<T> {
  payload: T;
  value: number;
  name: string;
  color: string;
}

export interface RechartsTooltipProps<T> {
  active?: boolean;
  payload?: TooltipPayloadItem<T>[];
  label?: string;
}
