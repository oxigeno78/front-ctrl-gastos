import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, Transaction, TransactionSummary } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
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
      login: (user: User, token: string) => {
        Cookies.set('token', token, { expires: 7 });
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
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
