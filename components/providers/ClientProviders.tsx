'use client';

import { SocketProvider } from '@/contexts/SocketContext';
import { ClientProvidersProps } from '@/types';

/**
 * Wrapper para providers que necesitan ser client-side
 * Se monta una sola vez y persiste durante toda la sesión
 */
export const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
};

export default ClientProviders;
