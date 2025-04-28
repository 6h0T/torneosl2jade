// Asegurarnos de que estamos importando el archivo correcto
import { registerTeam } from "./actions"
import { getActiveTournament, getTournaments } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"
import TournamentSelector from "@/components/tournament-selector"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function RegistrationPage() {
  // Obtener TODOS los torneos sin filtrar por estado
  const allTournaments = await getTournaments()
  
  // Log de diagnóstico
  console.log("Torneos disponibles para registro:", allTournaments?.map(t => ({
    id: t.id,
    title: t.title,
    status: t.status
  })))
  
  // Filtrar torneos activos y próximos
  const availableTournaments = allTournaments?.filter(
    t => t.status === "active" || t.status === "upcoming"
  ) || []

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
          {availableTournaments.length > 0 ? (
            <TournamentSelector tournaments={availableTournaments} />
          ) : (
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-xl text-forest-400">No hay torneos disponibles</CardTitle>
                <CardDescription className="text-forest-200">
                  Actualmente no hay torneos con inscripciones abiertas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-amber-950/50 border border-amber-900/50 text-amber-200 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm">Los torneos con estado "Próximo" o "Activo" aparecerán aquí para permitir registros.</p>
                      <p className="text-sm mt-2">Por favor, vuelve más tarde cuando haya torneos disponibles.</p>
                    </div>
                  </div>
                </div>
                <Link href="/" className="text-forest-400 hover:underline block text-center">
                  Volver al inicio
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
