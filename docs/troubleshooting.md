# Solución de Problemas

## Errores Comunes

### Error de conexión con API

**Síntomas:** La aplicación no carga datos, errores de red en consola.

**Soluciones:**
1. Verifica que el backend esté ejecutándose
2. Revisa la configuración de `NEXT_PUBLIC_API_URL`
3. Asegúrate de que CORS esté configurado correctamente en el backend

```bash
# Verificar que el backend responde
curl http://localhost:5000/api/v1.0.0/health
```

### Problemas de autenticación

**Síntomas:** No se puede iniciar sesión, redirecciones inesperadas.

**Soluciones:**
1. Verifica que las cookies estén habilitadas en el navegador
2. Revisa que el token JWT sea válido (no expirado)
3. Limpia el localStorage y cookies del dominio
4. Verifica que el store de Zustand esté funcionando

```javascript
// En la consola del navegador
localStorage.clear();
document.cookie.split(";").forEach(c => document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
```

### Errores de compilación

**Síntomas:** `yarn build` falla, errores de TypeScript.

**Soluciones:**
1. Verifica que todas las dependencias estén instaladas
2. Revisa la configuración de TypeScript
3. Ejecuta verificación de tipos

```bash
yarn type-check
```

### Problemas con i18n

**Síntomas:** Textos no traducidos, errores de middleware.

**Soluciones:**
1. Verifica que el middleware esté configurado correctamente
2. Revisa que los archivos de traducción existan en `/messages`
3. Asegúrate de usar `useTranslations()` dentro de componentes cliente

```bash
# Verificar archivos de traducción
ls -la messages/
```

### Problemas con notificaciones

**Síntomas:** La campanita no muestra notificaciones, no hay tiempo real.

**Soluciones:**
1. Verifica `NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true` si usas Socket.IO
2. Revisa que el backend tenga Socket.IO configurado
3. Verifica que el token JWT sea válido para la conexión del socket
4. Las notificaciones se cargan al iniciar sesión aunque Socket.IO esté deshabilitado

### Errores de caché

**Síntomas:** Cambios no se reflejan, comportamiento inconsistente.

**Solución:**
```bash
rm -rf .next && yarn dev
```

### Problemas de renderizado

**Síntomas:** Componentes no aparecen, errores de hidratación.

**Soluciones:**
1. Verifica que los componentes estén correctamente importados
2. Revisa la configuración de Next.js
3. Asegúrate de que los hooks estén siendo usados correctamente
4. Verifica que no haya mismatch entre servidor y cliente

## Comandos Útiles

```bash
# Limpiar caché y reinstalar
rm -rf .next node_modules && yarn install && yarn dev

# Verificar tipos
yarn type-check

# Ejecutar linter
yarn lint

# Build de producción local
yarn build && yarn start
```

## Logs y Debugging

### Habilitar logs de desarrollo
```typescript
// En cualquier componente
console.log('Debug:', { variable });
```

### Inspeccionar estado de Zustand
```javascript
// En la consola del navegador
JSON.parse(localStorage.getItem('auth-storage'))
JSON.parse(localStorage.getItem('transaction-storage'))
JSON.parse(localStorage.getItem('notification-storage'))
```

### Verificar conexión Socket.IO
```javascript
// En la consola del navegador
// Si el socket está conectado, verás el ID
window.__SOCKET_DEBUG__ // (si está implementado)
```
