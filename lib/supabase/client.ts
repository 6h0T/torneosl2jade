import { createClient } from "@supabase/supabase-js"

// Verificar que estamos usando las variables de entorno correctas
export const createClientComponentClient = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null
  }

  // Use fallback values if environment variables are not defined
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // If either URL or key is missing, return null instead of throwing an error
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing. Some features may not work properly.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
