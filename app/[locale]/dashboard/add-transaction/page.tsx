'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TransactionForm from '@/components/transactions/TransactionForm';

const AddTransactionPage: React.FC = () => {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const initialType = (typeParam === 'income' || typeParam === 'expense')
    ? typeParam
    : undefined;

  return (
    <ProtectedRoute>
      <MainLayout>
        <TransactionForm initialType={initialType} />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AddTransactionPage;
