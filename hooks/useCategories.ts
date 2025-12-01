'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { categoryAPI, handleApiError } from '@/utils/api';

interface UseCategoriesReturn {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const incomeCategories = categories.filter((cat) => cat.transactionType === 'income');
  const expenseCategories = categories.filter((cat) => cat.transactionType === 'expense');

  return {
    categories,
    incomeCategories,
    expenseCategories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

export default useCategories;
