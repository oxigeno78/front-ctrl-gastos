'use client';

import { useCallback } from 'react';
import { useAuthStore, useNotificationStore } from '@/store';
import { notificationAPI } from '@/utils/api';

/**
 * Hook para sincronizar acciones de notificaciones con el backend.
 * La carga inicial de notificaciones se hace en SocketContext.
 */
export const useNotifications = () => {
  const { user } = useAuthStore();
  const { markAsRead, markAllAsRead } = useNotificationStore();

  // Marcar como leída en el backend
  const markAsReadWithSync = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    markAsRead(notificationId);
    
    try {
      await notificationAPI.markAsRead(user.id, notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user?.id, markAsRead]);

  // Marcar todas como leídas en el backend
  const markAllAsReadWithSync = useCallback(async () => {
    if (!user?.id) return;

    markAllAsRead();
    
    try {
      await notificationAPI.markAllAsRead(user.id);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.id, markAllAsRead]);

  // Eliminar notificación en el backend
  const deleteNotificationWithSync = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    useNotificationStore.getState().removeNotification(notificationId);
    
    try {
      await notificationAPI.delete(user.id, notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [user?.id]);

  // Eliminar todas las notificaciones en el backend
  const clearNotificationsWithSync = useCallback(async () => {
    if (!user?.id) return;

    const notifications = useNotificationStore.getState().notifications;
    useNotificationStore.getState().clearNotifications();
    
    // Eliminar cada notificación en el backend
    try {
      await Promise.all(
        notifications
          .filter(n => n._id) // Solo las que tienen _id del backend
          .map(n => notificationAPI.delete(user.id, n.id))
      );
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, [user?.id]);

  return {
    markAsReadWithSync,
    markAllAsReadWithSync,
    deleteNotificationWithSync,
    clearNotificationsWithSync,
  };
};

export default useNotifications;
