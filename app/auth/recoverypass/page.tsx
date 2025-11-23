'use client';
import {useState} from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import { Form, Input, Button } from 'antd';
import { authAPI, handleApiError } from '@/utils/api';
import { message } from 'antd';


export default function RecoverypassPage() {
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            await authAPI.recoveryPassword(values);
            message.success('Se ha enviado un correo con el enlace de recuperación');
        } catch (error) {
            const apiError = handleApiError(error);
            message.error(apiError.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthLayout title="Recuperar contraseña">
            <Form
                name="recoverypass"
                layout="vertical"
                size="large"
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Por favor, ingresa tu email' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item style={{ marginBottom: '16px' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%', height: '45px' }}
                    >
                        Recuperar contraseña
                    </Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
}