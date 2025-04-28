import { createServerComponentClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    console.log("Restaurando valores originales del ranking 1v1...")
    const supabase = createServerComponentClient()
    
    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de Supabase")
      return NextResponse.json({ 
        success: false, 
        message: "Error de conexión con Supabase" 
      }, { status: 500 })
    }

    // Valores específicos para restaurar el ranking original
    const teamInfo = [
      { name: "Los Pibes FC", searchTerm: "pibes", points: 55 },      // CorreGuachin (1er lugar)
      { name: "Srjotta", searchTerm: "jotta", points: 50 },           // REanimateMAN (2do lugar)
      { name: "PAPADESONHOGORDA", searchTerm: "papa", points: 40 }    // Sharapova (3er lugar) - Añadidos 5 puntos extra
    ]

    // Resultado para tracking
    let updatedRankings = []

    // Procesar cada equipo manualmente
    for (const team of teamInfo) {
      console.log(`Procesando equipo ${team.name} con búsqueda ${team.searchTerm}`)
      
      // Buscar equipos por término de búsqueda flexible
      const { data: teams, error: teamsError } = await supabase
        .from("teams")
        .select("id, name")
        .ilike("name", `%${team.searchTerm}%`)
      
      if (teamsError) {
        console.error(`Error buscando equipo ${team.name}:`, teamsError)
        continue
      }
      
      if (!teams || teams.length === 0) {
        console.log(`No se encontró ningún equipo con el término ${team.searchTerm}`)
        continue
      }
      
      // Mostrar equipos encontrados
      console.log(`Equipos encontrados con término "${team.searchTerm}":`, teams.map(t => t.name))
      
      // Tomar el primer resultado
      const selectedTeam = teams[0]
      console.log(`Seleccionado: ${selectedTeam.name} (ID: ${selectedTeam.id})`)
      
      // Buscar ranking actual
      const { data: rankings, error: rankingError } = await supabase
        .from("team_rankings")
        .select("*")
        .eq("team_id", selectedTeam.id)
      
      if (rankingError) {
        console.error(`Error obteniendo ranking para ${selectedTeam.name}:`, rankingError)
        continue
      }
      
      if (!rankings || rankings.length === 0) {
        console.log(`No se encontró ranking para ${selectedTeam.name}`)
        continue
      }
      
      const ranking = rankings[0]
      console.log(`Ranking actual de ${selectedTeam.name}: ${ranking.points} puntos`)
      
      // Actualizar puntos directamente
      const { error: updateError } = await supabase
        .from("team_rankings")
        .update({
          points: team.points,
          last_updated: new Date().toISOString()
        })
        .eq("id", ranking.id)
      
      if (updateError) {
        console.error(`Error actualizando ranking para ${selectedTeam.name}:`, updateError)
      } else {
        console.log(`¡Éxito! Ranking de ${selectedTeam.name} actualizado a ${team.points} puntos`)
        updatedRankings.push({
          teamName: selectedTeam.name,
          teamId: selectedTeam.id,
          oldPoints: ranking.points,
          newPoints: team.points
        })
      }
    }

    // Revalidar rutas para actualizar la interfaz
    revalidatePath("/ranking")
    
    return NextResponse.json({ 
      success: true, 
      message: `Se restauró el ranking 1v1 a los valores originales para ${updatedRankings.length} equipos`,
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