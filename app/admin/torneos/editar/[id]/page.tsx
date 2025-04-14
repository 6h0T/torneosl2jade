import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import TournamentForm from "@/components/admin/tournament-form"
import AuthCheck from "@/components/admin/auth-check"
import { getTournamentById, getTournamentPrizes, getTournamentRules } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"

export default async function EditTournamentPage({ params }: { params: { id: string } }) {
  const tournamentId = Number.parseInt(params.id)

  // Obtener datos del torneo
  const tournament = await getTournamentById(tournamentId)

  if (!tournament) {
    redirect("/admin")
  }

  // Obtener premios y reglas
  const prizes = await getTournamentPrizes(tournamentId)
  const rules = await getTournamentRules(tournamentId)

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center text-jade-400 mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al panel de administración
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-jade-400 mb-2">Editar Torneo</h1>
          <p className="text-gray-300">Realiza los cambios necesarios en la información del torneo y sus premios.</p>
        </div>

        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-jade-400">Información del Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <TournamentForm tournament={tournament} prizes={prizes} rules={rules} />
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  )
}
