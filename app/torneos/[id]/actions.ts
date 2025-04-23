"use server"

import { generateInitialBracket, deleteAllMatches } from "@/lib/supabase/admin-actions"
import { revalidatePath } from "next/cache"

export async function generateBracketAction(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"))
  const result = await generateInitialBracket(tournamentId)
  
  if (result.success) {
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
  }
  
  return result
}

export async function deleteMatchesAction(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"))
  const result = await deleteAllMatches(tournamentId)
  
  if (result.success) {
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
  }
  
  return result
} 