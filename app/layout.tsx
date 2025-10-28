import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Gastos - Gestión Financiera Personal',
  description: 'Aplicación para controlar ingresos y gastos personales con análisis y reportes detallados',
  keywords: ['finanzas', 'gastos', 'ingresos', 'control financiero', 'presupuesto'],
  authors: [{ name: 'Control Gastos App' }],
  viewport: 'width=device-width, initial-scale=1',
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
