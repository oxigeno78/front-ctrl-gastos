# Despliegue

## Entornos

| Entorno | Plataforma | URL | Rama |
|---------|------------|-----|------|
| **Desarrollo** | Vercel | Preview URLs automáticas | `staging`, PRs |
| **Producción** | AWS Amplify | https://www.nizerapp.net | `main` |

## Desarrollo (Vercel)

### Configuración
- Despliegue automático en cada push a `staging`
- Preview deployments para cada Pull Request
- Variables de entorno configuradas en el dashboard de Vercel

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=https://api-staging.nizerapp.net/api/v1.0.0
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
```

## Producción (AWS Amplify)

### Configuración
- Despliegue automático desde rama `main`
- Dominio personalizado: **https://www.nizerapp.net**
- SSL/TLS gestionado por AWS
- Variables de entorno configuradas en la consola de Amplify

### Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
    build:
      commands:
        - yarn build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=https://api.nizerapp.net/api/v1.0.0
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_site_key
```

## Proceso de Despliegue

### Desarrollo
```
feature/* ──▶ PR a staging ──▶ Preview en Vercel ──▶ Merge a staging
```

### Producción
```
staging ──▶ PR a main ──▶ Review ──▶ Merge ──▶ Deploy automático en Amplify
```

## Verificación Post-Despliegue

1. **Verificar la aplicación carga correctamente**
2. **Probar autenticación** (login/register)
3. **Verificar conexión con API**
4. **Probar notificaciones** (si están habilitadas)
5. **Verificar i18n** (cambio de idioma)

## Rollback

### Vercel
- Ir al dashboard de Vercel
- Seleccionar deployment anterior
- Click en "Promote to Production"

### AWS Amplify
- Ir a la consola de Amplify
- Seleccionar el build anterior
- Click en "Redeploy this version"
