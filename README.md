# Frontend - Control de Gastos

Aplicación web desarrollada con Next.js 14, React 18, TypeScript y Ant Design para el sistema de control de gastos personal.

## 🚀 Características

- **Next.js 14** con App Router y SSR/ISR
- **React 18** con TypeScript estricto
- **Ant Design** para componentes UI
- **Zustand** para manejo de estado global
- **React Hook Form** + **Yup** para formularios y validación
- **Ant Design Charts** para gráficas y reportes
- **next-intl** para internacionalización (i18n)
- Diseño responsive y moderno
- Autenticación JWT con cookies seguras

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

El archivo `.env.local` ya está configurado para desarrollo local:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1.0.0
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
│       ├── layout.tsx        # Layout con NextIntlClientProvider
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
│       │   └── reports/
│       └── reset-password/
├── components/               # Componentes reutilizables
│   ├── LanguageSwitcher.tsx  # Selector de idioma
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   └── transactions/
│       └── TransactionForm.tsx
├── i18n/                     # Configuración de internacionalización
│   ├── config.ts             # Locales disponibles (es, en)
│   ├── request.ts            # Carga de mensajes del servidor
│   └── routing.ts            # Navegación con soporte i18n
├── messages/                 # Archivos de traducciones
│   ├── es.json               # Español (por defecto)
│   └── en.json               # Inglés
├── middleware.ts             # Middleware de detección de idioma
├── store/                    # Estado global con Zustand
│   └── index.ts
├── utils/                    # Utilidades y API client
│   ├── api.ts
│   └── helpers.ts
├── types/                    # Tipos TypeScript
│   └── index.ts
├── hooks/                    # Custom hooks
│   ├── useCategories.ts
│   └── useInvisibleRecaptcha.ts
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
- Zustand
- React Hook Form
- Yup
- Ant Design Charts
- next-intl
- Axios
- Day.js
- js-cookie

## 🌐 Internacionalización (i18n)

La aplicación soporta múltiples idiomas usando **next-intl**.

### Idiomas Disponibles
- **Español (es)** - Idioma por defecto
- **English (en)**

### Estructura de URLs
- Español (por defecto): `/dashboard`, `/auth/login`
- Inglés: `/en/dashboard`, `/en/auth/login`

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
3. Agregar label en `LanguageSwitcher.tsx`

### Selector de Idioma
El componente `LanguageSwitcher` está disponible en el header del dashboard para cambiar entre idiomas.

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
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1.0.0
```

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

### Errores de caché
- Elimina la carpeta `.next` y reinicia el servidor
```bash
rm -rf .next && yarn dev
```

### Problemas de renderizado
- Verifica que los componentes estén correctamente importados
- Revisa la configuración de Next.js
- Asegúrate de que los hooks estén siendo usados correctamente
