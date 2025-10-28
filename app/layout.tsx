import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Control de Gastos - Gestión Financiera Personal',
  description: 'Aplicación para controlar ingresos y gastos personales con análisis y reportes detallados',
  keywords: ['finanzas', 'gastos', 'ingresos', 'control financiero', 'presupuesto'],
  authors: [{ name: 'Control Gastos App' }],
  robots: 'index, follow',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1890ff" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}