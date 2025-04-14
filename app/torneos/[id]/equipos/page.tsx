import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { getTournamentById, getTeamsByTournament, getTeamMembers } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"

export default async function EquiposPage({ params }: { params: { id: string } }) {
  const tournamentId = Number.parseInt(params.id)

  // Obtener datos del torneo
  const tournament = await getTournamentById(tournamentId)

  if (!tournament) {
    redirect("/")
  }

  // Obtener equipos
  const teams = await getTeamsByTournament(tournamentId)
  const approvedTeams = teams.filter((team) => team.status === "approved")
  const pendingTeams = teams.filter((team) => team.status === "pending")

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/torneos/${tournamentId}`} className="flex items-center text-jade-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al torneo
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jade-400 mb-2">Equipos Participantes</h1>
        <p className="text-gray-300">{tournament.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedTeams.length === 0 && pendingTeams.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-300 mb-2">No hay equipos registrados</h2>
            <p className="text-gray-400">
              Sé el primero en registrar tu equipo para el torneo{" "}
              <Link href="/registro" className="text-jade-400 hover:underline">
                aquí
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            {/* Equipos aprobados */}
            {approvedTeams.map((team) => (
              <TeamCard key={team.id} team={team} status="approved" />
            ))}

            {/* Equipos pendientes */}
            {pendingTeams.map((team) => (
              <TeamCard key={team.id} team={team} status="pending" />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// Componente para mostrar un equipo
async function TeamCard({ team, status }: { team: any; status: "pending" | "approved" }) {
  // Obtener miembros del equipo
  const members = await getTeamMembers(team.id)

  return (
    <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-jade-400">{team.name}</CardTitle>
          {status === "approved" ? (
            <Badge className="bg-jade-600">Aprobado</Badge>
          ) : (
            <Badge className="bg-yellow-600">Pendiente</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {members.map((member, index) => (
            <div key={member.id} className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-black/60 border border-jade-800/30 flex items-center justify-center mr-2">
                <span className="text-xs">{index + 1}</span>
              </div>
              <span className="text-sm">{member.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
