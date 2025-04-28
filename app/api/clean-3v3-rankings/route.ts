import { createServerComponentClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    console.log("Iniciando limpieza de rankings 3vs3...")
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return NextResponse.json({ 
        success: false, 
        message: "Error de conexión con Supabase" 
      }, { status: 500 })
    }

    // Primero, obtenemos todos los rankings con sus datos de equipos para identificar los de 3vs3
    const { data: allRankings, error: rankingError } = await supabase
      .from("team_rankings")
      .select(`
        *,
        team:team_id(id, name, tournament_id)
      `)

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
        message: "No hay rankings para limpiar" 
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

    // Identificar los IDs de rankings de equipos 3vs3
    const team3v3RankingIds = allRankings
      .filter(ranking => {
        const tournamentId = ranking.team?.tournament_id
        if (!tournamentId) return false
        
        // Consideramos como 3vs3 todos los formatos que no sean 1v1 ni 2v2
        const format = tournamentFormats[tournamentId]
        return format !== "1v1" && format !== "2v2"
      })
      .map(ranking => ranking.id)

    if (team3v3RankingIds.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No se encontraron rankings de 3vs3 para limpiar" 
      })
    }

    // Eliminar los rankings de 3vs3
    const { error: deleteError } = await supabase
      .from("team_rankings")
      .delete()
      .in("id", team3v3RankingIds)

    if (deleteError) {
      console.error("Error eliminando rankings:", deleteError)
      return NextResponse.json({ 
        success: false, 
        message: "Error al eliminar rankings" 
      }, { status: 500 })
    }

    console.log(`Se eliminaron ${team3v3RankingIds.length} rankings de equipos 3vs3`)
    
    // Revalidar rutas para actualizar la interfaz
    revalidatePath("/ranking")
    
    return NextResponse.json({ 
      success: true, 
      message: `Se eliminaron ${team3v3RankingIds.length} rankings de equipos 3vs3`,
      deleted: team3v3RankingIds.length
    })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Error inesperado al procesar la solicitud" 
    }, { status: 500 })
  }
} 