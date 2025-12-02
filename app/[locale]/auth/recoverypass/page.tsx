'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import AuthLayout from '@/components/layout/AuthLayout';
import { authAPI, handleApiError } from '@/utils/api';

export default function RecoverypassPage() {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            await authAPI.recoveryPassword(values);
            message.success(t('auth.recovery.success'));
        } catch (error) {
            const apiError = handleApiError(error);
            message.error(apiError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title={t('auth.recovery.title')}>
            <Form
                name="recoverypass"
                layout="vertical"
                size="large"
                onFinish={onSubmit}
            >
                <Form.Item
                    label={t('auth.recovery.email')}
                    name="email"
                    rules={[{ required: true, message: t('auth.recovery.emailRequired') }]}
                >
                    <Input 
                        prefix={<MailOutlined />}
                        placeholder={t('auth.recovery.emailPlaceholder')}
                    />
                </Form.Item>
                <Form.Item style={{ marginBottom: '16px' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%', height: '45px' }}
                    >
                        {t('auth.recovery.submit')}
                    </Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
}