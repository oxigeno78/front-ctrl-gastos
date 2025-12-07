import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { LocaleLayoutProps } from '@/types';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Control de Gastos - Gestión Financiera Personal',
  description: 'Aplicación para controlar ingresos y gastos personales con análisis y reportes detallados',
  keywords: ['finanzas', 'gastos', 'ingresos', 'control financiero', 'presupuesto'],
  authors: [{ name: 'Control Gastos App' }],
  robots: 'index, follow',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Control de Gastos - Gestión Financiera Personal',
    description: 'Aplicación para controlar ingresos y gastos personales con análisis y reportes detallados',
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="theme-color" content="#1890ff" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
