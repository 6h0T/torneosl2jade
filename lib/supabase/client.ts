import { createClient } from "@supabase/supabase-js"

// Verificar que estamos usando las variables de entorno correctas
export const createClientComponentClient = () => {
  // Verificar que las variables existen
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definida en las variables de entorno")
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida en las variables de entorno")
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
