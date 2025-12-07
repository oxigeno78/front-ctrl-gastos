'use client';

import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { Locale, localeToIntl, localeToCurrency, currencyToIntlLocale } from '@/i18n/config';
import { useAuthStore } from '@/store';

/**
 * Hook que proporciona formateadores basados en el locale y moneda del usuario.
 * Prioriza la moneda guardada en el perfil del usuario sobre la del locale.
 */
export const useFormatters = () => {
  const locale = useLocale() as Locale;
  const user = useAuthStore((state) => state.user);

  const formatters = useMemo(() => {
    // Priorizar moneda del usuario, luego la del locale, luego MXN por defecto
    const currency = user?.currency || localeToCurrency[locale] || 'MXN';
    // Usar el locale de Intl correspondiente a la moneda para formateo correcto
    const intlLocale = currencyToIntlLocale[currency] || localeToIntl[locale] || 'es-MX';

    const currencyFormatter = new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency,
    });

    const numberFormatter = new Intl.NumberFormat(intlLocale);

    const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const dateTimeFormatter = new Intl.DateTimeFormat(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      /**
       * Formatea un número como moneda según el locale actual
       */
      formatCurrency: (amount: number): string => currencyFormatter.format(amount),

      /**
       * Formatea un número según el locale actual
       */
      formatNumber: (num: number): string => numberFormatter.format(num),

      /**
       * Formatea una fecha según el locale actual
       */
      formatDate: (date: string | Date): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return dateFormatter.format(d);
      },

      /**
       * Formatea fecha y hora según el locale actual
       */
      formatDateTime: (date: string | Date): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return dateTimeFormatter.format(d);
      },

      /**
       * Locale actual de Intl (ej: 'es-MX', 'en-US')
       */
      intlLocale,

      /**
       * Moneda actual (ej: 'MXN', 'USD')
       */
      currency,
    };
  }, [locale, user?.currency]);

  return formatters;
};
