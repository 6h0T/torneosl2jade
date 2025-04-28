import { createServerComponentClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    console.log("Iniciando corrección de puntos para rankings 1vs1...")
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return NextResponse.json({ 
        success: false, 
        message: "Error de conexión con Supabase" 
      }, { status: 500 })
    }

    // Primero, obtenemos los rankings de tipo 1v1 con sus datos de equipos y torneos
    const { data: allRankings, error: rankingError } = await supabase
      .from("team_rankings")
      .select(`
        *,
        team:team_id(id, name, tournament_id)
      `)
      .order("points", { ascending: false })

    if (rankingError) {
      console.error("Error obteniendo rankings:", rankingError)
      return NextResponse.json({ 
        success: false, 
        message: "Error al obtener rankings" 
      }, { status: 500 })
    }

    // Obtener información de los torneos para saber el formato
    const tournamentIds = [...new Set(allRankings?.map(r => r.team?.tournament_id).filter(Boolean))]
    
    if (!tournamentIds.length) {
      return NextResponse.json({ 
        success: true, 
        message: "No hay rankings para corregir" 
      })
    }

    const { data: tournaments, error: tournamentsError } = await supabase
      .from("tournaments")
      .select("id, format")
      .in("id", tournamentIds)

    if (tournamentsError) {
      console.error("Error obteniendo torneos:", tournamentsError)
      return NextResponse.json({ 
        success: false, 
        message: "Error al obtener información de torneos" 
      }, { status: 500 })
    }

    // Crear un mapa de torneo a formato
    const tournamentFormats = tournaments.reduce((acc, t) => {
      acc[t.id] = t.format
      return acc
    }, {})

    // Obtener datos de los partidos finales para saber quiénes ganaron torneos
    const { data: finalMatches, error: matchesError } = await supabase
      .from("matches")
      .select(`
        id,
        tournament_id,
        winner_id,
        phase
      `)
      .eq("phase", "final")
      .eq("status", "completed")

    if (matchesError) {
      console.error("Error obteniendo partidos finales:", matchesError)
      return NextResponse.json({ 
        success: false, 
        message: "Error al obtener información de partidos finales" 
      }, { status: 500 })
    }

    // Crear un mapa de ganadores de torneos
    const tournamentWinners = finalMatches.reduce((acc, match) => {
      if (match.winner_id) {
        acc[match.winner_id] = match.tournament_id
      }
      return acc
    }, {})

    // Filtrar solo los rankings 1v1
    const solo1v1Rankings = allRankings.filter(ranking => {
      const tournamentId = ranking.team?.tournament_id
      if (!tournamentId) return false
      
      // Solo consideramos rankings 1v1
      const format = tournamentFormats[tournamentId]
      return format === "1v1"
    })

    // Identificar rankings que necesitan corrección (ganadores de torneos 1v1)
    const rankingsToFix = solo1v1Rankings.filter(ranking => 
      // El equipo es un ganador de torneo pero no tiene los 40 puntos extra
      tournamentWinners[ranking.team_id] && 
      // Si tiene 4 victorias debe tener 80 puntos (4*10 + 40)
      (ranking.wins * 10 + 40 > ranking.points)
    )

    if (rankingsToFix.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No se encontraron rankings 1v1 que necesiten corrección" 
      })
    }

    console.log(`Se encontraron ${rankingsToFix.length} rankings 1v1 que necesitan corrección`)

    // Actualizar los rankings que necesitan corrección
    const updatedRankings = []
    for (const ranking of rankingsToFix) {
      // Calcular cuántos puntos deberían tener (victorias * 10 + 40 por campeonato)
      const expectedPoints = ranking.wins * 10 + 40
      
      // Si tienen menos puntos de los esperados, añadimos los que faltan
      if (ranking.points < expectedPoints) {
        const pointsToAdd = expectedPoints - ranking.points
        
        const { error: updateError } = await supabase
          .from("team_rankings")
          .update({
            points: ranking.points + pointsToAdd,
            last_updated: new Date().toISOString()
          })
          .eq("id", ranking.id)
        
        if (updateError) {
          console.error(`Error actualizando ranking ${ranking.id}:`, updateError)
        } else {
          updatedRankings.push({
            id: ranking.id,
            teamId: ranking.team_id,
            teamName: ranking.team?.name,
            oldPoints: ranking.points,
            newPoints: ranking.points + pointsToAdd,
            pointsAdded: pointsToAdd
          })
        }
      }
    }

    // Revalidar rutas para actualizar la interfaz
    revalidatePath("/ranking")
    
    return NextResponse.json({ 
      success: true, 
      message: `Se corrigieron ${updatedRankings.length} rankings de equipos 1v1`,
      updated: updatedRankings
    })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Error inesperado al procesar la solicitud" 
    }, { status: 500 })
  }
} 