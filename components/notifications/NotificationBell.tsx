'use client';

import { FC } from 'react';
import { Badge, Dropdown, Button, List, Typography, Empty, Space, Tag } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useNotificationStore } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types';
import { useRouter } from '@/i18n/routing';

const { Text, Paragraph } = Typography;

const NotificationBell: FC = () => {
  const t = useTranslations();
  const tNotif = useTranslations('notifications');
  const router = useRouter();
  const { 
    notifications, 
    unreadCount
  } = useNotificationStore();
  
  // Usar funciones sincronizadas con el backend
  const { 
    markAsReadWithSync, 
    markAllAsReadWithSync, 
    deleteNotificationWithSync,
    clearNotificationsWithSync
  } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    const iconStyle = { fontSize: '16px' };
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ ...iconStyle, color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
    }
  };

  const getTypeTag = (type: Notification['type']) => {
    const colors: Record<Notification['type'], string> = {
      info: 'blue',
      success: 'green',
      warning: 'orange',
      error: 'red',
    };
    return <Tag color={colors[type]}>{tNotif(`type.${type}`)}</Tag>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return tNotif('time.justNow');
    if (diffMins < 60) return tNotif('time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return tNotif('time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return tNotif('time.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsReadWithSync(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const dropdownContent = (
    <div style={{ 
      width: 360, 
      maxHeight: 450, 
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    }}>
      {/* Header */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text strong style={{ fontSize: 16 }}>{tNotif('title')}</Text>
        {notifications.length > 0 && (
          <Space>
            {unreadCount > 0 && (
              <Button 
                type="link" 
                size="small" 
                icon={<CheckOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsReadWithSync();
                }}
              >
                {tNotif('markAllRead')}
              </Button>
            )}
          </Space>
        )}
      </div>

      {/* Notification List */}
      <div style={{ maxHeight: 350, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={tNotif('empty')}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: notification.read ? '#fff' : '#f6ffed',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background 0.2s',
                }}
                onClick={() => handleNotificationClick(notification)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = notification.read ? '#fafafa' : '#e6f7e6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = notification.read ? '#fff' : '#f6ffed';
                }}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(notification.type)}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong={!notification.read} style={{ fontSize: 14 }}>
                        {notification.titleKey 
                          ? t(notification.titleKey, notification.messageParams) 
                          : notification.title}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotificationWithSync(notification.id);
                        }}
                        style={{ color: '#999' }}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph 
                        ellipsis={{ rows: 2 }} 
                        style={{ marginBottom: 4, color: '#666', fontSize: 13 }}
                      >
                        {notification.messageKey 
                          ? t(notification.messageKey, notification.messageParams) 
                          : notification.message}
                      </Paragraph>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {getTypeTag(notification.type)}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDate(notification.createdAt)}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{ 
          padding: '8px 16px', 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
        }}>
          <Button 
            type="link" 
            danger 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              clearNotificationsWithSync();
            }}
          >
            {tNotif('clearAll')}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      popupRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button 
        type="text" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '4px 8px',
        }}
      >
        <Badge count={unreadCount} size="small" offset={[-2, 2]}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Button>
    </Dropdown>
  );
};

export default NotificationBell;
