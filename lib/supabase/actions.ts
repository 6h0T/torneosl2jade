"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Tournament, Team, TeamMember, TournamentRule, TournamentPrize, Match } from "@/lib/types"

// Funciones para torneos
export async function getActiveTournament(): Promise<Tournament | null> {
  try {
    const supabase = createServerComponentClient()
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching active tournament:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getTournaments(status?: string): Promise<Tournament[]> {
  try {
    const supabase = createServerComponentClient()
    let query = supabase.from("tournaments").select("*")

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tournaments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

export async function getTournamentById(id: number): Promise<Tournament | null> {
  try {
    const supabase = createServerComponentClient()
    const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching tournament with id ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getTournamentRules(tournamentId: number): Promise<TournamentRule[]> {
  try {
    const supabase = createServerComponentClient()
    const { data, error } = await supabase.from("tournament_rules").select("*").eq("tournament_id", tournamentId)

    if (error) {
      console.error(`Error fetching rules for tournament ${tournamentId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

export async function getTournamentPrizes(tournamentId: number): Promise<TournamentPrize[]> {
  try {
    const supabase = createServerComponentClient()
    const { data, error } = await supabase.from("tournament_prizes").select("*").eq("tournament_id", tournamentId)

    if (error) {
      console.error(`Error fetching prizes for tournament ${tournamentId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

// Funciones para equipos
export async function getTeamsByTournament(tournamentId: number, status?: string): Promise<Team[]> {
  try {
    const supabase = createServerComponentClient()

    // Crear una consulta básica
    let query = supabase.from("teams").select("*, members:team_members(*)").eq("tournament_id", tournamentId)

    // Si se proporciona un estado específico, filtrar por ese estado
    if (status) {
      query = query.eq("status", status)
    }

    // Ordenar por fecha de creación para mantener el orden consistente
    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching teams for tournament ${tournamentId}:`, error)
      return []
    }

    // Registrar para depuración
    console.log(`Fetched ${data?.length || 0} teams for tournament ${tournamentId}`)
    return data || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

export async function getTeamMembers(teamId: number): Promise<TeamMember[]> {
  try {
    if (!teamId) {
      console.error("Invalid team ID provided to getTeamMembers:", teamId)
      return []
    }

    // Create the Supabase client with better error handling
    const supabase = createServerComponentClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getTeamMembers")
      return []
    }

    // Add detailed logging
    console.log(`Attempting to fetch members for team ${teamId}...`)
    console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}`)
    console.log(`Supabase Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}`)

    // Use a try/catch block specifically for the fetch operation
    try {
      const { data, error } = await supabase.from("team_members").select("*").eq("team_id", teamId)

      if (error) {
        console.error(`Error fetching members for team ${teamId}:`, error)
        return []
      }

      console.log(`Successfully fetched ${data?.length || 0} members for team ${teamId}`)
      return data || []
    } catch (fetchError) {
      console.error(`Fetch error for team ${teamId}:`, fetchError)
      // Return an empty array instead of throwing an error
      return []
    }
  } catch (error) {
    console.error(`Unexpected error in getTeamMembers for team ${teamId}:`, error)
    return []
  }
}

// Funciones para partidos
export async function getMatchesByTournament(tournamentId: number, phase?: string): Promise<Match[]> {
  try {
    if (!tournamentId) {
      console.error("Invalid tournament ID provided to getMatchesByTournament:", tournamentId)
      return []
    }

    // Verificar si el torneo está en fase de registro
    const supabase = createServerComponentClient()

    // Primero verificar si hay suficientes equipos aprobados
    const { data: approvedTeams, error: teamsError } = await supabase
      .from("teams")
      .select("id")
      .eq("tournament_id", tournamentId)
      .eq("status", "approved")

    if (teamsError) {
      console.error(`Error checking approved teams for tournament ${tournamentId}:`, teamsError)
      return []
    }

    // Si no hay suficientes equipos aprobados, el torneo está en fase de registro
    if (!approvedTeams || approvedTeams.length < 2) {
      console.log(
        `Tournament ${tournamentId} is in registration phase with only ${approvedTeams?.length || 0} approved teams`,
      )
      return [] // Devolver array vacío sin intentar obtener partidos
    }

    // Verificar si la tabla matches existe
    try {
      const { error: tableCheckError } = await supabase.from("matches").select("id").limit(1)

      if (tableCheckError) {
        console.error("Error checking matches table:", tableCheckError)
        console.error("The matches table might not exist or you don't have permission to access it")
        return []
      }
    } catch (tableCheckError) {
      console.error("Error checking matches table:", tableCheckError)
      return []
    }

    // Add more detailed logging
    console.log(`Attempting to fetch matches for tournament ${tournamentId}...`)

    try {
      // Simplificar la consulta para diagnosticar problemas
      let query = supabase.from("matches").select("*").eq("tournament_id", tournamentId)

      if (phase) {
        query = query.eq("phase", phase)
      }

      const { data, error } = await query.order("match_order", { ascending: true })

      if (error) {
        console.error(`Error fetching matches for tournament ${tournamentId}:`, error)
        return []
      }

      // Si la consulta básica funciona, intentar la consulta completa con relaciones
      if (data && data.length > 0) {
        try {
          const { data: fullData, error: fullError } = await supabase
            .from("matches")
            .select(`
              *,
              team1:team1_id(id, name),
              team2:team2_id(id, name),
              winner:winner_id(id, name)
            `)
            .eq("tournament_id", tournamentId)
            .order("match_order", { ascending: true })

          if (fullError) {
            console.error(`Error fetching full match data for tournament ${tournamentId}:`, fullError)
            return data // Devolver los datos básicos si la consulta completa falla
          }

          console.log(
            `Successfully fetched ${fullData?.length || 0} matches with relations for tournament ${tournamentId}`,
          )
          return fullData || []
        } catch (fullFetchError) {
          console.error(`Error in full fetch for matches in tournament ${tournamentId}:`, fullFetchError)
          return data // Devolver los datos básicos si la consulta completa falla
        }
      }

      console.log(`Successfully fetched ${data?.length || 0} matches for tournament ${tournamentId}`)
      return data || []
    } catch (fetchError) {
      console.error(`Fetch error for matches in tournament ${tournamentId}:`, fetchError)
      return []
    }
  } catch (error) {
    console.error(`Error fetching matches for tournament ${tournamentId}:`, error)
    return []
  }
}

// Función para registrar un equipo
export async function registerTeam(formData: FormData) {
  try {
    const teamName = formData.get("teamName") as string

    // Obtener datos de los miembros del equipo
    const member1Name = formData.get("member1Name") as string
    // Usamos un valor por defecto para la clase
    const member1Class = (formData.get("member1Class") as string) || "No especificada"

    const member2Name = formData.get("member2Name") as string
    const member2Class = (formData.get("member2Class") as string) || "No especificada"

    const member3Name = formData.get("member3Name") as string
    const member3Class = (formData.get("member3Class") as string) || "No especificada"

    // Validar datos
    if (!teamName || !member1Name || !member2Name || !member3Name) {
      return {
        success: false,
        message: "Por favor, completa todos los campos obligatorios.",
      }
    }

    // Obtener el torneo activo
    const activeTournament = await getActiveTournament()
    if (!activeTournament) {
      return {
        success: false,
        message: "No hay torneos activos disponibles para registro.",
      }
    }

    // Crear cliente de Supabase
    const supabase = createServerComponentClient()

    // Verificar si ya existe un equipo con ese nombre en el torneo
    const { data: existingTeam } = await supabase
      .from("teams")
      .select("id")
      .eq("name", teamName)
      .eq("tournament_id", activeTournament.id)
      .maybeSingle()

    if (existingTeam) {
      return {
        success: false,
        message: "Ya existe un equipo con ese nombre en este torneo.",
      }
    }

    // Insertar equipo
    const countryCode = formData.get("countryCode") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const teamPhone = `${countryCode} ${phoneNumber}`

    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert([
        {
          name: teamName,
          phone: teamPhone,
          tournament_id: activeTournament.id,
          status: "pending",
          updated_at: new Date().toISOString(), // Add updated_at field
        },
      ])
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

    // Revalidar las páginas para mostrar el equipo actualizado
    revalidatePath(`/torneos/${activeTournament.id}`)
    revalidatePath("/")

    return {
      success: true,
      message: "Equipo registrado correctamente. ¡Buena suerte en el torneo!",
      tournamentId: activeTournament.id,
    }
  } catch (error) {
    console.error("Error en el registro:", error)
    return {
      success: false,
      message: "Error inesperado. Por favor, inténtalo de nuevo más tarde.",
    }
  }
}

// Modificar la función approveTeam para verificar el estado del torneo después de aprobar
export async function approveTeam(teamId: number, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()

    // Actualizar el estado del equipo a "approved"
    const { error } = await supabase
      .from("teams")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(), // Add updated_at field
      })
      .eq("id", teamId)

    if (error) {
      console.error("Error al aprobar equipo:", error)
      return {
        success: false,
        message: "Error al aprobar el equipo.",
      }
    }

    // Revalidar las páginas con opciones más agresivas
    try {
      revalidatePath(`/torneos/${tournamentId}`, "page")
      revalidatePath(`/admin/torneos/${tournamentId}`, "page")
      revalidatePath(`/`, "page")
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError)
    }

    return {
      success: true,
      message: "Equipo aprobado correctamente.",
    }
  } catch (error) {
    console.error("Error al aprobar equipo:", error)
    return {
      success: false,
      message: "Error inesperado al aprobar el equipo.",
    }
  }
}

// Función para rechazar un equipo
export async function rejectTeam(teamId: number, reason: string, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()

    // Actualizar el estado del equipo a "rejected"
    const { error } = await supabase
      .from("teams")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejection_reason: reason || "No se proporcionó motivo",
        updated_at: new Date().toISOString(), // Add updated_at field
      })
      .eq("id", teamId)

    if (error) {
      console.error("Error al rechazar equipo:", error)
      return {
        success: false,
        message: "Error al rechazar el equipo.",
      }
    }

    // Revalidar las páginas con opciones más agresivas
    try {
      revalidatePath(`/torneos/${tournamentId}`, "page")
      revalidatePath(`/admin/torneos/${tournamentId}`, "page")
      revalidatePath(`/`, "page")
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError)
    }

    return {
      success: true,
      message: "Equipo rechazado correctamente.",
    }
  } catch (error) {
    console.error("Error al rechazar equipo:", error)
    return {
      success: false,
      message: "Error inesperado al rechazar el equipo.",
    }
  }
}

// Función para cambiar el estado de un equipo (para usar en TeamStatusChanger)
export async function changeTeamStatus(teamId: number, newStatus: string, reason = "", tournamentId: number) {
  try {
    console.log(`Changing team ${teamId} status to ${newStatus} with reason: ${reason}`)

    const supabase = createServerComponentClient()

    // Preparar los datos de actualización
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    }

    // Añadir campos adicionales según el nuevo estado
    if (newStatus === "approved") {
      updateData.approved_at = new Date().toISOString()
      updateData.rejected_at = null
      updateData.rejection_reason = null
    } else if (newStatus === "rejected" || newStatus === "expelled") {
      updateData.rejected_at = new Date().toISOString()
      updateData.rejection_reason = newStatus === "expelled" ? `[Expulsado] ${reason}` : reason
      updateData.approved_at = null
    } else if (newStatus === "pending") {
      updateData.approved_at = null
      updateData.rejected_at = null
      updateData.rejection_reason = null
    }

    console.log("Update data:", updateData)

    // Actualizar el estado del equipo
    const { data, error } = await supabase.from("teams").update(updateData).eq("id", teamId).select()

    if (error) {
      console.error(`Error changing team ${teamId} status to ${newStatus}:`, error)
      return {
        success: false,
        message: `Error al cambiar el estado del equipo a ${newStatus}.`,
        error: error,
      }
    }

    console.log(`Successfully changed team ${teamId} status to ${newStatus}. Response:`, data)

    // Revalidar las páginas con opciones más agresivas
    try {
      revalidatePath(`/torneos/${tournamentId}`, "page")
      revalidatePath(`/admin/torneos/${tournamentId}`, "page")
      revalidatePath(`/`, "page")
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError)
    }

    return {
      success: true,
      message: `Estado del equipo cambiado a ${newStatus} correctamente.`,
      data: data,
    }
  } catch (error) {
    console.error(`Error changing team ${teamId} status to ${newStatus}:`, error)
    return {
      success: false,
      message: `Error inesperado al cambiar el estado del equipo a ${newStatus}.`,
      error: error,
    }
  }
}
