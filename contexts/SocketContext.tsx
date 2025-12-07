'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useAuthStore, useNotificationStore } from '@/store';
import { notificationAPI } from '@/utils/api';
import { Notification, SocketContextType, SocketProviderProps } from '@/types';
import { socket as socketConfig } from '@/config/env';

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const hasLoadedNotifications = useRef(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  // No intentar conexiones en páginas de auth
  const isAuthPage = pathname?.includes('/auth/');

  // Cargar notificaciones no leídas del backend (solo cuando hay sesión válida)
  useEffect(() => {
    const loadUnreadNotifications = async () => {
      if (!user?.id || hasLoadedNotifications.current) return;
      
      hasLoadedNotifications.current = true; // Marcar antes de la petición para evitar duplicados
      
      try {
        const response = await notificationAPI.getUnread(user.id);
        if (response.success && response.data.length > 0) {
          // Obtener las notificaciones actuales del store directamente
          const currentNotifications = useNotificationStore.getState().notifications;
          const existingIds = new Set(currentNotifications.map(n => n._id || n.id));
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
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status !== 404) {
          console.error('Error loading notifications:', error);
        }
        hasLoadedNotifications.current = false; // Permitir reintentar si falla
      }
    };

    // Solo cargar si está autenticado Y NO está en página de auth
    if (isAuthenticated && user?.id && !isAuthPage) {
      loadUnreadNotifications();
    }
  }, [isAuthenticated, user?.id, addNotification, isAuthPage]);

  // Conectar socket (solo si está habilitado)
  useEffect(() => {
    // Solo conectar si está habilitado, autenticado y no hay conexión activa
    if (!socketConfig.enabled) {
      return; // Socket.IO deshabilitado por configuración
    }

    // No conectar si estamos en página de auth
    if (isAuthPage) {
      return;
    }

    if (isAuthenticated && user?.id && !socketRef.current) {
      // console.log('🔌 Initializing socket connection...');
      
      // Con HTTP-only cookies, el socket se autentica via cookie
      // El userId se envía para que el backend pueda asociar la conexión al usuario
      // La validación real se hace con la cookie HTTP-only en el backend
      socketRef.current = io(socketConfig.url, {
        withCredentials: true, // Enviar cookies HTTP-only
        auth: { userId: user.id }, // Identificador del usuario (la cookie valida la sesión)
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        // console.log('🔔 Socket connected for notifications');
        isConnectedRef.current = true;
      });

      socketRef.current.on('notification', (notification: Notification) => {
        // console.log('📬 New notification:', notification);
        
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

      socketRef.current.on('disconnect', () => {
        isConnectedRef.current = false;
      });
    }

    // Desconectar si el usuario cierra sesión
    if (!isAuthenticated && socketRef.current) {
      // console.log('🔌 Disconnecting socket (user logged out)');
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
      hasLoadedNotifications.current = false; // Reset para próximo login
    }

    // Cleanup al desmontar el provider (refresh de página)
    return () => {
      if (socketRef.current) {
        // console.log('🔌 Cleaning up socket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
    };
  }, [isAuthenticated, user?.id, addNotification, isAuthPage]);

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current, 
      isConnected: isConnectedRef.current 
    }}>
      {children}
    </SocketContext.Provider>
  );
};
