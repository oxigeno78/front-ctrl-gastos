import dayjs from 'dayjs';

// Formatear moneda
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

// Formatear fecha y hora
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

// Obtener fecha actual en formato ISO
export const getCurrentDateISO = (): string => {
  return dayjs().toISOString();
};

// Obtener primer día del mes
export const getFirstDayOfMonth = (date?: Date): string => {
  return dayjs(date).startOf('month').toISOString();
};

// Obtener último día del mes
export const getLastDayOfMonth = (date?: Date): string => {
  return dayjs(date).endOf('month').toISOString();
};

// Calcular diferencia en días
// TODO: Función disponible pero no usada actualmente
export const getDaysDifference = (date1: string | Date, date2: string | Date): number => {
  return dayjs(date1).diff(dayjs(date2), 'day');
};

// Validar si una fecha es válida
// TODO: Función disponible pero no usada actualmente
export const isValidDate = (date: string | Date): boolean => {
  return dayjs(date).isValid();
};

// Obtener meses del año
export const getMonths = () => {
  return [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
};

// Obtener nombre del mes
export const getMonthName = (month: number): string => {
  const months = getMonths();
  return months[month - 1] || '';
};

// Generar colores para gráficas
export const generateColors = (count: number): string[] => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa541c', '#2f54eb', '#52c41a'
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

// Truncar texto
// TODO: Función disponible pero no usada actualmente
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primera letra
// TODO: Función disponible pero no usada actualmente
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Generar ID único simple
// TODO: Función disponible pero no usada actualmente - considerar usar crypto.randomUUID()
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
