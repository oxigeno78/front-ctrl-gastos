'use client';

import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, DatePicker, Button, message, Typography, Switch, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SyncOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { transactionAPI, handleApiError } from '@/utils/api';
import { useTransactionStore } from '@/store';
import { CreateTransactionData, Transaction } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { useTranslations } from 'next-intl';

const { Title } = Typography;
const { Option } = Select;

interface TransactionFormData {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: dayjs.Dayjs;
    periodicity: number;
    every?: string;
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
    periodicity: yup
        .number()
        .min(0)
        .max(10)
        .default(0),
    every: yup
        .string()
        .optional(),
});

// Opciones de periodicidad según el backend
const PERIODICITY_OPTIONS = [
    { value: 0, labelKey: 'periodicityOne-time' },
    { value: 1, labelKey: 'periodicityDaily' },
    { value: 2, labelKey: 'periodicityWeekly' },
    { value: 3, labelKey: 'periodicityBiweekly' },
    { value: 4, labelKey: 'periodicityFortnightly' },
    { value: 5, labelKey: 'periodicityMonthly' },
    { value: 6, labelKey: 'periodicityBi-monthly' },
    { value: 7, labelKey: 'periodicityQuarterly' },
    { value: 8, labelKey: 'periodicitySemi-annual' },
    { value: 9, labelKey: 'periodicityYearly' },
    { value: 10, labelKey:'periodicityCustom' },
];

// Categorías por defecto (fallback si la API no retorna datos)
const defaultIncomeCategories = [
    'Salario', 'Freelance', 'Inversiones', 'Ventas', 'Bonificaciones', 'Otros'
];

const defaultExpenseCategories = [
    'Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud',
    'Educación', 'Ropa', 'Tecnología', 'Servicios', 'Otros'
];

interface TransactionFormProps {
    transaction?: Transaction | null;
    initialType?: 'income' | 'expense';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, initialType }) => {
    const t = useTranslations(); 
    const router = useRouter();
    const { addTransaction } = useTransactionStore();
    const [loading, setLoading] = useState(false);
    const { incomeCategories, expenseCategories, loading: categoriesLoading } = useCategories();

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
            periodicity: transaction?.periodicity ?? 0,
            every: transaction?.every,
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
                periodicity: data.periodicity,
                every: data.periodicity > 0 ? data.every : undefined,
            };

            if (isEditMode && transaction) {
                const response = await transactionAPI.updateTransaction(transaction._id, transactionData);
                if (response.success) {
                    message.success(t('transactions.transactionUpdatedSuccessfully'));
                    router.push('/dashboard');
                }
            } else {
                const response = await transactionAPI.createTransaction(transactionData);
                if (response.success) {
                    message.success(t('transactions.transactionCreatedSuccessfully'));
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
                        {isEditMode ? t('transactions.editIncome') : t('transactions.addIncome')}
                    </>
                ) : (
                    <>
                        <ArrowDownOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                        {isEditMode ? t('transactions.editExpense') : t('transactions.addExpense')}
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
                        label={t('transactions.transactionType')}
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
                                {t('transactions.income')}
                            </Option>
                            <Option value="expense">
                                <ArrowDownOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                                {t('transactions.expense')}
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={t('transactions.amount')}
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
                                // console.log(value);
                                return `$ ${value}` //.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }}
                            onChange={(value) => setValue('amount', typeof value === 'number' ? value : 0)}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('transactions.category')}
                        validateStatus={errors.category ? 'error' : ''}
                        help={errors.category?.message}
                    >
                        <Select
                            placeholder="Selecciona una categoría"
                            onChange={(value) => setValue('category', value)}
                            style={{ width: '100%' }}
                            value={watch('category')}
                            loading={categoriesLoading}
                            showSearch
                            optionFilterProp="children"
                        >
                            {(selectedType === 'income'
                                ? (incomeCategories.length > 0 ? incomeCategories : defaultIncomeCategories.map(name => ({ _id: name, name })))
                                : (expenseCategories.length > 0 ? expenseCategories : defaultExpenseCategories.map(name => ({ _id: name, name })))
                            ).map((category) => (
                                <Option key={typeof category === 'string' ? category : category._id} value={typeof category === 'string' ? category : category._id}>
                                    {typeof category === 'string' ? category : category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={t('transactions.description')}
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
                        label={t('transactions.date')}
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

                    <Form.Item
                        label={
                            <span>
                                <SyncOutlined style={{ marginRight: 8 }} />
                                {t('transactions.periodicity')}
                            </span>
                        }
                    >
                        <Select
                            value={watch('periodicity')}
                            onChange={(value) => {
                                setValue('periodicity', value);
                                if (value === 0) {
                                    setValue('every', undefined);
                                }
                            }}
                            style={{ width: '100%' }}
                        >
                            {PERIODICITY_OPTIONS.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {t(`transactions.${option.labelKey}`)}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {watch('periodicity') > 1 && (
                        <Form.Item
                            label={
                                <span>
                                    {t('transactions.every')}
                                    <Tooltip title={t('transactions.everyHelp')}>
                                        <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                                    </Tooltip>
                                </span>
                            }
                        >
                            <Input
                                style={{ width: '100%' }}
                                placeholder={t('transactions.everyPlaceholder')}
                                value={watch('every')}
                                onChange={(e) => setValue('every', e.target.value || undefined)}
                            />
                        </Form.Item>
                    )}

                    <Form.Item style={{ marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ width: '100%', height: '45px' }}
                        >
                            {isEditMode
                                ? selectedType === 'income'
                                    ? t('transactions.saveIncome')
                                    : t('transactions.saveExpense')
                                : selectedType === 'income'
                                    ? t('transactions.addIncome')
                                    : t('transactions.addExpense')}
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{ width: '100%' }}
                            onClick={() => router.push('/dashboard')}
                        >
                            {t('common.cancel')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default TransactionForm;
