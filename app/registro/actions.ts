"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface TeamMember {
  name: string
  characterClass: string
}

export async function registerTeam(formData: FormData) {
  try {
    const teamName = formData.get("teamName") as string

    // Obtener datos de los miembros del equipo
    const member1Name = formData.get("member1Name") as string
    const member1Class = formData.get("member1Class") as string

    const member2Name = formData.get("member2Name") as string
    const member2Class = formData.get("member2Class") as string

    const member3Name = formData.get("member3Name") as string
    const member3Class = formData.get("member3Class") as string

    // Validar datos
    if (!teamName || !member1Name || !member2Name || !member3Name) {
      return {
        success: false,
        message: "Por favor, completa todos los campos obligatorios.",
      }
    }

    // Crear cliente de Supabase
    const supabase = createServerComponentClient()

    // Insertar equipo
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert([{ name: teamName, tournament_id: 1, status: "pending" }])
      .select()

    if (teamError) {
      console.error("Error al insertar equipo:", teamError)
      return {
        success: false,
        message: "Error al registrar el equipo. Por favor, inténtalo de nuevo.",
      }
    }

    const teamId = teamData[0].id

    // Preparar miembros del equipo
    const teamMembers = [
      { team_id: teamId, name: member1Name, character_class: member1Class },
      { team_id: teamId, name: member2Name, character_class: member2Class },
      { team_id: teamId, name: member3Name, character_class: member3Class },
    ]

    // Insertar miembros del equipo
    const { error: membersError } = await supabase.from("team_members").insert(teamMembers)

    if (membersError) {
      console.error("Error al insertar miembros:", membersError)
      // Eliminar el equipo si hubo un error al insertar los miembros
      await supabase.from("teams").delete().eq("id", teamId)

      return {
        success: false,
        message: "Error al registrar los miembros del equipo. Por favor, inténtalo de nuevo.",
      }
    }

    // Revalidar la página de torneos para mostrar el equipo actualizado
    revalidatePath("/torneos/1")
    revalidatePath("/")

    return {
      success: true,
      message: "Equipo registrado correctamente. ¡Buena suerte en el torneo!",
    }
  } catch (error) {
    console.error("Error en el registro:", error)
    return {
      success: false,
      message: "Error inesperado. Por favor, inténtalo de nuevo más tarde.",
    }
  }
}
