# Frontend - Control de Gastos

Aplicación web desarrollada con Next.js 14, React 18, TypeScript y Ant Design para el sistema de control de gastos personal.

## 🚀 Características

- **Next.js 14** con App Router y SSR/ISR
- **React 18** con TypeScript estricto
- **Ant Design** para componentes UI
- **Zustand** para manejo de estado global (persistido)
- **React Hook Form** + **Yup** para formularios y validación
- **Ant Design Charts** para gráficas y reportes
- **next-intl** para internacionalización (i18n)
- **Socket.IO** para notificaciones en tiempo real (opcional)
- **Sistema de notificaciones** con sincronización backend
- Diseño responsive y moderno
- Autenticación JWT con cookies seguras
- Configuración centralizada de variables de entorno

## 📋 Requisitos Previos

- Node.js 20.19.5
- npm o yarn
- Backend API ejecutándose en puerto 5000

## 🛠️ Instalación

### 1. Instalar dependencias
```bash
yarn install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env.local
```

Edita `.env.local` con tus valores:
```env
# URL de la API del backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1.0.0

# Habilitar notificaciones en tiempo real via Socket.IO (true/false)
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=false

# Google reCAPTCHA v3 (dejar vacío para deshabilitar)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
```

### 3. Ejecutar la aplicación

#### Desarrollo
```bash
yarn dev
```

#### Producción
```bash
yarn build
yarn start
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                      # App Router de Next.js
│   ├── layout.tsx            # Root layout
│   └── [locale]/             # Rutas con soporte i18n
│       ├── layout.tsx        # Layout con providers (i18n, socket)
│       ├── page.tsx          # Página de inicio
│       ├── auth/             # Páginas de autenticación
│       │   ├── login/
│       │   ├── register/
│       │   └── recoverypass/
│       ├── dashboard/        # Páginas del dashboard
│       │   ├── page.tsx
│       │   ├── add-transaction/
│       │   ├── categories/
│       │   ├── profile/
│       │   ├── transactions/
│       │   │   ├── page.tsx      # Lista de transacciones
│       │   │   └── [id]/         # Edición de transacción
│       │   └── reports/
│       └── reset-password/
├── components/               # Componentes reutilizables
│   ├── LanguageSwitcher.tsx  # Selector de idioma
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   ├── notifications/
│   │   └── NotificationBell.tsx  # Campanita de notificaciones
│   ├── providers/
│   │   └── ClientProviders.tsx   # Wrapper de providers client-side
│   └── transactions/
│       └── TransactionForm.tsx
├── config/                   # Configuración centralizada
│   └── env.ts                # Variables de entorno saneadas
├── contexts/                 # Contextos de React
│   └── SocketContext.tsx     # Conexión Socket.IO singleton
├── hooks/                    # Custom hooks
│   ├── useCategories.ts
│   ├── useInvisibleRecaptcha.ts
│   └── useNotifications.ts   # Sincronización de notificaciones
├── i18n/                     # Configuración de internacionalización
│   ├── config.ts             # Locales disponibles (esp, eng)
│   ├── request.ts            # Carga de mensajes del servidor
│   └── routing.ts            # Navegación con soporte i18n
├── messages/                 # Archivos de traducciones
│   ├── esp.json              # Español (por defecto)
│   └── eng.json              # Inglés
├── middleware.ts             # Middleware de detección de idioma
├── store/                    # Estado global con Zustand
│   └── index.ts              # Auth, Transactions, Notifications stores
├── types/                    # Tipos TypeScript centralizados
│   ├── index.ts              # Tipos de dominio + re-exports
│   ├── forms.ts              # Interfaces de formularios
│   ├── stores.ts             # Interfaces de stores Zustand
│   └── components.ts         # Props de componentes reutilizables
├── utils/                    # Utilidades y API client
│   ├── api.ts                # Cliente Axios + endpoints
│   └── helpers.ts
├── next.config.js            # Configuración de Next.js con next-intl
├── tsconfig.json             # Configuración de TypeScript
├── .eslintrc.json            # Configuración de ESLint
├── env.example               # Variables de entorno de ejemplo
└── package.json
```

## 🔧 Scripts Disponibles

- `yarn dev` - Servidor de desarrollo Next.js
- `yarn build` - Construir para producción
- `yarn start` - Ejecutar versión de producción
- `yarn lint` - Ejecutar linter
- `yarn type-check` - Verificar tipos TypeScript

## 🎨 Tecnologías Utilizadas

- Next.js 14 (App Router)
- React 18
- TypeScript
- Ant Design 5
- Zustand (con persistencia)
- React Hook Form
- Yup
- Ant Design Charts
- next-intl
- Socket.IO Client
- Axios
- Day.js
- js-cookie

## 🌐 Internacionalización (i18n)

La aplicación soporta múltiples idiomas usando **next-intl**.

### Idiomas Disponibles
- **Español (esp)** - Idioma por defecto
- **English (eng)**

### Estructura de URLs
- Español (por defecto): `/esp/dashboard`, `/esp/auth/login`
- Inglés: `/eng/dashboard`, `/eng/auth/login`

### Uso en Componentes
```tsx
import { useTranslations } from 'next-intl';

const MyComponent = () => {
  const t = useTranslations();
  return <h1>{t('dashboard.title')}</h1>;
};
```

### Agregar Nuevo Idioma
1. Crear archivo de traducciones en `/messages/[locale].json`
2. Agregar el locale en `/i18n/config.ts`
3. Agregar label en los componentes de registro/perfil

### Idioma del Usuario
El idioma preferido del usuario se guarda en el perfil y se sincroniza con el backend. Al iniciar sesión o registrarse, la aplicación redirige automáticamente al locale correspondiente al idioma del usuario.

## 🔔 Sistema de Notificaciones

La aplicación incluye un sistema completo de notificaciones con soporte para tiempo real.

### Características
- **Campanita en el header** con contador de no leídas
- **Dropdown** con lista de notificaciones
- **Soporte i18n** - Títulos y mensajes traducibles
- **Sincronización con backend** - Persistencia en MongoDB
- **Tiempo real opcional** - Via Socket.IO (configurable)

### Arquitectura
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

### Configuración
```env
# Habilitar notificaciones en tiempo real (requiere Socket.IO en backend)
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
```

### API de Notificaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/notifications/:userId` | Obtener no leídas |
| PUT | `/notifications/:userId/:id` | Marcar como leída |
| PUT | `/notifications/:userId` | Marcar todas como leídas |
| DELETE | `/notifications/:userId/:id` | Eliminar notificación |

### Uso en Componentes
```tsx
import { useNotifications } from '@/hooks/useNotifications';

const MyComponent = () => {
  const { markAsReadWithSync, deleteNotificationWithSync } = useNotifications();
  
  // Las acciones se sincronizan automáticamente con el backend
  await markAsReadWithSync(notificationId);
};
```

## 📊 Características del Dashboard

### Páginas Principales
- **Dashboard** - Resumen financiero con métricas clave
- **Agregar Transacción** - Formulario intuitivo para ingresos y gastos
- **Categorías** - Gestión de categorías personalizadas
- **Historial** - Tabla completa con filtros y paginación
- **Reportes** - Gráficas interactivas y análisis visual
- **Perfil** - Configuración de usuario

### Funcionalidades
- **Resumen financiero** con métricas clave
- **Formulario intuitivo** para agregar transacciones
- **Gestión de categorías** personalizadas por usuario
- **Historial completo** con filtros y paginación
- **Reportes visuales** con gráficas interactivas
- **Diseño responsive** para móviles y desktop
- **Autenticación segura** con JWT y cookies
- **Soporte multiidioma** con selector de idioma

## 🔐 Autenticación

### Flujo de Autenticación
1. **Registro** - Crear nueva cuenta de usuario
2. **Login** - Iniciar sesión con credenciales
3. **Protección de rutas** - Middleware para rutas privadas
4. **Recuperación de contraseña** - Envío de email para reset
5. **Logout** - Cerrar sesión y limpiar estado

### Componentes de Autenticación
- `AuthLayout` - Layout para páginas de auth
- `ProtectedRoute` - Componente para proteger rutas
- `useAuthStore` - Store de Zustand para estado de auth

## 📈 Gráficas y Reportes

### Tipos de Gráficas
- **Gráfica de barras** - Gastos por categoría
- **Gráfica circular** - Distribución ingresos vs gastos
- **Gráfica de líneas** - Tendencia mensual

### Librerías Utilizadas
- Ant Design Charts para gráficas interactivas
- Day.js para manejo de fechas
- Utilidades personalizadas para formateo

## 🎨 Diseño y UI

### Ant Design Components
- Layout (Sider, Header, Content)
- Form, Input, Button, Card
- Table, Pagination, Select
- Charts, Statistic, Typography

### Características de Diseño
- **Colores neutros** con buena jerarquía visual
- **Padding generoso** para mejor legibilidad
- **Diseño responsive** para todos los dispositivos
- **Iconografía consistente** con Ant Design Icons

## 🔧 Configuración

### Variables de Entorno

Todas las variables de entorno están centralizadas en `config/env.ts`:

```typescript
import { api, socket, recaptcha } from '@/config/env';

api.url           // URL de la API
socket.url        // URL del servidor Socket.IO
socket.enabled    // true/false
recaptcha.siteKey // Clave de reCAPTCHA
recaptcha.enabled // true/false
```

#### Variables disponibles
| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL de la API del backend | `http://localhost:5000/api/v1.0.0` |
| `NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS` | Habilitar Socket.IO | `false` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Clave de Google reCAPTCHA v3 | (vacío = deshabilitado) |

### TypeScript
- Configuración estricta habilitada
- Paths absolutos configurados (`@/`)
- Tipos personalizados para API

### Next.js
- App Router habilitado
- Configuración de imágenes
- Variables de entorno públicas
- Plugin next-intl para i18n

## 🚀 Despliegue

### Desarrollo Local
```bash
yarn dev
```

### Producción
```bash
yarn build
yarn start
```

### Variables de Entorno para Producción
```env
NEXT_PUBLIC_API_URL=https://tu-api.com/api/v1.0.0
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu-clave-recaptcha
```

## 🆘 Solución de Problemas

### Error de conexión con API
- Verifica que el backend esté ejecutándose
- Revisa la configuración de `NEXT_PUBLIC_API_URL`
- Asegúrate de que CORS esté configurado correctamente

### Problemas de autenticación
- Verifica que las cookies estén habilitadas
- Revisa que el token JWT sea válido
- Asegúrate de que el store de Zustand esté funcionando

### Errores de compilación
- Verifica que todas las dependencias estén instaladas
- Revisa la configuración de TypeScript
- Ejecuta `yarn type-check` para ver errores específicos

### Problemas con i18n
- Verifica que el middleware esté configurado correctamente
- Revisa que los archivos de traducción existan en `/messages`
- Asegúrate de usar `useTranslations()` dentro de componentes cliente

### Problemas con notificaciones
- Verifica que `NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true` si usas Socket.IO
- Revisa que el backend tenga Socket.IO configurado
- Verifica que el token JWT sea válido para la conexión del socket
- Las notificaciones se cargan al iniciar sesión aunque Socket.IO esté deshabilitado

### Errores de caché
- Elimina la carpeta `.next` y reinicia el servidor
```bash
rm -rf .next && yarn dev
```

### Problemas de renderizado
- Verifica que los componentes estén correctamente importados
- Revisa la configuración de Next.js
- Asegúrate de que los hooks estén siendo usados correctamente
