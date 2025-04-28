import { createServerComponentClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    console.log("Iniciando adición única de puntos extra...")
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return NextResponse.json({ 
        success: false, 
        message: "Error de conexión con Supabase" 
      }, { status: 500 })
    }

    // Obtener todos los rankings con información de equipos y torneos
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
    
    if (!allRankings || allRankings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No hay rankings para actualizar" 
      })
    }

    // Obtener información de los torneos para saber el formato
    const tournamentIds = [...new Set(allRankings?.map(r => r.team?.tournament_id).filter(Boolean))]
    
    if (!tournamentIds.length) {
      return NextResponse.json({ 
        success: true, 
        message: "No hay torneos asociados a los rankings" 
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

    // Añadir formato a cada ranking basado en su torneo
    const rankingsWithFormat = allRankings.map(r => {
      const tournamentId = r.team?.tournament_id
      let format = "unknown"
      if (tournamentId && tournamentFormats[tournamentId]) {
        format = tournamentFormats[tournamentId]
      }
      return { ...r, format }
    })

    // Agrupar por formato para obtener los tres primeros de cada categoría
    const rankings1v1 = rankingsWithFormat.filter(r => r.format === "1v1").slice(0, 3)
    const rankings2v2 = rankingsWithFormat.filter(r => r.format === "2v2").slice(0, 3)
    const rankings3v3 = rankingsWithFormat.filter(r => 
      r.format === "3v3" || r.format === "team" || r.format === "unknown"
    ).slice(0, 3)
    
    console.log(`Encontrados: ${rankings1v1.length} rankings 1v1, ${rankings2v2.length} rankings 2v2, ${rankings3v3.length} rankings 3v3/equipo`)
    
    // Preparar lista combinada ordenada para procesamiento
    const processRankings = [
      ...rankings1v1.map((r, idx) => ({ ...r, position: idx + 1, category: "1v1" })),
      ...rankings2v2.map((r, idx) => ({ ...r, position: idx + 1, category: "2v2" })),
      ...rankings3v3.map((r, idx) => ({ ...r, position: idx + 1, category: "3v3" }))
    ]
    
    // Actualizar por posición
    const updatedRankings = []
    for (const rank of processRankings) {
      let pointsToAdd = 0
      if (rank.position === 1) {
        pointsToAdd = 15 // Primer lugar
      } else if (rank.position === 2) {
        pointsToAdd = 10 // Segundo lugar
      } else if (rank.position === 3) {
        pointsToAdd = 5 // Tercer lugar
      }
      
      // Solo realizar actualización si hay puntos para añadir
      if (pointsToAdd > 0) {
        const { error: updateError } = await supabase
          .from("team_rankings")
          .update({
            points: rank.points + pointsToAdd,
            last_updated: new Date().toISOString()
          })
          .eq("id", rank.id)
        
        if (updateError) {
          console.error(`Error actualizando ranking ${rank.id}:`, updateError)
        } else {
          updatedRankings.push({
            id: rank.id,
            teamId: rank.team_id,
            teamName: rank.team?.name,
            category: rank.category,
            position: rank.position,
            format: rank.format,
            oldPoints: rank.points,
            newPoints: rank.points + pointsToAdd,
            pointsAdded: pointsToAdd
          })
        }
      }
    }

    // Revalidar rutas para actualizar la interfaz
    revalidatePath("/ranking")
    
    return NextResponse.json({ 
      success: true, 
      message: `Se agregaron puntos extras a ${updatedRankings.length} equipos en la tabla de clasificación`,
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