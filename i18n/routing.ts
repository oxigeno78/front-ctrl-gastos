import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Solo muestra el prefijo cuando no es el idioma por defecto
});

// Exportar helpers de navegación con soporte i18n
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
