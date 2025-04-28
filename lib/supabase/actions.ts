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
    console.log(`⚠️ Iniciando getTeamsByTournament para torneo ${tournamentId}, filtro status: ${status || "ninguno"}`)
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

    console.log(`✅ getTeamsByTournament - Torneo ${tournamentId}: Encontrados ${data?.length || 0} equipos`)
    if (data && data.length > 0) {
      // Contar por status
      const countByStatus = {
        approved: data.filter(t => t.status === "approved").length,
        pending: data.filter(t => t.status === "pending").length,
        rejected: data.filter(t => t.status === "rejected").length,
        expelled: data.filter(t => t.status === "expelled").length
      }
      console.log("Distribución de equipos:", countByStatus)
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

// Función para obtener los ganadores del torneo (podio)
export async function getTournamentWinners(tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    // Obtener la información del torneo
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", tournamentId)
      .single()
    
    if (tournamentError || !tournament) {
      console.error(`Error fetching tournament ${tournamentId}:`, tournamentError)
      return null
    }
    
    // Si el torneo no está completado, no hay ganadores oficiales
    if (tournament.status !== "completed") {
      return null
    }

    // Obtener el partido final
    const { data: finalMatch, error: finalError } = await supabase
      .from("matches")
      .select(`
        *,
        winner:winner_id(id, name, tournament_id),
        team1:team1_id(id, name, tournament_id),
        team2:team2_id(id, name, tournament_id)
      `)
      .eq("tournament_id", tournamentId)
      .eq("phase", "final")
      .single()
    
    if (finalError || !finalMatch) {
      console.error(`Error fetching final match for tournament ${tournamentId}:`, finalError)
      return null
    }

    // Obtener los semifinalistas
    const { data: semiMatches, error: semiError } = await supabase
      .from("matches")
      .select(`
        *,
        team1:team1_id(id, name, tournament_id),
        team2:team2_id(id, name, tournament_id),
        winner:winner_id(id, name, tournament_id)
      `)
      .eq("tournament_id", tournamentId)
      .eq("phase", "semiFinals")
    
    if (semiError) {
      console.error(`Error fetching semifinal matches for tournament ${tournamentId}:`, semiError)
      return null
    }

    // Si es un torneo 1v1, obtener la información de los jugadores en lugar de equipos
    const is1v1 = tournament.format === "1v1"
    
    // Determinar ganador (1er lugar), subcampeón (2do lugar) y semifinalistas (3er lugar)
    const champion = finalMatch.winner || null
    
    // El subcampeón es el perdedor de la final
    const runnerUp = finalMatch.team1_id === finalMatch.winner_id
      ? finalMatch.team2
      : finalMatch.team1
    
    // Los semifinalistas son los perdedores de las semifinales
    const semifinalists = semiMatches
      ? semiMatches.map(match => {
          // El perdedor de cada semifinal
          return match.team1_id === match.winner_id
            ? match.team2
            : match.team1
        })
      : []
    
    // Si es 1v1, obtener información de jugadores
    let playerDetails = null
    if (is1v1 && champion) {
      // Obtener detalles de los jugadores en caso de torneo 1v1
      const { data: members, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .in("team_id", [
          champion.id,
          runnerUp?.id,
          ...semifinalists.map(s => s?.id)
        ].filter(Boolean))
      
      if (!membersError && members) {
        playerDetails = members.reduce((acc, member) => {
          acc[member.team_id] = member
          return acc
        }, {})
      }
    }
    
    return {
      champion,
      runnerUp,
      semifinalists,
      is1v1,
      playerDetails
    }
  } catch (error) {
    console.error(`Error fetching tournament winners:`, error)
    return null
  }
}

// Función para obtener rankings por formato de torneo
export async function getRankingsByFormat() {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return { 
        solo: [],
        duo: [],
        team: []
      }
    }

    // Obtener todos los rankings
    const { data: allRankings, error: rankingError } = await supabase
      .from("team_rankings")
      .select(`
        *,
        team:team_id(id, name, tournament_id)
      `)
      .order("points", { ascending: false })

    if (rankingError) {
      console.error("Error fetching rankings:", rankingError)
      return { 
        solo: [],
        duo: [],
        team: []
      }
    }

    // Obtener información de los torneos para saber el formato
    const tournamentIds = [...new Set(allRankings?.map(r => r.team?.tournament_id).filter(Boolean))]
    
    if (!tournamentIds.length) {
      return { 
        solo: [],
        duo: [],
        team: []
      }
    }

    const { data: tournaments, error: tournamentsError } = await supabase
      .from("tournaments")
      .select("id, format")
      .in("id", tournamentIds)

    if (tournamentsError) {
      console.error("Error fetching tournaments:", tournamentsError)
      return { 
        solo: [],
        duo: [],
        team: []
      }
    }

    // Crear un mapa de torneo a formato
    const tournamentFormats = tournaments.reduce((acc, t) => {
      acc[t.id] = t.format
      return acc
    }, {})

    // Obtener detalles de jugadores para los rankings 1v1
    const { data: teamMembers, error: membersError } = await supabase
      .from("team_members")
      .select("*")
      .in("team_id", allRankings.map(r => r.team_id))

    if (membersError) {
      console.error("Error fetching team members:", membersError)
    }

    // Crear un mapa de equipo a miembros
    const teamMembersMap = teamMembers ? teamMembers.reduce((acc, member) => {
      if (!acc[member.team_id]) {
        acc[member.team_id] = []
      }
      acc[member.team_id].push(member)
      return acc
    }, {}) : {}

    // Separar rankings por formato
    const soloRankings = []
    const duoRankings = [] 
    const teamRankings = []

    allRankings.forEach(ranking => {
      const tournamentId = ranking.team?.tournament_id
      if (!tournamentId) return

      const format = tournamentFormats[tournamentId]
      const teamMembers = teamMembersMap[ranking.team_id] || []

      if (format === "1v1") {
        // Para 1v1, usar el nombre del personaje si está disponible
        const playerName = teamMembers.length > 0 ? teamMembers[0].name : ranking.team?.name
        const characterClass = teamMembers.length > 0 ? teamMembers[0].character_class : null
        
        soloRankings.push({
          ...ranking,
          playerName,
          characterClass
        })
      } else if (format === "2v2") {
        duoRankings.push({
          ...ranking,
          members: teamMembers
        })
      } else {
        // 3v3 y otros formatos de equipo
        teamRankings.push({
          ...ranking,
          members: teamMembers
        })
      }
    })

    return {
      solo: soloRankings,
      duo: duoRankings,
      team: teamRankings
    }
  } catch (error) {
    console.error("Error obtaining rankings by format:", error)
    return { 
      solo: [],
      duo: [],
      team: []
    }
  }
}
