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
export async function generateInitialBracket(tournamentId: number) {
  try {
    const supabase = createServerComponentClient()

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

    // 2. Verificar si ya existen partidos para este torneo
    const { data: existingMatches, error: matchesError } = await supabase
      .from("matches")
      .select("id")
      .eq("tournament_id", tournamentId)

    if (matchesError) {
      console.error("Error al verificar partidos existentes:", matchesError)
      return {
        success: false,
        message: "Error al verificar si ya existen partidos para este torneo.",
      }
    }

    if (existingMatches && existingMatches.length > 0) {
      return {
        success: false,
        message: "Ya existen partidos para este torneo. Elimínalos primero si deseas regenerar el bracket.",
      }
    }

    // 3. Determinar el número de equipos y la estructura del bracket
    const numTeams = teams.length
    let numRoundOf16 = 0
    let numQuarterFinals = 0
    let numSemiFinals = 0

    if (numTeams <= 4) {
      numSemiFinals = Math.ceil(numTeams / 2)
    } else if (numTeams <= 8) {
      numQuarterFinals = Math.ceil(numTeams / 2)
      numSemiFinals = 2
    } else {
      numRoundOf16 = Math.ceil(numTeams / 2)
      numQuarterFinals = 4
      numSemiFinals = 2
    }

    // 4. Crear los partidos
    const matches: any[] = []
    let matchOrder = 1
    let teamIndex = 0

    // Crear partidos de octavos de final (si es necesario)
    for (let i = 0; i < numRoundOf16; i++) {
      const team1 = teamIndex < numTeams ? teams[teamIndex++] : null
      const team2 = teamIndex < numTeams ? teams[teamIndex++] : null

      matches.push({
        tournament_id: tournamentId,
        phase: "roundOf16",
        match_order: matchOrder++,
        team1_id: team1?.id || null,
        team2_id: team2?.id || null,
        status: "pending",
        match_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 días después
      })
    }

    // Crear partidos de cuartos de final
    for (let i = 0; i < numQuarterFinals; i++) {
      // Si no hay octavos, asignar equipos directamente
      let team1 = null
      let team2 = null

      if (numRoundOf16 === 0 && teamIndex < numTeams) {
        team1 = teams[teamIndex++]
        team2 = teamIndex < numTeams ? teams[teamIndex++] : null
      }

      matches.push({
        tournament_id: tournamentId,
        phase: "quarterFinals",
        match_order: matchOrder++,
        team1_id: team1?.id || null,
        team2_id: team2?.id || null,
        status: "pending",
        match_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 14 días después
      })
    }

    // Crear partidos de semifinales
    for (let i = 0; i < numSemiFinals; i++) {
      // Si no hay cuartos ni octavos, asignar equipos directamente
      let team1 = null
      let team2 = null

      if (numRoundOf16 === 0 && numQuarterFinals === 0 && teamIndex < numTeams) {
        team1 = teams[teamIndex++]
        team2 = teamIndex < numTeams ? teams[teamIndex++] : null
      }

      matches.push({
        tournament_id: tournamentId,
        phase: "semiFinals",
        match_order: matchOrder++,
        team1_id: team1?.id || null,
        team2_id: team2?.id || null,
        status: "pending",
        match_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 21 días después
      })
    }

    // Crear partido final
    matches.push({
      tournament_id: tournamentId,
      phase: "final",
      match_order: matchOrder++,
      team1_id: null,
      team2_id: null,
      status: "pending",
      match_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 28 días después
    })

    // 5. Insertar los partidos en la base de datos
    const { error: insertError } = await supabase.from("matches").insert(matches)

    if (insertError) {
      console.error("Error al insertar partidos:", insertError)
      return {
        success: false,
        message: "Error al generar los partidos del torneo.",
      }
    }

    // 6. Revalidar la página del torneo
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)

    return {
      success: true,
      message: "Bracket generado correctamente.",
    }
  } catch (error) {
    console.error("Error al generar bracket:", error)
    return {
      success: false,
      message: "Error inesperado al generar el bracket.",
    }
  }
}

// Función para actualizar la programación de un partido
export async function updateMatchSchedule(matchId: number, date: string, time: string, tournamentId: number) {
  try {
    const supabase = createServerComponentClient()

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

    // 1. Obtener información del partido
    const { data: match, error: matchError } = await supabase.from("matches").select("*").eq("id", matchId).single()

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
    if (team1Score > team2Score) {
      winnerId = match.team1_id
      loserId = match.team2_id
    } else if (team2Score > team1Score) {
      winnerId = match.team2_id
      loserId = match.team1_id
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

    // 4. Si hay un ganador, avanzarlo a la siguiente ronda
    if (winnerId) {
      await advanceWinnerToNextRound(match, winnerId, tournamentId)
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
      message: "Resultado actualizado correctamente.",
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

    // Verificar y actualizar el estado del torneo si es necesario
    await checkAndUpdateTournamentStatus(tournamentId)

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

// Función para eliminar todos los partidos de un torneo
export async function deleteAllMatches(tournamentId: number) {
  try {
    const supabase = createServerComponentClient()

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

    // 1. Actualizar el nombre del equipo
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
          character_class: "No especificada", // Siempre fijamos este valor
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
  status: "approved" | "rejected" | "expelled"
  reason?: string
  tournamentId: number
}) {
  try {
    const supabase = createServerComponentClient()

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
        data.status === "approved" ? "aprobado" : data.status === "rejected" ? "rechazado" : "expulsado"
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
