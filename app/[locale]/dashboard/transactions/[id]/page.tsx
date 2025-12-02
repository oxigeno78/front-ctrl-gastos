'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spin, Alert } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TransactionForm from '@/components/transactions/TransactionForm';
import { transactionAPI, handleApiError } from '@/utils/api';
import { Transaction } from '@/types';

const EditTransactionPage: React.FC = () => {
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const loadTransaction = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response = await transactionAPI.getTransactionById(id);
                if (response.success) {
                    setTransaction(response.data as Transaction);
                } else {
                    setError('No se pudo cargar la transacción');
                }
            } catch (err) {
                const apiError = handleApiError(err);
                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        };

        loadTransaction();
    }, [id]);

    return (
        <ProtectedRoute>
            <MainLayout>
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                        <Spin tip="Cargando transacción..." />
                    </div>
                )}

                {!loading && error && (
                    <Alert
                        type="error"
                        message="Error al cargar la transacción"
                        description={error}
                        showIcon
                    />
                )}

                {!loading && !error && transaction && (
                    <TransactionForm transaction={transaction} />
                )}
            </MainLayout>
        </ProtectedRoute>
    );
};

export default EditTransactionPage;
