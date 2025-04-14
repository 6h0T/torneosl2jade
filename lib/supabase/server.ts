import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Crear un cliente de Supabase para el lado del servidor
export const createServerComponentClient = () => {
  const cookieStore = cookies()

  // NOTA: Esto es solo para desarrollo local, NO para producción
  const supabaseUrl = process.env.SUPABASE_URL || "https://tu-proyecto.supabase.co"
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "tu-service-role-key"

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}
