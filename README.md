# Frontend - Control de Gastos

Aplicación web desarrollada con Next.js 14, React 18, TypeScript y Ant Design para el sistema de control de gastos personal.

## 🚀 Características

- **Next.js 14** con App Router y SSR/ISR
- **React 18** con TypeScript estricto
- **Ant Design** para componentes UI
- **Zustand** para manejo de estado global
- **React Hook Form** + **Yup** para formularios y validación
- **Ant Design Charts** para gráficas y reportes
- Diseño responsive y moderno
- Autenticación JWT con cookies seguras

## 📋 Requisitos Previos

- Node.js 20.19.5
- npm o yarn
- Backend API ejecutándose en puerto 5000

## 🛠️ Instalación

### 1. Instalar dependencias
```bash
npm install
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
npm run dev
```

#### Producción
```bash
npm run build
npm start
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                 # App Router de Next.js
│   ├── auth/            # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/       # Páginas del dashboard
│   │   ├── page.tsx
│   │   ├── add-transaction/
│   │   ├── transactions/
│   │   └── reports/
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página de inicio
├── components/          # Componentes reutilizables
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   └── transactions/
├── store/              # Estado global con Zustand
│   └── index.ts
├── utils/              # Utilidades y API client
│   ├── api.ts
│   └── helpers.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── hooks/              # Custom hooks
├── next.config.js      # Configuración de Next.js
├── tsconfig.json       # Configuración de TypeScript
├── .eslintrc.json      # Configuración de ESLint
├── env.example         # Variables de entorno de ejemplo
└── package.json
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo Next.js
- `npm run build` - Construir para producción
- `npm start` - Ejecutar versión de producción
- `npm run lint` - Ejecutar linter
- `npm run type-check` - Verificar tipos TypeScript

## 🎨 Tecnologías Utilizadas

- Next.js 14 (App Router)
- React 18
- TypeScript
- Ant Design
- Zustand
- React Hook Form
- Yup
- Ant Design Charts
- Axios
- Day.js
- js-cookie

## 📊 Características del Dashboard

### Páginas Principales
- **Dashboard** - Resumen financiero con métricas clave
- **Agregar Transacción** - Formulario intuitivo para ingresos y gastos
- **Historial** - Tabla completa con filtros y paginación
- **Reportes** - Gráficas interactivas y análisis visual

### Funcionalidades
- **Resumen financiero** con métricas clave
- **Formulario intuitivo** para agregar transacciones
- **Historial completo** con filtros y paginación
- **Reportes visuales** con gráficas interactivas
- **Diseño responsive** para móviles y desktop
- **Autenticación segura** con JWT y cookies

## 🔐 Autenticación

### Flujo de Autenticación
1. **Registro** - Crear nueva cuenta de usuario
2. **Login** - Iniciar sesión con credenciales
3. **Protección de rutas** - Middleware para rutas privadas
4. **Logout** - Cerrar sesión y limpiar estado

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
- Paths absolutos configurados
- Tipos personalizados para API

### Next.js
- App Router habilitado
- Configuración de imágenes
- Variables de entorno públicas

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
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
- Ejecuta `npm run type-check` para ver errores específicos

### Problemas de renderizado
- Verifica que los componentes estén correctamente importados
- Revisa la configuración de Next.js
- Asegúrate de que los hooks estén siendo usados correctamente
