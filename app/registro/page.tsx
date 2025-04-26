// Asegurarnos de que estamos importando el archivo correcto
import { registerTeam } from "./actions"
import { getActiveTournament, getTournaments } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"
import TournamentSelector from "@/components/tournament-selector"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function RegistrationPage() {
  // Get all active tournaments
  const tournaments = await getTournaments("active")

  // If no tournaments available, redirect to home page
  if (!tournaments || tournaments.length === 0) {
    redirect("/")
  }

  async function handleRegister(formData: FormData) {
    "use server"
    console.log("Servidor: Procesando registro...")
    const result = await registerTeam(formData)
    console.log("Servidor: Resultado del registro:", result)

    return result
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-forest-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-forest-100">
            Registro de Equipo
          </h2>
          <p className="mt-2 text-sm text-forest-200">
            Selecciona un torneo y completa el formulario para registrar tu equipo
          </p>
        </div>

        <div className="mt-8">
          <TournamentSelector tournaments={tournaments} />
        </div>
      </div>
    </div>
  )
}
