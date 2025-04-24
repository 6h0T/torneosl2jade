"use server"

import { generateInitialBracket, deleteAllMatches } from "@/lib/supabase/admin-actions"
import { revalidatePath } from "next/cache"

// Acción para generar el bracket inicial
export async function generateBracketAction(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"))
  const phaseType = formData.get("phaseType") as 'swiss' | 'elimination'
  const round = formData.get("round") as string

  if (!phaseType || !round) {
    return {
      success: false,
      message: "Faltan parámetros necesarios para generar el bracket"
    }
  }

  const result = await generateInitialBracket(tournamentId, phaseType, round)
  
  if (result.success) {
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
  }
  
  return result
}

// Acción para eliminar todos los partidos
export async function deleteMatchesAction(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"))
  const result = await deleteAllMatches(tournamentId)
  
  if (result.success) {
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
  }
  
  return result
} 