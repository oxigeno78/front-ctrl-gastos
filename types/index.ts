export interface User {
  id: string;
  name: string;
  email: string;
  language?: string;
}

export interface Category {
  _id: string;
  name: string;
  type: 'user';
  transactionType: 'income' | 'expense';
  description?: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  periodicity?: number; // 0=disabled, 1=daily, 2=weekly, 3=biweekly, 4=fortnightly, 5=bi-monthly, 6=monthly, 7=bimonthly, 8=quarterly, 9=semi-annual, 10=yearly
  every?: string; // day of week (lunes-domingo) or day of month (1-31)
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TransactionsResponse {
  data: TransactionData;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    language?: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface CreateTransactionData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date?: string;
  periodicity?: number; // 0=disabled, 1=daily, 2=weekly, 3=biweekly, 4=fortnightly, 5=bi-monthly, 6=monthly, 7=bimonthly, 8=quarterly, 9=semi-annual, 10=yearly
  every?: string; // day of week (lunes-domingo) or day of month (1-31)
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface TransactionData {
  transactions: Transaction[];
  pagination: Pagination;
  summary: TransactionSummary;
}

export interface Notification {
  id: string; // ID local (generado por el store)
  _id?: string; // MongoDB ID del backend
  userId?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  // Claves de traducción (i18n)
  titleKey?: string;
  messageKey?: string;
  messageParams?: Record<string, string | number>;
  // Texto directo (fallback)
  title?: string;
  message?: string;
  link?: string;
  read: boolean;
  deleted?: boolean;
  createdAt: string;
}

// Re-exportar tipos organizados
export * from './forms';
export * from './stores';
export * from './components';