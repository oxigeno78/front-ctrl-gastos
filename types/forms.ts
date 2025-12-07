import dayjs from 'dayjs';
import type { Color } from 'antd/es/color-picker';

/**
 * Interfaces de formularios reutilizables
 */

// Formulario de transacciones
export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: dayjs.Dayjs;
  periodicity: number;
  every?: string | null;
}

// Formulario de categorías (para API)
export interface CategoryFormData {
  name: string;
  transactionType: 'income' | 'expense';
  description?: string;
  color?: string;
}

// Formulario de categorías (para UI con ColorPicker)
export interface CategoryFormDataUI {
  name: string;
  transactionType: 'income' | 'expense';
  description?: string;
  color?: string | Color;
}

// Formulario de login
export interface LoginFormData {
  email: string;
  password: string;
}

// Formulario de registro (language se maneja por separado)
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Formulario de recuperación de contraseña
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}
