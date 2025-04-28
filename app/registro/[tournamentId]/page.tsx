import { registerTeam, getTournamentById } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"

interface RegistrationPageProps {
  params: {
    tournamentId: string
  }
}

export default async function TournamentRegistrationPage({ params }: RegistrationPageProps) {
  const tournament = await getTournamentById(parseInt(params.tournamentId))

  // If tournament doesn't exist or is not active/upcoming, redirect to registration page
  if (!tournament || (tournament.status !== "active" && tournament.status !== "upcoming")) {
    redirect("/registro")
  }

  async function handleRegister(formData: FormData) {
    "use server"
    console.log("Servidor: Procesando registro...")
    // Asegurar que el ID del torneo se pasa correctamente en el formulario
    formData.append("tournamentId", params.tournamentId)
    const result = await registerTeam(formData)
    console.log("Servidor: Resultado del registro:", result)

    return result
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-forest-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mt-8">
          <RegistrationForm 
            activeTournament={tournament}
            handleRegister={handleRegister}
          />
        </div>
      </div>
    </div>
  )
} 