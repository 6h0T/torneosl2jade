"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Function to get the active tournament
async function getActiveTournament() {
  const supabase = createServerComponentClient()
  if (!supabase) {
    console.error("Failed to create Supabase client")
    return null
  }
  
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("Error fetching active tournament:", error)
    return null
  }

  return tournaments && tournaments.length > 0 ? tournaments[0] : null
}

// Update the registerTeam function to ensure it's properly saving to the database
export async function registerTeam(formData: FormData) {
  try {
    const teamName = formData.get("teamName") as string

    // Obtain team members data
    const member1Name = formData.get("member1Name") as string
    const member1Class = formData.get("member1Class") ? formData.get("member1Class") as string : "No especificada"

    const member2Name = formData.get("member2Name") as string
    const member2Class = formData.get("member2Class") ? formData.get("member2Class") as string : "No especificada"

    const member3Name = formData.get("member3Name") as string
    const member3Class = formData.get("member3Class") ? formData.get("member3Class") as string : "No especificada"

    // Validate data
    if (!teamName || !member1Name || !member2Name || !member3Name) {
      return {
        success: false,
        message: "Por favor, completa todos los campos obligatorios.",
      }
    }

    // Get the active tournament
    const activeTournament = await getActiveTournament()
    if (!activeTournament) {
      return {
        success: false,
        message: "No hay torneos activos disponibles para registro.",
      }
    }

    // Create Supabase client
    const supabase = createServerComponentClient()
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return {
        success: false,
        message: "Error de conexión con la base de datos. Por favor, inténtalo de nuevo.",
      }
    }

    // Check if a team with this name already exists in the tournament
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

    // Process phone information safely
    let teamPhone = ""
    const rawCountryCode = formData.get("countryCode")
    const rawPhoneNumber = formData.get("phoneNumber")
    
    if (rawCountryCode && rawPhoneNumber) {
      const countryCode = rawCountryCode.toString()
      const phoneNumber = rawPhoneNumber.toString()
      if (phoneNumber.trim()) {
        teamPhone = `${countryCode} ${phoneNumber}`.trim()
      }
    }

    // Create team with phone if provided
    const teamToInsert: any = {
      name: teamName,
      tournament_id: activeTournament.id,
      status: "pending",
      created_at: new Date().toISOString(),
    }
    
    // Only add phone if it has a value
    if (teamPhone) {
      teamToInsert.phone = teamPhone
    }

    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert([teamToInsert])
      .select()

    if (teamError) {
      console.error("Error inserting team:", teamError)
      return {
        success: false,
        message: "Error al registrar el equipo. Por favor, inténtalo de nuevo.",
      }
    }

    if (!teamData || teamData.length === 0) {
      console.error("No team data returned after insert")
      return {
        success: false,
        message: "Error al registrar el equipo. No se recibió confirmación de la base de datos.",
      }
    }

    const teamId = teamData[0].id

    // Prepare team members
    const teamMembers = [
      { team_id: teamId, name: member1Name, character_class: member1Class, created_at: new Date().toISOString() },
      { team_id: teamId, name: member2Name, character_class: member2Class, created_at: new Date().toISOString() },
      { team_id: teamId, name: member3Name, character_class: member3Class, created_at: new Date().toISOString() },
    ]

    // Insert team members
    const { error: membersError } = await supabase.from("team_members").insert(teamMembers)

    if (membersError) {
      console.error("Error inserting members:", membersError)
      // Delete the team if there was an error inserting members
      await supabase.from("teams").delete().eq("id", teamId)

      return {
        success: false,
        message: "Error al registrar los miembros del equipo. Por favor, inténtalo de nuevo.",
      }
    }

    // Revalidate paths to show the updated team
    revalidatePath(`/torneos/${activeTournament.id}`)
    revalidatePath(`/admin/torneos/${activeTournament.id}`)
    revalidatePath("/")

    return {
      success: true,
      message: "Equipo registrado correctamente. ¡Buena suerte en el torneo!",
      tournamentId: activeTournament.id,
    }
  } catch (error) {
    console.error("Error in registration:", error)
    return {
      success: false,
      message: "Error inesperado. Por favor, inténtalo de nuevo más tarde.",
    }
  }
}
