export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
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
  transactions: Transaction[];
  pagination: Pagination;
  summary: TransactionSummary;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
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
