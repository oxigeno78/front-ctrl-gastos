'use client';

import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, DatePicker, Button, message, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { transactionAPI, handleApiError } from '@/utils/api';
import { useTransactionStore } from '@/store';
import { CreateTransactionData, Transaction } from '@/types';

const { Title } = Typography;
const { Option } = Select;

interface TransactionFormData {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: dayjs.Dayjs;
}

const transactionSchema = yup.object({
    type: yup
        .mixed<'income' | 'expense'>()
        .oneOf(['income', 'expense'], 'Selecciona un tipo válido')
        .required('El tipo es requerido'),
    amount: yup
        .number()
        .required('El monto es requerido')
        .positive('El monto debe ser mayor a 0'),
    category: yup
        .string()
        .required('La categoría es requerida')
        .max(50, 'La categoría no puede exceder 50 caracteres'),
    description: yup
        .string()
        .required('La descripción es requerida')
        .max(200, 'La descripción no puede exceder 200 caracteres'),
    date: yup
        .mixed<dayjs.Dayjs>()
        .required('La fecha es requerida'),
});

const incomeCategories = [
    'Salario', 'Freelance', 'Inversiones', 'Ventas', 'Bonificaciones', 'Otros'
];

const expenseCategories = [
    'Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud',
    'Educación', 'Ropa', 'Tecnología', 'Servicios', 'Otros'
];

interface TransactionFormProps {
    transaction?: Transaction | null;
    initialType?: 'income' | 'expense';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, initialType }) => {
    const router = useRouter();
    const { addTransaction } = useTransactionStore();
    const [loading, setLoading] = useState(false);

    const isEditMode = !!transaction;

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TransactionFormData>({
        resolver: yupResolver(transactionSchema),
        defaultValues: {
            type: transaction?.type || initialType || 'income',
            amount: transaction?.amount || 0,
            category: transaction?.category || '',
            description: transaction?.description || '',
            date: transaction ? dayjs(transaction.date) : dayjs(),
        },
    });

    const selectedType = watch('type');

    const onSubmit = async (data: TransactionFormData) => {
        setLoading(true);
        try {
            const transactionData: CreateTransactionData = {
                type: data.type,
                amount: data.amount,
                category: data.category,
                description: data.description,
                date: data.date.toISOString(),
            };

            if (isEditMode && transaction) {
                const response = await transactionAPI.updateTransaction(transaction._id, transactionData);
                if (response.success) {
                    message.success('Transacción actualizada exitosamente');
                    router.push('/dashboard');
                }
            } else {
                const response = await transactionAPI.createTransaction(transactionData);
                if (response.success) {
                    message.success('Transacción creada exitosamente');
                    addTransaction(response.data);
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            const apiError = handleApiError(error);
            message.error(apiError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
                {selectedType === 'income' ? (
                    <>
                        <ArrowUpOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                        {isEditMode ? 'Editar Ingreso' : 'Agregar Ingreso'}
                    </>
                ) : (
                    <>
                        <ArrowDownOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                        {isEditMode ? 'Editar Gasto' : 'Registrar Gasto'}
                    </>
                )}
            </Title>

            <Card>
                <Form
                    name="transaction"
                    onFinish={handleSubmit(onSubmit)}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        label="Tipo de transacción"
                        validateStatus={errors.type ? 'error' : ''}
                        help={errors.type?.message}
                    >
                        <Select
                            value={selectedType}
                            onChange={(value) => setValue('type', value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="income">
                                <ArrowUpOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                                Ingreso
                            </Option>
                            <Option value="expense">
                                <ArrowDownOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                                Gasto
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Monto"
                        validateStatus={errors.amount ? 'error' : ''}
                        help={errors.amount?.message}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            min={0}
                            step={0.01}
                            precision={2}
                            value={watch('amount')}
                            formatter={(value) => {
                                console.log(value);
                                return `$ ${value}` //.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }}
                            onChange={(value) => setValue('amount', typeof value === 'number' ? value : 0)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Categoría"
                        validateStatus={errors.category ? 'error' : ''}
                        help={errors.category?.message}
                    >
                        <Select
                            placeholder="Selecciona una categoría"
                            onChange={(value) => setValue('category', value)}
                            style={{ width: '100%' }}
                            value={watch('category')}
                        >
                            {(selectedType === 'income' ? incomeCategories : expenseCategories).map((category) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Descripción"
                        validateStatus={errors.description ? 'error' : ''}
                        help={errors.description?.message}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Describe brevemente esta transacción"
                            onChange={(e) => setValue('description', e.target.value)}
                            value={watch('description')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Fecha"
                        validateStatus={errors.date ? 'error' : ''}
                        help={errors.date?.message}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            value={watch('date')}
                            onChange={(date) => setValue('date', date || dayjs())}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ width: '100%', height: '45px' }}
                        >
                            {isEditMode
                                ? selectedType === 'income'
                                    ? 'Guardar Ingreso'
                                    : 'Guardar Gasto'
                                : selectedType === 'income'
                                    ? 'Agregar Ingreso'
                                    : 'Registrar Gasto'}
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{ width: '100%' }}
                            onClick={() => router.push('/dashboard')}
                        >
                            Cancelar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default TransactionForm;
