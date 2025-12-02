import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Transaction, TransactionSummary } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, language?: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setUserLanguage: (language: string) => void;
}

interface TransactionState {
  transactions: Transaction[];
  summary: TransactionSummary | null;
  isLoading: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  setSummary: (summary: TransactionSummary) => void;
  setLoading: (loading: boolean) => void;
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

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
