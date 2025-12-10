# 💰 NizerApp - Control de Gastos Personal

> Toma el control de tus finanzas personales con una aplicación moderna, intuitiva y segura.

[![Demo](https://img.shields.io/badge/🌐_Demo-nizerapp.net-blue?style=for-the-badge)](https://www.nizerapp.net)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev/)

---

## 📋 Resumen Ejecutivo

**NizerApp** es una aplicación web de finanzas personales diseñada para usuarios que buscan simplicidad sin sacrificar funcionalidad. Combina un stack moderno con prácticas de desarrollo enterprise-ready.

| Aspecto | Detalle |
|---------|--------|
| **Producto** | App de control de gastos con dashboard, reportes y notificaciones |
| **Usuarios objetivo** | Personas que quieren organizar sus finanzas sin complicaciones |
| **Diferenciador** | UX minimalista + features avanzados (i18n, real-time, suscripciones) |
| **Estado** | MVP en producción → [nizerapp.net](https://www.nizerapp.net) |
| **Modelo de negocio** | Freemium con trial de 7 días → suscripción mensual via Stripe |

---

## 🎯 El Problema

Muchas personas pierden el control de sus gastos porque las herramientas existentes son complicadas o no se adaptan a sus necesidades. **NizerApp** ofrece una solución simple pero poderosa para registrar, categorizar y visualizar tus finanzas en tiempo real.

## ✨ Características Principales

| Característica | Descripción |
|----------------|-------------|
| 📊 **Dashboard intuitivo** | Resumen financiero con métricas clave al instante |
| 💸 **Gestión de transacciones** | Registra ingresos y gastos con categorías personalizadas |
| 📈 **Reportes visuales** | Gráficas interactivas para analizar tus hábitos |
| 🔔 **Notificaciones** | Alertas en tiempo real via WebSockets (respaldado por RabbitMQ) |
| 🌐 **Multiidioma** | Español e Inglés con detección automática |
| 📱 **Responsive** | Diseño adaptado para móvil y desktop |
| 🔐 **Seguro** | Autenticación JWT con cookies HTTP-only |

## 🛠️ Tecnologías Clave y Por Qué

| Tecnología | Propósito | Por qué esta elección |
|------------|-----------|----------------------|
| **Next.js 14** | Framework React | SSR/SSG, App Router, optimización automática, SEO-friendly |
| **TypeScript** | Tipado estático | Menos bugs en producción, mejor DX, refactoring seguro |
| **Zustand** | Estado global | Más ligero que Redux, API simple, persistencia built-in |
| **Ant Design** | UI Components | Componentes enterprise-ready, consistencia visual, accesibilidad |
| **React Hook Form** | Formularios | Performance superior, validación con Yup, menos re-renders |
| **next-intl** | Internacionalización | Integración nativa con App Router, type-safe |
| **WebSockets** | Real-time | Notificaciones instantáneas (RabbitMQ en backend) |
| **MongoDB Atlas** | Base de datos | Esquema flexible, escalabilidad horizontal, managed service |
| **AWS Amplify** | Hosting producción | CI/CD integrado, SSL automático, escalabilidad |

### Stack Resumido

```
Frontend:  Next.js 14 · React 18 · TypeScript · Ant Design 5
Estado:    Zustand (persistido) · React Hook Form + Yup
Backend:   Express.js · MongoDB Atlas · RabbitMQ · WebSockets
Deploy:    Frontend → AWS Amplify | Backend → AWS Fargate
```

## 🚀 Quick Start

```bash
# Clonar e instalar
git clone <repo-url>
cd frontend
yarn install

# Configurar variables de entorno
cp env.example .env.local

# Ejecutar en desarrollo
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗺️ Roadmap

| Fase | Feature | Estado |
|------|---------|--------|
| ✅ | MVP: Dashboard, transacciones, categorías, reportes | Completado |
| ✅ | Autenticación JWT + recuperación de contraseña | Completado |
| ✅ | Internacionalización (ES/EN) | Completado |
| ✅ | Notificaciones con sincronización backend | Completado |
| ✅ | Suscripciones con Stripe | Completado |
| ✅ | Notificaciones real-time (WebSockets + RabbitMQ) | Completado |
| 🔄 | Presupuestos y alertas automáticas | En desarrollo
| 📋 | Exportación de reportes (PDF/Excel) | Planeado |
| 📋 | Multi-moneda y tasas de cambio | Planeado |
| 📋 | App móvil (React Native) Android y IO's | Futuro |


## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](./docs/arquitectura.md) | Estructura del proyecto y diagramas |
| [API Client](./docs/api.md) | Endpoints y configuración del cliente |
| [Notificaciones](./docs/notificaciones.md) | Sistema de notificaciones en tiempo real |
| [Internacionalización](./docs/i18n.md) | Configuración de idiomas |
| [Despliegue](./docs/despliegue.md) | Guía de deploy en Vercel y AWS |
| [Troubleshooting](./docs/troubleshooting.md) | Solución de problemas comunes |

## 📄 Licencia

**UNLICENSED** - Software propietario y confidencial.  
No se permite el uso, copia, modificación o distribución sin autorización expresa.

© 2025 NizerApp / Ruben Bautista Mendoza