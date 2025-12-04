import { ReactNode } from 'react';
import { Transaction } from './index';

/**
 * Interfaces de props de componentes reutilizables
 */

// Layout principal
export interface MainLayoutProps {
  children: ReactNode;
}

// Layout de autenticación
export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

// Ruta protegida
export interface ProtectedRouteProps {
  children: ReactNode;
}

// Formulario de transacciones
export interface TransactionFormProps {
  transaction?: Transaction | null;
  initialType?: 'income' | 'expense';
}

// Providers del cliente
export interface ClientProvidersProps {
  children: ReactNode;
}
