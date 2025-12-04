'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore, useNotificationStore } from '@/store';
import { notificationAPI } from '@/utils/api';
import { Notification } from '@/types';
import { socket as socketConfig } from '@/config/env';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const hasLoadedNotifications = useRef(false);
  const { token, isAuthenticated, user } = useAuthStore();
  const { addNotification, notifications } = useNotificationStore();

  // Cargar notificaciones no leídas del backend
  useEffect(() => {
    const loadUnreadNotifications = async () => {
      if (!user?.id || hasLoadedNotifications.current) return;
      
      try {
        const response = await notificationAPI.getUnread(user.id);
        if (response.success && response.data.length > 0) {
          const existingIds = new Set(notifications.map(n => n._id || n.id));
          response.data.forEach((notification) => {
            if (notification._id && !existingIds.has(notification._id)) {
              addNotification({
                _id: notification._id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                titleKey: notification.titleKey,
                messageKey: notification.messageKey,
                messageParams: notification.messageParams,
                link: notification.link,
                createdAt: notification.createdAt,
              });
            }
          });
        }
        hasLoadedNotifications.current = true;
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status !== 404) {
          console.error('Error loading notifications:', error);
        }
      }
    };

    if (isAuthenticated && user?.id) {
      loadUnreadNotifications();
    }
  }, [isAuthenticated, user?.id, notifications, addNotification]);

  // Conectar socket (solo si está habilitado)
  useEffect(() => {
    // Solo conectar si está habilitado, autenticado y no hay conexión activa
    if (!socketConfig.enabled) {
      return; // Socket.IO deshabilitado por configuración
    }

    if (isAuthenticated && token && !socketRef.current) {
      console.log('🔌 Initializing socket connection...');
      
      socketRef.current = io(socketConfig.url, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('🔔 Socket connected for notifications');
        isConnectedRef.current = true;
      });

      socketRef.current.on('notification', (notification: Notification) => {
        console.log('📬 New notification:', notification);
        
        addNotification({
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          titleKey: notification.titleKey,
          messageKey: notification.messageKey,
          messageParams: notification.messageParams,
          link: notification.link,
          createdAt: notification.createdAt,
        });
      });

      socketRef.current.on('connect_error', (error) => {
        console.warn('⚠️ Socket connection error:', error.message);
        isConnectedRef.current = false;
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        isConnectedRef.current = false;
      });
    }

    // Desconectar si el usuario cierra sesión
    if (!isAuthenticated && socketRef.current) {
      console.log('🔌 Disconnecting socket (user logged out)');
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
      hasLoadedNotifications.current = false; // Reset para próximo login
    }

    // Cleanup al desmontar el provider (refresh de página)
    return () => {
      if (socketRef.current) {
        console.log('🔌 Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
    };
  }, [isAuthenticated, token, addNotification]);

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current, 
      isConnected: isConnectedRef.current 
    }}>
      {children}
    </SocketContext.Provider>
  );
};
