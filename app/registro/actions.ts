"use server"

import { createServerComponentClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Function to get the active tournament
async function getActiveTournament() {
  const supabase = createServerComponentClient()
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
    console.log("Starting team registration process")

    const teamName = formData.get("teamName") as string

    // Obtain team members data
    const member1Name = formData.get("member1Name") as string
    const member1Class = (formData.get("member1Class") as string) || "No especificada"

    const member2Name = formData.get("member2Name") as string
    const member2Class = (formData.get("member2Class") as string) || "No especificada"

    const member3Name = formData.get("member3Name") as string
    const member3Class = (formData.get("member3Class") as string) || "No especificada"

    // Get phone data
    const countryCode = formData.get("countryCode") as string
    const phoneNumber = formData.get("phoneNumber") as string

    console.log("Form data extracted:", {
      teamName,
      member1Name,
      member2Name,
      member3Name,
      countryCode,
      phoneNumber,
    })

    // Validate data
    if (!teamName || !member1Name || !member2Name || !member3Name) {
      console.log("Validation failed: Missing required fields")
      return {
        success: false,
        message: "Por favor, completa todos los campos obligatorios.",
      }
    }

    // Get the active tournament
    const activeTournament = await getActiveTournament()
    if (!activeTournament) {
      console.log("No active tournaments found")
      return {
        success: false,
        message: "No hay torneos activos disponibles para registro.",
      }
    }

    console.log("Active tournament found:", activeTournament.id)

    // Create Supabase client
    const supabase = createServerComponentClient()
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return {
        success: false,
        message: "Error de conexión con la base de datos.",
      }
    }

    // Check if a team with this name already exists in the tournament
    const { data: existingTeam, error: existingTeamError } = await supabase
      .from("teams")
      .select("id")
      .eq("name", teamName)
      .eq("tournament_id", activeTournament.id)
      .maybeSingle()

    if (existingTeamError) {
      console.error("Error checking existing team:", existingTeamError)
    }

    if (existingTeam) {
      console.log("Team with this name already exists")
      return {
        success: false,
        message: "Ya existe un equipo con ese nombre en este torneo.",
      }
    }

    // Format phone number (only if both countryCode and phoneNumber are provided)
    const teamPhone = countryCode && phoneNumber ? `${countryCode} ${phoneNumber}` : null
    console.log("Formatted phone number:", teamPhone)

    // Insert team with phone number
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert([
        {
          name: teamName,
          phone: teamPhone, // Now including the phone field
          tournament_id: activeTournament.id,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (teamError) {
      console.error("Error inserting team:", teamError)
      return {
        success: false,
        message: "Error al registrar el equipo: " + teamError.message,
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
    console.log("Team inserted with ID:", teamId)

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
        message: "Error al registrar los miembros del equipo: " + membersError.message,
      }
    }

    // Revalidate paths to show the updated team
    console.log("Registration successful, revalidating paths")
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
