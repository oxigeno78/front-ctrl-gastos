# API Client

## Configuración

El cliente API está centralizado en `utils/api.ts` y utiliza Axios con interceptores para manejo de autenticación.

### Variables de Entorno

Todas las variables están centralizadas en `config/env.ts`:

```typescript
import { api, socket, recaptcha } from '@/config/env';

api.url           // URL de la API
socket.url        // URL del servidor Socket.IO
socket.enabled    // true/false
recaptcha.siteKey // Clave de reCAPTCHA
recaptcha.enabled // true/false
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL de la API del backend | `http://localhost:5000/api/v1.0.0` |
| `NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS` | Habilitar Socket.IO | `false` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Clave de Google reCAPTCHA v3 | (vacío = deshabilitado) |

## Endpoints Disponibles

### Autenticación (`authAPI`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Inicio de sesión |
| POST | `/auth/logout` | Cerrar sesión |
| POST | `/auth/recovery-password` | Solicitar recuperación |
| POST | `/auth/reset-password` | Restablecer contraseña |

### Transacciones (`transactionsAPI`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/transactions` | Listar transacciones |
| GET | `/transactions/:id` | Obtener transacción |
| POST | `/transactions` | Crear transacción |
| PUT | `/transactions/:id` | Actualizar transacción |
| DELETE | `/transactions/:id` | Eliminar transacción |

### Categorías (`categoriesAPI`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categories` | Listar categorías |
| POST | `/categories` | Crear categoría |
| PUT | `/categories/:id` | Actualizar categoría |
| DELETE | `/categories/:id` | Eliminar categoría |

### Usuarios (`usersAPI`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users/profile` | Obtener perfil |
| PUT | `/users/profile` | Actualizar perfil |
| PUT | `/users/password` | Cambiar contraseña |

### Stripe (`stripeAPI`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/stripe/create-checkout` | Crear sesión de pago |
| POST | `/stripe/portal` | Portal de gestión |
| GET | `/stripe/subscription` | Estado de suscripción |

## Uso en Componentes

```typescript
import { transactionsAPI, categoriesAPI } from '@/utils/api';

// Obtener transacciones
const { data } = await transactionsAPI.getAll();

// Crear transacción
await transactionsAPI.create({
  amount: 100,
  type: 'expense',
  categoryId: 'abc123',
  description: 'Compra supermercado'
});
```

## Manejo de Errores

El cliente incluye interceptores que:
- Añaden el token JWT automáticamente
- Redirigen a login en caso de 401
- Muestran notificaciones de error con Ant Design message
