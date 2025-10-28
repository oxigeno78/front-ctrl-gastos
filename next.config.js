/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1.0.0',
  },
  
  // Configuración de compilación
  typescript: {
    // Ignorar errores de TypeScript durante el build (solo en desarrollo)
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Configuración de ESLint
  eslint: {
    // Ignorar errores de ESLint durante el build (solo en desarrollo)
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;