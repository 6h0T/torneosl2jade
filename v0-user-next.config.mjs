/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.svg'],
  },
  env: {
    // Asegúrate de que las variables de entorno estén disponibles
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Eliminamos la configuración de i18n que está causando problemas
  // i18n: {
  //   locales: ['es', 'en', 'pt'],
  //   defaultLocale: 'es',
  //   localeDetection: true,
  // },
  // Mantenemos las reescrituras para las rutas de administración
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
}

export default nextConfig
