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
    const supabase = createServerComponentClient()
    const { data, error } = await supabase.from("team_members").select("*").eq("team_id", teamId)

    if (error) {
      console.error(`Error fetching members for team ${teamId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

// Funciones para partidos
export async function getMatchesByTournament(tournamentId: number, phase?: string): Promise<Match[]> {
  try {
    const supabase = createServerComponentClient()
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

    return data || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

// Función para registrar un equipo
export async function registerTeam(formData: FormData) {
  try {
    const teamName = formData.get("teamName") as string

    // Obtener el torneo activo
    const activeTournament = await getActiveTournament()
    if (!activeTournament) {
      return {
        success: false,
        message: "No hay torneos activos disponibles para registro.",
      }
    }

    // Verificar si las inscripciones están abiertas
    if (activeTournament.registration_status === "closed") {
      return {
        success: false,
        message: "Las inscripciones para este torneo están cerradas.",
      }
    }

    // Verificar si el torneo está lleno
    const supabase = createServerComponentClient()
    if (!supabase) {
      return {
        success: false,
        message: "Error de conexión con la base de datos. Por favor, inténtalo de nuevo.",
      }
    }

    // Contar equipos aprobados
    const { data: approvedTeams, error: countError } = await supabase
      .from("teams")
      .select("id")
      .eq("tournament_id", activeTournament.id)
      .eq("status", "approved")

    if (countError) {
      console.error("Error al verificar cupo:", countError)
      // No interrumpimos el registro si falla la verificación
    } else if (approvedTeams && approvedTeams.length >= activeTournament.max_participants) {
      return {
        success: false,
        message: "Lo sentimos, el torneo ya está lleno. No se pueden aceptar más registros.",
      }
    }

    // Obtener datos de los miembros del equipo según el tipo de torneo
    const member1Name = formData.get("member1Name") as string
    const member1Class = (formData.get("member1Class") as string) || "No especificada"

    // Si es torneo 3v3 (o si el ID del torneo es 1), obtener los otros dos miembros
    let teamMembers = [
      { name: member1Name, character_class: member1Class }
    ]

    if (activeTournament.type === "3v3" || activeTournament.id === 1) {
      const member2Name = formData.get("member2Name") as string
      const member2Class = (formData.get("member2Class") as string) || "No especificada"
      const member3Name = formData.get("member3Name") as string
      const member3Class = (formData.get("member3Class") as string) || "No especificada"

      // Validar datos para 3v3
      if (!teamName || !member1Name || !member2Name || !member3Name) {
        return {
          success: false,
          message: "Por favor, completa todos los campos obligatorios.",
        }
      }

      teamMembers.push(
        { name: member2Name, character_class: member2Class },
        { name: member3Name, character_class: member3Class }
      )
    } else {
      // Validar datos para 1v1
      if (!teamName || !member1Name) {
        return {
          success: false,
          message: "Por favor, completa todos los campos obligatorios.",
        }
      }
    }

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
      .insert([{ name: teamName, phone: teamPhone, tournament_id: activeTournament.id, status: "pending" }])
      .select()

    if (teamError) {
      console.error("Error al insertar equipo:", teamError)
      return {
        success: false,
        message: "Error al registrar el equipo. Por favor, inténtalo de nuevo.",
      }
    }

    const teamId = teamData[0].id

    // Preparar miembros del equipo con team_id
    const membersToInsert = teamMembers.map(member => ({
      team_id: teamId,
      name: member.name,
      character_class: member.character_class
    }))

    // Insertar miembros del equipo
    const { error: membersError } = await supabase.from("team_members").insert(membersToInsert)

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
