"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Match } from "@/lib/types"

// Función para crear un nuevo torneo
export async function createTournament(data: {
  title: string
  description: string
  dateRange: string
  prize: string
  format: string
  mode: string
  maxParticipants: number
  status: string
  featured: boolean
  registrationType: string
  prizes: Array<{
    position: string
    reward: string
    icon: string
    color: string
  }>
  rules: Array<{
    rule: string
    category?: string
  }>
  htmlRules?: string // New parameter for HTML rules
}) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Insertar el torneo
    const { data: tournamentData, error: tournamentError } = await supabase
      .from("tournaments")
      .insert([
        {
          title: data.title,
          description: data.description,
          date_range: data.dateRange,
          prize: data.prize,
          format: data.format,
          mode: data.mode,
          max_participants: data.maxParticipants,
          status: data.status,
          featured: data.featured,
          registration_type: data.registrationType,
          html_rules: data.htmlRules || null, // Store HTML rules
        },
      ])
      .select()

    if (tournamentError) {
      console.error("Error creating tournament:", tournamentError)
      return {
        success: false,
        message: "Error al crear el torneo: " + tournamentError.message,
      }
    }

    const tournamentId = tournamentData[0].id

    // 2. Insertar los premios
    if (data.prizes && data.prizes.length > 0) {
      const prizesToInsert = data.prizes.map((prize) => ({
        tournament_id: tournamentId,
        position: prize.position,
        reward: prize.reward,
        icon: prize.icon,
        color: prize.color,
      }))

      const { error: prizesError } = await supabase.from("tournament_prizes").insert(prizesToInsert)

      if (prizesError) {
        console.error("Error creating prizes:", prizesError)
        // No abortamos la operación si falla la inserción de premios
      }
    }

    // 3. Insertar las reglas
    if (data.rules && data.rules.length > 0 && !data.htmlRules) {
      const rulesToInsert = data.rules.map((rule) => ({
        tournament_id: tournamentId,
        rule: rule.rule,
        category: rule.category || "Reglas Generales",
      }))

      const { error: rulesError } = await supabase.from("tournament_rules").insert(rulesToInsert)

      if (rulesError) {
        console.error("Error creating rules:", rulesError)
        // No abortamos la operación si falla la inserción de reglas
      }
    }

    // 4. Revalidar las rutas necesarias
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/torneos/${tournamentId}`)

    return {
      success: true,
      message: "Torneo creado exitosamente",
      tournamentId,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al crear el torneo",
    }
  }
}

// Función para actualizar un torneo existente
export async function updateTournament(data: {
  id: number
  title: string
  description: string
  dateRange: string
  prize: string
  format: string
  mode: string
  maxParticipants: number
  status: string
  featured: boolean
  registrationType: string
  prizes: Array<{
    id?: number
    position: string
    reward: string
    icon: string
    color: string
  }>
  rules: Array<{
    id?: number
    rule: string
    category?: string
  }>
  htmlRules?: string // New parameter for HTML rules
}) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Actualizar el torneo
    const { error: tournamentError } = await supabase
      .from("tournaments")
      .update({
        title: data.title,
        description: data.description,
        date_range: data.dateRange,
        prize: data.prize,
        format: data.format,
        mode: data.mode,
        max_participants: data.maxParticipants,
        status: data.status,
        featured: data.featured,
        registration_type: data.registrationType,
        html_rules: data.htmlRules || null, // Update HTML rules
      })
      .eq("id", data.id)

    if (tournamentError) {
      console.error("Error updating tournament:", tournamentError)
      return {
        success: false,
        message: "Error al actualizar el torneo: " + tournamentError.message,
      }
    }

    // 2. Eliminar los premios existentes
    const { error: deletePrizesError } = await supabase.from("tournament_prizes").delete().eq("tournament_id", data.id)

    if (deletePrizesError) {
      console.error("Error deleting prizes:", deletePrizesError)
      // No abortamos la operación si falla la eliminación de premios
    }

    // 3. Eliminar las reglas existentes
    const { error: deleteRulesError } = await supabase.from("tournament_rules").delete().eq("tournament_id", data.id)

    if (deleteRulesError) {
      console.error("Error deleting rules:", deleteRulesError)
      // No abortamos la operación si falla la eliminación de reglas
    }

    // 4. Insertar los nuevos premios
    if (data.prizes && data.prizes.length > 0) {
      const prizesToInsert = data.prizes.map((prize) => ({
        tournament_id: data.id,
        position: prize.position,
        reward: prize.reward,
        icon: prize.icon,
        color: prize.color,
      }))

      const { error: prizesError } = await supabase.from("tournament_prizes").insert(prizesToInsert)

      if (prizesError) {
        console.error("Error creating prizes:", prizesError)
        // No abortamos la operación si falla la inserción de premios
      }
    }

    // 5. Insertar las nuevas reglas (solo si no se usan reglas HTML)
    if (data.rules && data.rules.length > 0 && !data.htmlRules) {
      const rulesToInsert = data.rules.map((rule) => ({
        tournament_id: data.id,
        rule: rule.rule,
        category: rule.category || "Reglas Generales",
      }))

      const { error: rulesError } = await supabase.from("tournament_rules").insert(rulesToInsert)

      if (rulesError) {
        console.error("Error creating rules:", rulesError)
        // No abortamos la operación si falla la inserción de reglas
      }
    }

    // 6. Revalidar las rutas necesarias
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/torneos/${data.id}`)
    revalidatePath(`/admin/torneos/${data.id}`)
    revalidatePath(`/admin/torneos/editar/${data.id}`)

    return {
      success: true,
      message: "Torneo actualizado exitosamente",
      tournamentId: data.id,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al actualizar el torneo",
    }
  }
}

// Función para generar los partidos iniciales del torneo
export async function generateInitialBracket(
  tournamentId: number,
  phaseType: 'swiss' | 'elimination',
  round: string
) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Obtener todos los equipos aprobados para el torneo
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("*")
      .eq("tournament_id", tournamentId)
      .eq("status", "approved")
      .order("created_at", { ascending: true })

    if (teamsError) {
      console.error("Error al obtener equipos:", teamsError)
      return {
        success: false,
        message: "Error al obtener los equipos del torneo.",
      }
    }

    if (!teams || teams.length < 2) {
      return {
        success: false,
        message: "Se necesitan al menos 2 equipos aprobados para generar el bracket.",
      }
    }

    // 2. Verificar si ya existen partidos para este torneo y fase
    const { data: existingMatches, error: matchesError } = await supabase
      .from("matches")
      .select("id")
      .eq("tournament_id", tournamentId)
      .eq("phase_type", phaseType)
      .eq(phaseType === 'swiss' ? 'swiss_round' : 'phase', round)

    if (matchesError) {
      console.error("Error al verificar partidos existentes:", matchesError)
      return {
        success: false,
        message: "Error al verificar si ya existen partidos para esta fase.",
      }
    }

    if (existingMatches && existingMatches.length > 0) {
      return {
        success: false,
        message: "Ya existen partidos para esta fase y ronda. Elimínalos primero si deseas regenerarlos.",
      }
    }

    // 3. Generar los partidos según el tipo de fase
    const matches: any[] = []
    let matchOrder = 1

    if (phaseType === 'swiss') {
      // Generar partidos para fase suiza
      const swissRound = parseInt(round)
      const numMatches = Math.floor(teams.length / 2)

      for (let i = 0; i < numMatches; i++) {
      matches.push({
        tournament_id: tournamentId,
          phase_type: 'swiss',
          swiss_round: swissRound,
        match_order: matchOrder++,
          team1_id: teams[i * 2]?.id || null,
          team2_id: teams[i * 2 + 1]?.id || null,
        status: "pending",
          match_date: new Date(Date.now() + swissRound * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })
    }
    } else {
      // Lógica existente para fase de eliminación
      // ... (mantener el código existente para las fases de eliminación)
    }

    // 4. Insertar los partidos en la base de datos
    const { error: insertError } = await supabase.from("matches").insert(matches)

    if (insertError) {
      console.error("Error al insertar partidos:", insertError)
      return {
        success: false,
        message: "Error al generar los partidos del torneo.",
      }
    }

    // 5. Revalidar la página del torneo
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

    return {
      success: true,
      message: "Partidos generados correctamente.",
    }
  } catch (error) {
    console.error("Error al generar partidos:", error)
    return {
      success: false,
      message: "Error inesperado al generar los partidos.",
    }
  }
}

// Función para actualizar la programación de un partido
export async function updateMatchSchedule(matchId: number, date: string, time: string, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Verificar si el partido existe
    const { data: match, error: matchError } = await supabase.from("matches").select("*").eq("id", matchId).single()

    if (matchError || !match) {
      console.error("Error al obtener el partido:", matchError)
      return {
        success: false,
        message: "Error al obtener información del partido.",
      }
    }

    // Actualizar fecha y hora del partido
    const { error: updateError } = await supabase
      .from("matches")
      .update({
        match_date: date || null,
        match_time: time || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchId)

    if (updateError) {
      console.error("Error al actualizar la programación del partido:", updateError)
      return {
        success: false,
        message: "Error al actualizar la programación del partido.",
      }
    }

    // Revalidar las páginas
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

    return {
      success: true,
      message: "Programación del partido actualizada correctamente.",
    }
  } catch (error) {
    console.error("Error al actualizar la programación:", error)
    return {
      success: false,
      message: "Error inesperado al actualizar la programación del partido.",
    }
  }
}

// Función para actualizar el resultado de un partido
export async function updateMatchResult(matchId: number, team1Score: number, team2Score: number, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Obtener información del partido actual con detalles de los equipos
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select(`
        *,
        team1:team1_id(id, name),
        team2:team2_id(id, name)
      `)
      .eq("id", matchId)
      .single()

    if (matchError || !match) {
      console.error("Error al obtener el partido:", matchError)
      return {
        success: false,
        message: "Error al obtener información del partido.",
      }
    }

    // 2. Determinar el ganador
    let winnerId = null
    let loserId = null
    let winnerName = null
    if (team1Score > team2Score) {
      winnerId = match.team1_id
      loserId = match.team2_id
      winnerName = match.team1?.name
    } else if (team2Score > team1Score) {
      winnerId = match.team2_id
      loserId = match.team1_id
      winnerName = match.team2?.name
    }

    // 3. Actualizar el partido con los resultados
    const { error: updateError } = await supabase
      .from("matches")
      .update({
        team1_score: team1Score,
        team2_score: team2Score,
        winner_id: winnerId,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchId)

    if (updateError) {
      console.error("Error al actualizar el partido:", updateError)
      return {
        success: false,
        message: "Error al actualizar el resultado del partido.",
      }
    }

    // 4. Verificar si todos los partidos de la ronda actual están completos
    const { data: roundMatches, error: roundMatchesError } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .eq("phase_type", "swiss")
      .eq("swiss_round", match.swiss_round)

    if (!roundMatchesError && roundMatches) {
      const allMatchesCompleted = roundMatches.every(m => m.status === "completed")
      
      if (allMatchesCompleted) {
        // Obtener los ganadores de la ronda actual
        const winners = roundMatches
          .filter(m => m.winner_id)
          .map(m => ({
            team_id: m.winner_id,
            score: m.team1_id === m.winner_id ? m.team1_score : m.team2_score
          }))
          .sort((a, b) => b.score - a.score) // Ordenar por puntaje descendente

        // Generar la siguiente ronda emparejando los equipos según sus resultados
        const nextRound = match.swiss_round + 1
        const nextRoundMatches = []
        
        for (let i = 0; i < winners.length; i += 2) {
          if (i + 1 < winners.length) {
            nextRoundMatches.push({
              tournament_id: tournamentId,
              phase_type: 'swiss',
              swiss_round: nextRound,
              match_order: Math.floor(i / 2) + 1,
              team1_id: winners[i].team_id,
              team2_id: winners[i + 1].team_id,
              status: "pending",
              match_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Una semana después
            })
          }
        }

        // Insertar los partidos de la siguiente ronda
        if (nextRoundMatches.length > 0) {
          const { error: insertError } = await supabase
            .from("matches")
            .insert(nextRoundMatches)

          if (insertError) {
            console.error("Error al generar la siguiente ronda:", insertError)
          }
        }
      }
    }

    // 5. Actualizar el ranking de los equipos
    if (winnerId && loserId) {
      await updateTeamRankings(winnerId, loserId, match.phase)
    }

    // 6. Revalidar las páginas
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
    revalidatePath("/ranking")

    return {
      success: true,
      message: winnerName 
        ? `Resultado actualizado. ${winnerName} avanza a la siguiente ronda.`
        : "Resultado actualizado correctamente.",
    }
  } catch (error) {
    console.error("Error al actualizar resultado:", error)
    return {
      success: false,
      message: "Error inesperado al actualizar el resultado.",
    }
  }
}

// Función para avanzar al ganador a la siguiente ronda
async function advanceWinnerToNextRound(match: Match, winnerId: number, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return
    }

    let nextPhase = ""
    let matchPosition = 0

    // Determinar la siguiente fase y la posición del partido
    switch (match.phase) {
      case "roundOf16":
        nextPhase = "quarterFinals"
        matchPosition = Math.floor((match.match_order - 1) / 2)
        break
      case "quarterFinals":
        nextPhase = "semiFinals"
        matchPosition = Math.floor((match.match_order - 1) / 2)
        break
      case "semiFinals":
        nextPhase = "final"
        matchPosition = 0
        break
      default:
        return // No hay siguiente fase para la final
    }

    // Obtener el partido de la siguiente fase
    const { data: nextMatches, error: nextMatchError } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .eq("phase", nextPhase)
      .order("match_order", { ascending: true })

    if (nextMatchError || !nextMatches || nextMatches.length === 0) {
      console.error("Error al obtener partidos de la siguiente fase:", nextMatchError)
      return
    }

    // Determinar en qué posición (team1 o team2) colocar al ganador
    const nextMatch = nextMatches[matchPosition]
    if (!nextMatch) return

    const isEvenMatch = match.match_order % 2 === 0
    const updateData = isEvenMatch ? { team2_id: winnerId } : { team1_id: winnerId }

    // Actualizar el partido de la siguiente fase
    await supabase.from("matches").update(updateData).eq("id", nextMatch.id)
  } catch (error) {
    console.error("Error al avanzar ganador:", error)
  }
}

// Función para actualizar los rankings de los equipos
async function updateTeamRankings(winnerId: number, loserId: number, phase: string) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return
    }

    // Puntos por victoria en un partido
    const victoryPoints = 10

    // Puntos adicionales según la fase del torneo
    let phasePoints = 0
    if (phase === "final") {
      phasePoints = 100 // Victoria en torneo
    } else if (phase === "semiFinals") {
      phasePoints = 50 // Semifinalista
    } else if (phase === "quarterFinals") {
      phasePoints = 25 // Cuartofinalista
    }

    // Actualizar el ranking del equipo ganador
    const { data: winnerRanking, error: winnerRankingError } = await supabase
      .from("team_rankings")
      .select("*")
      .eq("team_id", winnerId)
      .single()

    if (winnerRankingError && winnerRankingError.code !== "PGRST116") {
      console.error("Error al obtener ranking del ganador:", winnerRankingError)
      return
    }

    if (winnerRanking) {
      // Actualizar ranking existente
      await supabase
        .from("team_rankings")
        .update({
          points: winnerRanking.points + victoryPoints + phasePoints,
          wins: winnerRanking.wins + 1,
          last_updated: new Date().toISOString(),
        })
        .eq("team_id", winnerId)
    } else {
      // Crear nuevo ranking
      await supabase.from("team_rankings").insert({
        team_id: winnerId,
        points: victoryPoints + phasePoints,
        wins: 1,
        losses: 0,
        tournaments_played: 1,
        last_updated: new Date().toISOString(),
      })
    }

    // Actualizar el ranking del equipo perdedor
    const { data: loserRanking, error: loserRankingError } = await supabase
      .from("team_rankings")
      .select("*")
      .eq("team_id", loserId)
      .single()

    if (loserRankingError && loserRankingError.code !== "PGRST116") {
      console.error("Error al obtener ranking del perdedor:", loserRankingError)
      return
    }

    if (loserRanking) {
      // Actualizar ranking existente
      await supabase
        .from("team_rankings")
        .update({
          losses: loserRanking.losses + 1,
          last_updated: new Date().toISOString(),
        })
        .eq("team_id", loserId)
    } else {
      // Crear nuevo ranking
      await supabase.from("team_rankings").insert({
        team_id: loserId,
        points: 0,
        wins: 0,
        losses: 1,
        tournaments_played: 1,
        last_updated: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error al actualizar rankings de equipos:", error)
  }
}

// Función para aprobar un equipo
export async function approveTeam(teamId: number, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Verificar si el torneo tiene las inscripciones abiertas
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("registration_status, max_participants")
      .eq("id", tournamentId)
      .single()

    if (tournamentError) {
      console.error("Error fetching tournament:", tournamentError)
      return {
        success: false,
        message: "Error al verificar el estado del torneo.",
      }
    }

    if (tournament.registration_status === "closed") {
      return {
        success: false,
        message: "No se puede aprobar el equipo porque las inscripciones están cerradas.",
      }
    }

    // Verificar cuántos equipos aprobados hay actualmente
    const { data: approvedTeams, error: teamsError } = await supabase
      .from("teams")
      .select("id")
      .eq("tournament_id", tournamentId)
      .eq("status", "approved")

    if (teamsError) {
      console.error("Error fetching approved teams:", teamsError)
      return {
        success: false,
        message: "Error al verificar los equipos aprobados.",
      }
    }

    // Verificar si el torneo está lleno
    if (approvedTeams && approvedTeams.length >= tournament.max_participants) {
      return {
        success: false,
        message: `No se puede aprobar el equipo porque el torneo ya está lleno (${tournament.max_participants} equipos).`,
      }
    }

    // Aprobar el equipo
    const { error: updateError } = await supabase
      .from("teams")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", teamId)

    if (updateError) {
      console.error("Error approving team:", updateError)
      return {
        success: false,
        message: "Error al aprobar el equipo: " + updateError.message,
      }
    }

    // Verificar si con esta aprobación el torneo queda lleno
    const willBeFull = approvedTeams.length + 1 >= tournament.max_participants

    // Si el torneo queda lleno, cerrar inscripciones automáticamente
    if (willBeFull) {
      const { error: closeError } = await supabase
        .from("tournaments")
        .update({ registration_status: "closed" })
        .eq("id", tournamentId)

      if (closeError) {
        console.error("Error closing registrations:", closeError)
        // No interrumpimos la operación si falla el cierre de inscripciones
      }
    }

    // Revalidar las rutas necesarias
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

    return {
      success: true,
      message: willBeFull 
        ? "Equipo aprobado exitosamente. El torneo está ahora lleno y las inscripciones se han cerrado automáticamente."
        : "Equipo aprobado exitosamente.",
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al aprobar el equipo",
    }
  }
}

// Función para rechazar un equipo
export async function rejectTeam(teamId: number, reason: string, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

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

// Función para eliminar todos los partidos de un torneo
export async function deleteAllMatches(tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Eliminar todos los partidos del torneo
    const { error } = await supabase.from("matches").delete().eq("tournament_id", tournamentId)

    if (error) {
      console.error("Error al eliminar partidos:", error)
      return {
        success: false,
        message: "Error al eliminar los partidos del torneo.",
      }
    }

    // Revalidar las páginas
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

    return {
      success: true,
      message: "Partidos eliminados correctamente.",
    }
  } catch (error) {
    console.error("Error al eliminar partidos:", error)
    return {
      success: false,
      message: "Error inesperado al eliminar los partidos.",
    }
  }
}

// Añadir esta nueva función para verificar y actualizar el estado del torneo
export async function checkAndUpdateTournamentStatus(tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Obtener información del torneo
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", tournamentId)
      .single()

    if (tournamentError || !tournament) {
      console.error("Error fetching tournament:", tournamentError)
      return {
        success: false,
        message: "Error al obtener información del torneo.",
      }
    }

    // Obtener equipos aprobados
    const { data: approvedTeams, error: teamsError } = await supabase
      .from("teams")
      .select("id")
      .eq("tournament_id", tournamentId)
      .eq("status", "approved")

    if (teamsError) {
      console.error("Error fetching teams:", teamsError)
      return {
        success: false,
        message: "Error al obtener equipos del torneo.",
      }
    }

    // Verificar si el torneo está lleno
    const isFull = approvedTeams && approvedTeams.length >= tournament.max_participants

    // Si el torneo está lleno y su estado es 'active', actualizarlo a 'completed'
    if (isFull && tournament.status === "active") {
      const { error: updateError } = await supabase
        .from("tournaments")
        .update({ status: "completed" })
        .eq("id", tournamentId)

      if (updateError) {
        console.error("Error updating tournament status:", updateError)
        return {
          success: false,
          message: "Error al actualizar el estado del torneo.",
        }
      }

      return {
        success: true,
        message: "Estado del torneo actualizado a 'completed' porque está lleno.",
      }
    }

    return {
      success: true,
      message: "No se requiere actualización del estado del torneo.",
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al verificar el estado del torneo.",
    }
  }
}

// Función para actualizar un equipo
export async function updateTeam(data: {
  teamId: number
  teamName: string
  teamPhone?: string
  members: Array<{
    id: number
    name: string
    character_class: string
  }>
  tournamentId: number
}) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Actualizar el nombre del equipo y teléfono
    const { error: teamError } = await supabase
      .from("teams")
      .update({
        name: data.teamName,
        phone: data.teamPhone || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.teamId)

    if (teamError) {
      console.error("Error updating team:", teamError)
      return {
        success: false,
        message: "Error al actualizar el equipo: " + teamError.message,
      }
    }

    // 2. Actualizar los miembros del equipo
    for (const member of data.members) {
      const { error: memberError } = await supabase
        .from("team_members")
        .update({
          name: member.name,
          character_class: "No especificada", // Valor por defecto
        })
        .eq("id", member.id)

      if (memberError) {
        console.error("Error updating team member:", memberError)
        // No abortamos la operación si falla la actualización de un miembro
      }
    }

    // 3. Revalidar las rutas necesarias
    revalidatePath(`/torneos/${data.tournamentId}`)
    revalidatePath(`/torneos/${data.tournamentId}/equipos`)
    revalidatePath(`/admin/torneos/${data.tournamentId}`)

    return {
      success: true,
      message: "Equipo actualizado correctamente.",
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al actualizar el equipo.",
    }
  }
}

// Add this function to the existing admin-actions.ts file

// Función para cambiar el estado de un equipo
export async function changeTeamStatus(data: {
  teamId: number
  status: "approved" | "rejected" | "expelled" | "pending"
  reason?: string
  tournamentId: number
}) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Preparar los datos para actualizar
    const updateData: any = {
      status: data.status,
    }

    // Agregar campos específicos según el estado
    if (data.status === "approved") {
      updateData.approved_at = new Date().toISOString()
      // Limpiar campos de rechazo y expulsión si existían
      updateData.rejected_at = null
      updateData.expelled_at = null
      updateData.rejection_reason = null
      updateData.expulsion_reason = null
    } else if (data.status === "rejected") {
      updateData.rejected_at = new Date().toISOString()
      updateData.rejection_reason = data.reason || "No se proporcionó motivo"
      // Limpiar campos de aprobación y expulsión si existían
      updateData.approved_at = null
      updateData.expelled_at = null
      updateData.expulsion_reason = null
    } else if (data.status === "expelled") {
      updateData.expelled_at = new Date().toISOString()
      updateData.expulsion_reason = data.reason || "No se proporcionó motivo"
      // Limpiar campos de aprobación y rechazo si existían
      updateData.approved_at = null
      updateData.rejected_at = null
      updateData.rejection_reason = null
    } else if (data.status === "pending") {
      // Restablecer a pendiente, limpiar todos los campos relacionados con otros estados
      updateData.approved_at = null
      updateData.rejected_at = null
      updateData.expelled_at = null
      updateData.rejection_reason = null
      updateData.expulsion_reason = null
    }

    // Actualizar el equipo
    const { error } = await supabase.from("teams").update(updateData).eq("id", data.teamId)

    if (error) {
      console.error("Error al cambiar el estado del equipo:", error)
      return {
        success: false,
        message: "Error al cambiar el estado del equipo: " + error.message,
      }
    }

    // Si el equipo fue aprobado, verificar y actualizar el estado del torneo si es necesario
    if (data.status === "approved") {
      await checkAndUpdateTournamentStatus(data.tournamentId)
    }

    // Revalidar las rutas necesarias
    revalidatePath(`/torneos/${data.tournamentId}`)
    revalidatePath(`/torneos/${data.tournamentId}/equipos`)
    revalidatePath(`/admin/torneos/${data.tournamentId}`)

    return {
      success: true,
      message: `Equipo ${
        data.status === "approved" 
          ? "aprobado" 
          : data.status === "rejected" 
            ? "rechazado" 
            : data.status === "pending" 
              ? "marcado como pendiente" 
              : "expulsado"
      } correctamente.`,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al cambiar el estado del equipo.",
    }
  }
}

// Función para eliminar todos los equipos expulsados
export async function deleteExpelledTeams(tournamentId?: number) {
  try {
    const supabase = createServerComponentClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return {
        success: false,
        message: "Error al conectar con la base de datos",
      }
    }

    // Consulta base para obtener todos los equipos expulsados
    let query = supabase.from("teams").delete().eq("status", "expelled")

    // Si se proporciona un ID de torneo, filtrar solo por ese torneo
    if (tournamentId) {
      query = query.eq("tournament_id", tournamentId)
    }

    const { error, count } = await query

    if (error) {
      console.error("Error al eliminar equipos expulsados:", error)
      return {
        success: false,
        message: "Error al eliminar equipos expulsados: " + error.message,
      }
    }

    // Revalidar rutas
    if (tournamentId) {
      revalidatePath(`/torneos/${tournamentId}`)
      revalidatePath(`/torneos/${tournamentId}/equipos`)
      revalidatePath(`/admin/torneos/${tournamentId}`)
    } else {
      revalidatePath("/admin")
      revalidatePath("/torneos")
    }

    return {
      success: true,
      message: `Se han eliminado ${count || 0} equipos expulsados correctamente.`,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al eliminar equipos expulsados.",
    }
  }
}

// Función para borrar un torneo
export async function deleteTournament(tournamentId: number) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Borrar los premios asociados
    const { error: prizesError } = await supabase
      .from("tournament_prizes")
      .delete()
      .eq("tournament_id", tournamentId)

    if (prizesError) {
      console.error("Error deleting prizes:", prizesError)
    }

    // 2. Borrar las reglas asociadas
    const { error: rulesError } = await supabase
      .from("tournament_rules")
      .delete()
      .eq("tournament_id", tournamentId)

    if (rulesError) {
      console.error("Error deleting rules:", rulesError)
    }

    // 3. Borrar los equipos asociados
    const { error: teamsError } = await supabase
      .from("teams")
      .delete()
      .eq("tournament_id", tournamentId)

    if (teamsError) {
      console.error("Error deleting teams:", teamsError)
    }

    // 4. Borrar los partidos asociados
    const { error: matchesError } = await supabase
      .from("matches")
      .delete()
      .eq("tournament_id", tournamentId)

    if (matchesError) {
      console.error("Error deleting matches:", matchesError)
    }

    // 5. Finalmente, borrar el torneo
    const { error: tournamentError } = await supabase
      .from("tournaments")
      .delete()
      .eq("id", tournamentId)

    if (tournamentError) {
      console.error("Error deleting tournament:", tournamentError)
      return {
        success: false,
        message: "Error al borrar el torneo: " + tournamentError.message,
      }
    }

    // Revalidar las rutas necesarias
    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Torneo borrado exitosamente",
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al borrar el torneo",
    }
  }
}

// Función para verificar cupos y cerrar inscripciones si el torneo está lleno
export async function checkAndCloseRegistration(tournamentId: number) {
  try {
    console.log("Iniciando checkAndCloseRegistration para torneo:", tournamentId)
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Obtener información del torneo
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", tournamentId)
      .single()

    if (tournamentError || !tournament) {
      console.error("Error al obtener torneo:", tournamentError)
      return {
        success: false,
        message: "Error al obtener información del torneo.",
      }
    }

    console.log("Estado actual del torneo:", {
      id: tournament.id,
      status: tournament.status
    })

    // Alternar el estado de las inscripciones
    const newStatus = tournament.status === "upcoming" ? "active" : "upcoming"
    console.log("Alternando estado de inscripciones a:", newStatus)
    
    const { error: updateError } = await supabase
      .from("tournaments")
      .update({ status: newStatus })
      .eq("id", tournamentId)

    if (updateError) {
      console.error("Error al actualizar estado de inscripciones:", updateError)
      return {
        success: false,
        message: `Error al ${newStatus === "upcoming" ? "abrir" : "cerrar"} las inscripciones del torneo.`,
      }
    }

    console.log("Estado de inscripciones actualizado correctamente a:", newStatus)

    // Revalidar las rutas necesarias
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

    return {
      success: true,
      message: `Inscripciones ${newStatus === "upcoming" ? "abiertas" : "cerradas"} correctamente.`,
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return {
      success: false,
      message: "Error inesperado al verificar el estado de las inscripciones.",
    }
  }
}

// Función para actualizar el estado de un torneo directamente
export async function updateTournamentStatus(tournamentId: number, newStatus: string) {
  try {
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // Actualizar el estado del torneo
    const { error } = await supabase
      .from("tournaments")
      .update({ status: newStatus })
      .eq("id", tournamentId)

    if (error) {
      console.error("Error updating tournament status:", error)
      return {
        success: false,
        message: "Error al actualizar el estado del torneo: " + error.message,
      }
    }

    // Revalidar las rutas necesarias
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
    revalidatePath("/admin/torneos")

    return {
      success: true,
      message: `Estado del torneo actualizado a '${newStatus}'.`,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Error inesperado al actualizar el estado del torneo.",
    }
  }
}

// Nueva función para alternar entre registro y curso
export async function toggleTournamentMode(tournamentId: number) {
  try {
    console.log("Alternando modo del torneo:", tournamentId)
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return {
        success: false,
        message: "Error al conectar con Supabase.",
      }
    }

    // 1. Obtener información actual del torneo
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("status")
      .eq("id", tournamentId)
      .single()

    if (tournamentError || !tournament) {
      console.error("Error al obtener torneo:", tournamentError)
      return {
        success: false,
        message: "Error al obtener información del torneo.",
      }
    }

    console.log("Estado actual del torneo:", tournament.status)

    // 2. Verificar cuántos equipos tiene este torneo
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id, status")
      .eq("tournament_id", tournamentId)

    if (teamsError) {
      console.error("Error al obtener equipos:", teamsError)
    } else {
      console.log(`Total de equipos para torneo ${tournamentId}:`, teams.length)
      const approvedTeams = teams.filter(t => t.status === "approved")
      console.log(`Equipos aprobados: ${approvedTeams.length}`)
    }

    // 3. Determinar el nuevo estado (alternar entre "upcoming" y "active")
    const newStatus = tournament.status === "active" ? "upcoming" : "active"
    console.log("Cambiando estado a:", newStatus)
    
    // 4. Actualizar solo el campo "status"
    const { error: updateError } = await supabase
      .from("tournaments")
      .update({ status: newStatus })
      .eq("id", tournamentId)

    if (updateError) {
      console.error("Error al actualizar estado del torneo:", updateError)
      return {
        success: false,
        message: `Error al cambiar el estado del torneo a ${newStatus}.`,
      }
    }

    console.log("Estado del torneo actualizado correctamente a:", newStatus)

    // 5. Revalidar las rutas necesarias
    // Forzar una revalidación más agresiva con el timestamp
    const timestamp = Date.now()
    revalidatePath(`/admin?t=${timestamp}`)
    revalidatePath(`/?t=${timestamp}`)
    revalidatePath(`/torneos/${tournamentId}?t=${timestamp}`)
    revalidatePath(`/admin/torneos/${tournamentId}?t=${timestamp}`)
    revalidatePath(`/admin/torneos?t=${timestamp}`)
    
    // Revalidar también otras rutas que podrían estar en caché
    revalidatePath("/")
    revalidatePath("/torneos")
    revalidatePath("/admin/torneos")

    return {
      success: true,
      message: newStatus === "upcoming" 
        ? "Inscripciones abiertas correctamente."
        : "Inscripciones cerradas correctamente.",
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return {
      success: false,
      message: "Error inesperado al cambiar el estado del torneo.",
    }
  }
}
