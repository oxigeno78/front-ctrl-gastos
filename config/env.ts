/**
 * Configuración centralizada de variables de entorno.
 * Todas las variables de entorno del cliente deben ser accedidas desde aquí.
 * 
 * Nota: next.config.js queda excluido ya que se ejecuta en tiempo de build/servidor
 * y no puede importar este archivo.
 */

// API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1.0.0';

// Socket.IO (se deriva de API_URL removiendo el path de la API)
const SOCKET_URL = API_URL.replace('/api/v1.0.0', '');

// Notificaciones en tiempo real
const ENABLE_REALTIME_NOTIFICATIONS = process.env.NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS === 'true';

// reCAPTCHA
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

// Exportar configuración saneada
export const config = {
  api: {
    url: API_URL,
  },
  socket: {
    url: SOCKET_URL,
    enabled: ENABLE_REALTIME_NOTIFICATIONS,
  },
  recaptcha: {
    siteKey: RECAPTCHA_SITE_KEY,
    enabled: Boolean(RECAPTCHA_SITE_KEY),
  },
} as const;

// Exportar valores individuales para conveniencia
export const { api, socket, recaptcha } = config;

export default config;
