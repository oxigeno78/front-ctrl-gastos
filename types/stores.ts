import { User, Transaction, TransactionSummary, Notification } from './index';

/**
 * Interfaces de stores de Zustand
 */

// Store de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, language?: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setUserLanguage: (language: string) => void;
}

// Store de transacciones
export interface TransactionState {
  transactions: Transaction[];
  summary: TransactionSummary | null;
  isLoading: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  setSummary: (summary: TransactionSummary) => void;
  setLoading: (loading: boolean) => void;
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

// Store de notificaciones
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'> & { _id?: string; createdAt?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
