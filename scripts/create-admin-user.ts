// Este script es solo para referencia y debe ejecutarse manualmente en un entorno seguro
// No se ejecutará automáticamente en la aplicación

import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Credenciales del administrador
const adminEmail = "admin@lineage2torneos.com"
const adminPassword = "L2t@8b1t" // Esta es la contraseña generada de 8 caracteres

async function createAdminUser() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Error: Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")
    return
  }

  // Crear cliente de Supabase con la clave de servicio
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", adminEmail).single()

    if (existingUser) {
      console.log("El usuario administrador ya existe")
      return
    }

    // Crear el usuario administrador
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })

    if (error) {
      console.error("Error al crear el usuario administrador:", error.message)
      return
    }

    console.log("Usuario administrador creado exitosamente:", data)
  } catch (error) {
    console.error("Error inesperado:", error)
  }
}

// Ejecutar la función
createAdminUser()
