import axios, { AxiosResponse } from 'axios';
import { AuthResponse, TransactionsResponse, CreateTransactionData, TransactionFilters, ApiError, CategoriesResponse, Category, Notification, StripeCheckoutResponse, StripeSubscriptionStatusResponse } from '@/types';
import { api as apiConfig } from '@/config/env';
import { useAuthStore, useNotificationStore } from '@/store';

const API_URL = apiConfig.url;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL, // por defecto: http://localhost:5000/api/v1.0.0
  timeout: 10000,
  withCredentials: true, // Enviar/recibir cookies HTTP-only
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (la cookie se envía automáticamente con withCredentials)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Evitar ciclo infinito: solo redirigir si no estamos ya en login
      const isOnLoginPage = typeof window !== 'undefined' && 
        window.location.pathname.includes('/auth/login');
      
      if (!isOnLoginPage) {
        // Limpiar stores de Zustand ANTES de redirigir
        useAuthStore.getState().logout();
        useNotificationStore.getState().clearNotifications();
        
        // Redirigir al login
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; language?: string; recaptchaToken?: string }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string; recaptchaToken?: string }): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },
  logout: async (): Promise<{ success: boolean }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Verificar sesión actual (útil para HTTP-only cookies)
  me: async (): Promise<{ success: boolean; data: { user: { id: string; name: string; email: string; language: string; subscriptionStatus: string; subscriptionCurrentPeriodEnd: string } } }> => {
    const response = await api.get('/auth/me');
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
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
  deleteAccount: async (): Promise<{ success: boolean }> => {
    const response = await api.delete('/auth/account');
    return response.data;
  },
  updateLanguage: async (language: string): Promise<{ success: boolean }> => {
    const response = await api.put('/auth/language', { language });
    return response.data;
  },
  updateCurrency: async (currency: string): Promise<{ success: boolean }> => {
    const response = await api.put('/auth/currency', { currency });
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

// API de Categorias
export const categoryAPI = {
  getCategories: async (): Promise<CategoriesResponse> => {
    const response: AxiosResponse<CategoriesResponse> = await api.get('/categories');
    return response.data;
  },
  createCategory: async (data: { name: string; transactionType: 'income' | 'expense'; description?: string; color?: string }): Promise<{ success: boolean; data: Category }> => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id: string, data: { name: string; transactionType: 'income' | 'expense'; description?: string; color?: string }): Promise<{ success: boolean; data: Category }> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// API de notificaciones
export const notificationAPI = {
  // POST /:userId - Obtener notificaciones no leídas
  getUnread: async (userId: string): Promise<{ success: boolean; data: Notification[] }> => {
    const response = await api.post(`/notifications/${userId}`);
    return response.data;
  },

  // PUT /:userId/:_id - Marcar una notificación como leída
  markAsRead: async (userId: string, notificationId: string): Promise<{ success: boolean }> => {
    const response = await api.put(`/notifications/${userId}/${notificationId}`);
    return response.data;
  },

  // PUT /:userId - Marcar todas como leídas
  markAllAsRead: async (userId: string): Promise<{ success: boolean }> => {
    const response = await api.put(`/notifications/${userId}`);
    return response.data;
  },

  // DELETE /:userId/:_id - Eliminar una notificación
  delete: async (userId: string, notificationId: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/notifications/${userId}/${notificationId}`);
    return response.data;
  },
};

// API de Stripe
export const stripeAPI = {
  createCheckoutSession: async (userId: string): Promise<StripeCheckoutResponse> => {
    const response = await api.post('/stripe/create-checkout-session', { userId });
    return response.data;
  },

  getSubscriptionStatus: async (userId: string): Promise<StripeSubscriptionStatusResponse> => {
    const response = await api.get(`/stripe/subscription-status/${userId}`);
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
