import { ReactNode } from 'react';
import { Socket } from 'socket.io-client';

/**
 * Tipos para contextos de React
 */

// Contexto de Socket
export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Props del SocketProvider
export interface SocketProviderProps {
  children: ReactNode;
}
