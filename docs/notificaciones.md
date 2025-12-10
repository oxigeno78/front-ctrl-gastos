# Sistema de Notificaciones

## Características

- **Campanita en el header** con contador de no leídas
- **Dropdown** con lista de notificaciones
- **Soporte i18n** - Títulos y mensajes traducibles
- **Sincronización con backend** - Persistencia en MongoDB
- **Tiempo real opcional** - Via Socket.IO (configurable)

## Arquitectura

```
SocketContext (singleton)
    ├── Carga notificaciones no leídas al iniciar sesión
    ├── Conecta Socket.IO (si está habilitado)
    └── Escucha eventos 'notification'
            │
            ▼
NotificationStore (Zustand persistido)
    ├── notifications[]
    ├── unreadCount
    └── addNotification, markAsRead, etc.
            │
            ▼
NotificationBell (UI)
    └── useNotifications() → Sincroniza acciones con backend
```

## Configuración

```env
# Habilitar notificaciones en tiempo real (requiere Socket.IO en backend)
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
```

## API de Notificaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/notifications/:userId` | Obtener no leídas |
| PUT | `/notifications/:userId/:id` | Marcar como leída |
| PUT | `/notifications/:userId` | Marcar todas como leídas |
| DELETE | `/notifications/:userId/:id` | Eliminar notificación |

## Uso en Componentes

```tsx
import { useNotifications } from '@/hooks/useNotifications';

const MyComponent = () => {
  const { markAsReadWithSync, deleteNotificationWithSync } = useNotifications();
  
  // Las acciones se sincronizan automáticamente con el backend
  await markAsReadWithSync(notificationId);
};
```

## Componentes

### NotificationBell

Componente de campanita que muestra:
- Badge con contador de no leídas
- Dropdown con lista de notificaciones
- Acciones: marcar como leída, eliminar

### SocketContext

Contexto singleton que:
- Mantiene una única conexión Socket.IO
- Se conecta automáticamente al iniciar sesión
- Se desconecta al cerrar sesión
- Escucha eventos de notificación en tiempo real

## Flujo de Datos

```
1. Usuario inicia sesión
       │
       ▼
2. SocketContext carga notificaciones no leídas
       │
       ▼
3. Si Socket.IO está habilitado, conecta al servidor
       │
       ▼
4. Escucha eventos 'notification' del servidor
       │
       ▼
5. Actualiza NotificationStore (Zustand)
       │
       ▼
6. NotificationBell se re-renderiza con nuevas notificaciones
```

## Troubleshooting

### Las notificaciones no aparecen
- Verifica que el usuario esté autenticado
- Revisa que el backend tenga notificaciones para el usuario

### Socket.IO no conecta
- Verifica `NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true`
- Revisa que el backend tenga Socket.IO configurado
- Verifica que el token JWT sea válido

### Las notificaciones no se sincronizan
- Usa `useNotifications()` en lugar de acceder directamente al store
- Verifica la conexión con el backend
