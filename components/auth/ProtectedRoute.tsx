'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { authAPI } from '@/utils/api';
import { ProtectedRouteProps } from '@/types';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, logout, login } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Verificar sesión con el backend usando HTTP-only cookie
    const verifySession = async () => {
      try {
        const response = await authAPI.me();
        if (response.success && response.data.user) {
          // Actualizar el store con los datos del usuario si no está autenticado
          if (!isAuthenticated) {
            const { user } = response.data;
            login(
              { id: user.id, name: user.name, email: user.email },
              '', // No hay token en el frontend con HTTP-only cookies
              user.language
            );
          }
        }
      } catch {
        // Cookie inválida o expirada, redirigir a login
        logout();
        router.push('/auth/login');
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [mounted, router, isAuthenticated, login, logout]);

  if (!mounted || checking) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
