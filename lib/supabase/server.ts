import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a Supabase client for the server side
export const createServerComponentClient = () => {
  try {
    const cookieStore = cookies()

    // Check if environment variables are defined
    // Modificar para usar las variables NEXT_PUBLIC_SUPABASE_URL si no existe SUPABASE_URL
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
      return null
    }

    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}
