import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  Transaction, 
  TransactionSummary,
  Notification,
  AuthState,
  TransactionState,
  NotificationState
} from '@/types';

// Store de autenticación
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string, language?: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          // Guardar idioma del usuario si viene de la API
          if (language) {
            localStorage.setItem('userLanguage', language);
          }
        }
        // Actualizar user con el idioma si viene
        const userWithLanguage = language ? { ...user, language } : user;
        set({ user: userWithLanguage, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userLanguage');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user: User) => set({ user }),
      setUserLanguage: (language: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userLanguage', language);
        }
        set((state) => ({
          user: state.user ? { ...state.user, language } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Store de transacciones
export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  summary: null,
  isLoading: false,
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  setSummary: (summary: TransactionSummary) => set({ summary }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  addTransaction: (transaction: Transaction) => 
    set((state) => ({ 
      transactions: [transaction, ...state.transactions] 
    })),
  clearTransactions: () => set({ transactions: [], summary: null }),
}));

// Store de notificaciones
export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          // Usar _id del backend como id principal, o generar uno local
          id: notification._id || crypto.randomUUID(),
          _id: notification._id,
          createdAt: notification.createdAt || new Date().toISOString(),
          read: false,
        };
        set((state) => {
          // Evitar duplicados por _id
          if (notification._id && state.notifications.some(n => n._id === notification._id)) {
            return state;
          }
          return {
            notifications: [newNotification, ...state.notifications].slice(0, 50),
            unreadCount: state.unreadCount + 1,
          };
        });
      },
      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.read) {
            return {
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          }
          return state;
        }),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount,
          };
        }),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
