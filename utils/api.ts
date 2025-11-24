import axios, { AxiosResponse } from 'axios';
import { AuthResponse, TransactionsResponse, CreateTransactionData, TransactionFilters, ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1.0.0';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== 'undefined') { localStorage.removeItem('token'); }
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; recaptchaToken?: string }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string; recaptchaToken?: string }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },
  logout: async (data: { email: string }): Promise<{ success: boolean }> => {
    const response = await api.post('/auth/logout', data);
    return response.data;
  },
  recoveryPassword: async (data: { email: string }): Promise<{ success: boolean }> => {
    const response = await api.post('/auth/recover-password', data);
    return response.data;
  },
  resetPassword: async (data: { token: string; email: string; password: string }): Promise<{ success: boolean }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
  changePassword: async (data: { token: string; email: string; password: string }): Promise<{ success: boolean }> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
  deleteAccount: async (): Promise<{ success: boolean }> => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  },
};

// API de transacciones
export const transactionAPI = {
  getTransactions: async (filters?: TransactionFilters): Promise<TransactionsResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response: AxiosResponse<TransactionsResponse> = await api.get(
      `/transactions?${params.toString()}`
    );
    return response.data;
  },

  getTransactionById: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: string, data: CreateTransactionData): Promise<{ success: boolean; data: any }> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getMonthlyStats: async (year: number, month: number): Promise<any> => {
    const response = await api.get(`/transactions/stats/monthly?year=${year}&month=${month}`);
    return response.data;
  },
};

// API de métricas
export const metricsAPI = {
  getMetrics: async (): Promise<any> => {
    const response = await api.get('/metrics');
    return response.data;
  },
};

// Función para manejar errores de la API
export const handleApiError = (error: any): ApiError => {
  if (error.response?.data) {
    return error.response.data;
  }

  return {
    success: false,
    message: error.message || 'Error de conexión',
  };
};

export default api;
