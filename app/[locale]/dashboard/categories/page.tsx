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
import { useTranslations } from 'next-intl';

const { Title } = Typography;

interface CategoryFormData {
  name: string;
  transactionType: 'income' | 'expense';
  description?: string;
  color?: string | Color;
}

const CategoriesPage: React.FC = () => {
  const t = useTranslations();
  const { categories, loading, refetch } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<CategoryFormData>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue({
        name: category.name,
        transactionType: category.transactionType,
        description: category.description,
        color: category.color,
      });
      setIsFormValid(true);
    } else {
      setEditingCategory(null);
      form.resetFields();
      setIsFormValid(false);
    }
    setHasChanges(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
    setIsFormValid(false);
    setHasChanges(false);
  };

  const handleFormChange = () => {
    setHasChanges(true);
    form.validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
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
        message.success(t('categories.categoryUpdatedSuccessfully'));
      } else {
        await categoryAPI.createCategory(payload);
        message.success(t('categories.categoryCreatedSuccessfully'));
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
      message.success(t('categories.categoryDeletedSuccessfully'));
      refetch();
    } catch (error) {
      const apiError = handleApiError(error);
      message.error(apiError.message);
    }
  };

  const columns = [
    {
      title: t('categories.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('categories.transactionType'),
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type: 'income' | 'expense') => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type === 'income' ? 'Ingreso' : 'Gasto'}
        </Tag>
      ),
    },
    {
      title: t('categories.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('categories.color'),
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <Tag color={color}>
          {color}
        </Tag>
      ),
    },
    {
      title: t('categories.actions'),
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
              title={t('categories.deleteCategoryConfirmTitle')}
              description={t('categories.deleteCategoryConfirmDescription')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ) : (
          <Tag color="default">{t('categories.systemCategory')}</Tag>
        )
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>{t('categories.title')}</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
              {t('categories.newCategory')}
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
            title={editingCategory ? t('categories.editCategory') : t('categories.newCategory')}
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
              initialValues={{ transactionType: 'expense' }}
            >
              <Form.Item
                name="name"
                label={t('categories.name')}
                rules={[{ required: true, message: t('categories.nameRequired') }]}
              >
                <Input placeholder={t('categories.namePlaceholder')} />
              </Form.Item>

              <Form.Item
                name="transactionType"
                label={t('categories.transactionType')}
                rules={[{ required: true, message: t('categories.transactionTypeRequired') }]}
              >
                <Select>
                  <Select.Option value="expense">{t('common.expense')}</Select.Option>
                  <Select.Option value="income">{t('common.income')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label={t('categories.description')}
              >
                <Input.TextArea 
                  placeholder={t('categories.descriptionPlaceholder')} 
                  rows={2}
                />
              </Form.Item>

              <Form.Item
                name="color"
                label={t('categories.color')}
              >
                <ColorPicker 
                  showText 
                  format="hex"
                  presets={[
                    {
                      label: t('categories.suggestedColors'),
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
                  <Button onClick={handleCloseModal}>{t('common.cancel')}</Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting}
                    disabled={!isFormValid || (!hasChanges && !!editingCategory)}
                  >
                    {editingCategory ? t('common.update') : t('common.create')}
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
