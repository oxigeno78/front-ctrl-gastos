# Arquitectura del Frontend

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   App Router │    │  Components  │    │    Hooks     │      │
│  │  [locale]/   │───▶│   Layout/    │◀───│ useCategories│      │
│  │  dashboard/  │    │   Auth/      │    │ useNotifs    │      │
│  │  auth/       │    │   UI         │    │ useRecaptcha │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Zustand Stores (persistido)            │       │
│  │  ┌─────────────┐ ┌───────────────┐ ┌─────────────┐  │       │
│  │  │ AuthStore   │ │TransactionStore│ │NotifStore   │  │       │
│  │  │ user, token │ │ transactions  │ │ notifications│  │       │
│  │  └─────────────┘ └───────────────┘ └─────────────┘  │       │
│  └─────────────────────────────────────────────────────┘       │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                 Utils / API Client                   │       │
│  │  ┌─────────────┐ ┌───────────────┐ ┌─────────────┐  │       │
│  │  │ authAPI     │ │transactionsAPI│ │ stripeAPI   │  │       │
│  │  │ categoriesAPI│ │notificationsAPI│ │ usersAPI   │  │       │
│  │  └─────────────┘ └───────────────┘ └─────────────┘  │       │
│  └─────────────────────────────────────────────────────┘       │
│         │                                     │                 │
└─────────│─────────────────────────────────────│─────────────────┘
          │ HTTP (Axios)                        │ WebSocket
          ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  REST API: /api/v1.0.0/*          Socket.IO (notificaciones)   │
│  - Auth (JWT + HTTP-only cookies)                               │
│  - Transactions CRUD                                            │
│  - Categories CRUD                                              │
│  - Notifications                                                │
│  - Stripe (suscripciones)                                       │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Atlas                            │
└─────────────────────────────────────────────────────────────────┘
```

## Estructura del Proyecto

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
│       ├── privacy/          # Política de privacidad
│       ├── terms/            # Términos y condiciones
│       ├── subscription/     # Gestión de suscripción
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
│   │   ├── AntdConfigProvider.tsx # Configuración de Ant Design
│   │   └── ClientProviders.tsx    # Wrapper de providers client-side
│   └── transactions/
│       └── TransactionForm.tsx
├── config/                   # Configuración centralizada
│   └── env.ts                # Variables de entorno saneadas
├── contexts/                 # Contextos de React
│   └── SocketContext.tsx     # Conexión Socket.IO singleton
├── hooks/                    # Custom hooks
│   ├── useCategories.ts
│   ├── useFormatters.ts      # Formateo de moneda y fechas
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
│   ├── components.ts         # Props de componentes reutilizables
│   ├── contexts.ts           # Tipos para contextos React
│   └── reports.ts            # Tipos para reportes y gráficas
├── utils/                    # Utilidades y API client
│   ├── api.ts                # Cliente Axios + endpoints
│   └── helpers.ts
├── next.config.js            # Configuración de Next.js con next-intl
├── tsconfig.json             # Configuración de TypeScript
├── .eslintrc.json            # Configuración de ESLint
├── env.example               # Variables de entorno de ejemplo
└── package.json
```

## Flujo de Autenticación

```
Usuario ──▶ Login/Register ──▶ Backend valida ──▶ JWT en HTTP-only cookie
                                                         │
                                                         ▼
                                              AuthStore actualiza estado
                                                         │
                                                         ▼
                                              Redirección a /dashboard
```

## Flujo de Datos (Transacciones)

```
Componente ──▶ useTransactionStore() ──▶ transactionsAPI.getAll()
                      │                           │
                      │                           ▼
                      │                    Backend + MongoDB
                      │                           │
                      ◀───────────────────────────┘
                      │
                      ▼
              Re-render con datos actualizados
```

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Ant Design 5 |
| Estado | Zustand (persistido) |
| Formularios | React Hook Form + Yup |
| Gráficas | Recharts |
| i18n | next-intl |
| Real-time | Socket.IO Client |
| HTTP | Axios |
| Fechas | Day.js |
