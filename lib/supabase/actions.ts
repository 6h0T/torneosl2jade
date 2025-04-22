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
    let query = supabase.from("teams").select("*, members:team_members(*)").eq("tournament_id", tournamentId)

    // If a specific status is provided, filter by that status
    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching teams for tournament ${tournamentId}:`, error)
      return []
    }

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

    const supabase = createServerComponentClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getMatchesByTournament")
      return []
    }

    // Add more detailed logging
    console.log(`Attempting to fetch matches for tournament ${tournamentId}...`)
    console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}`)
    console.log(`Supabase Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}`)

    try {
      let query = supabase
        .from("matches")
        .select(
          `
          *,
          team1:team1_id(id, name),
          team2:team2_id(id, name),
          winner:winner_id(id, name)
        `,
        )
        .eq("tournament_id", tournamentId)

      if (phase) {
        query = query.eq("phase", phase)
      }

      const { data, error } = await query.order("match_order", { ascending: true })

      if (error) {
        console.error(`Error fetching matches for tournament ${tournamentId}:`, error)
        return []
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
      })
      .eq("id", teamId)

    if (error) {
      console.error("Error al aprobar equipo:", error)
      return {
        success: false,
        message: "Error al aprobar el equipo.",
      }
    }

    // Revalidar las páginas
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
    revalidatePath("/")

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
      })
      .eq("id", teamId)

    if (error) {
      console.error("Error al rechazar equipo:", error)
      return {
        success: false,
        message: "Error al rechazar el equipo.",
      }
    }

    // Revalidar las páginas
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

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
