import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Crear un cliente de Supabase para el lado del servidor
export const createServerComponentClient = () => {
  const cookieStore = cookies()

  // Verificar que las variables de entorno estén definidas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definida")
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida")
  }

  // Crear y devolver el cliente de Supabase
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  })
}
