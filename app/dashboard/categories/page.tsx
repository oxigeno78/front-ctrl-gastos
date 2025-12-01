'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Tag, message, Popconfirm, Typography, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCategories } from '@/hooks/useCategories';
import { categoryAPI, handleApiError } from '@/utils/api';
import { Category } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const { Title } = Typography;

interface CategoryFormData {
  name: string;
  transactionType: 'income' | 'expense';
  description?: string;
  color?: string | Color;
}

const CategoriesPage: React.FC = () => {
  const { categories, loading, refetch } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CategoryFormData>();

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue({
        name: category.name,
        transactionType: category.transactionType,
        description: category.description,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async (values: CategoryFormData) => {
    setSubmitting(true);
    try {
      const colorValue = typeof values.color === 'object' 
        ? (values.color as Color).toHexString() 
        : values.color;
      
      const payload = {
        name: values.name,
        transactionType: values.transactionType,
        description: values.description,
        color: colorValue?.toUpperCase(),
      };

      if (editingCategory) {
        await categoryAPI.updateCategory(editingCategory._id, payload);
        message.success('Categoría actualizada correctamente');
      } else {
        await categoryAPI.createCategory(payload);
        message.success('Categoría creada correctamente');
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryAPI.deleteCategory(id);
      message.success('Categoría eliminada correctamente');
      refetch();
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type: 'income' | 'expense') => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type === 'income' ? 'Ingreso' : 'Gasto'}
        </Tag>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <Tag color={color}>
          {color}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: unknown, record: Category) => (
        record.type === 'user' ? (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
            <Popconfirm
              title="¿Eliminar categoría?"
              description="Esta acción no se puede deshacer"
              onConfirm={() => handleDelete(record._id)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ) : (
          <Tag color="default">Sistema</Tag>
        )
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>Categorías</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
              Nueva Categoría
            </Button>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={categories}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <Modal
            title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ transactionType: 'expense' }}
            >
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input placeholder="Ej: Alimentación, Transporte..." />
              </Form.Item>

              <Form.Item
                name="transactionType"
                label="Tipo de transacción"
                rules={[{ required: true, message: 'El tipo es requerido' }]}
              >
                <Select>
                  <Select.Option value="expense">Gasto</Select.Option>
                  <Select.Option value="income">Ingreso</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Descripción"
              >
                <Input.TextArea 
                  placeholder="Descripción opcional de la categoría..." 
                  rows={2}
                />
              </Form.Item>

              <Form.Item
                name="color"
                label="Color"
              >
                <ColorPicker 
                  showText 
                  format="hex"
                  presets={[
                    {
                      label: 'Colores sugeridos',
                      colors: [
                        '#F5222D', '#FA541C', '#FA8C16', '#FAAD14', '#FADB14',
                        '#A0D911', '#52C41A', '#13C2C2', '#1890FF', '#2F54EB',
                        '#722ED1', '#EB2F96', '#8C8C8C', '#434343',
                      ],
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={handleCloseModal}>Cancelar</Button>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    {editingCategory ? 'Actualizar' : 'Crear'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CategoriesPage;
