'use client';

import { SocketProvider } from '@/contexts/SocketContext';
import { AntdConfigProvider } from '@/components/providers/AntdConfigProvider';
import { ClientProvidersProps } from '@/types';

/**
 * Wrapper para providers que necesitan ser client-side
 * Se monta una sola vez y persiste durante toda la sesión
 */
export const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <AntdConfigProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AntdConfigProvider>
  );
};

export default ClientProviders;
