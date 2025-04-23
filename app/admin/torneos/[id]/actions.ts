"use server"

import { generateInitialBracket, deleteAllMatches } from "@/lib/supabase/admin-actions"

// Acción para generar el bracket inicial
export async function generateBracketAction(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"))
  await generateInitialBracket(tournamentId)
  return { success: true }
}

// Acción para eliminar todos los partidos
export async function deleteMatchesAction(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"))
  await deleteAllMatches(tournamentId)
  return { success: true }
} 