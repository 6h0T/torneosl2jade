import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { getTournamentById, getTeamsByTournament, getTeamMembers, getMatchesByTournament } from "@/lib/supabase/actions"
import { generateInitialBracket, deleteAllMatches } from "@/lib/supabase/admin-actions"
import { redirect } from "next/navigation"
import MatchResultForm from "@/components/admin/match-result-form"
import MatchSchedulingForm from "@/components/admin/match-scheduling-form"
import TeamEditButton from "@/components/admin/team-edit-button"
import TeamStatusChanger from "@/components/admin/team-status-changer"

// Acciones del servidor - definidas fuera del componente
async function generateBracketAction(formData: FormData) {
  "use server"
  const tournamentId = Number(formData.get("tournamentId"))
  await generateInitialBracket(tournamentId)
  return { success: true }
}

async function deleteMatchesAction(formData: FormData) {
  "use server"
  const tournamentId = Number(formData.get("tournamentId"))
  await deleteAllMatches(tournamentId)
  return { success: true }
}

export default async function AdminTournamentPage({ params }: { params: { id: string } }) {
  const tournamentId = Number.parseInt(params.id)

  // Obtener datos del torneo
  const tournament = await getTournamentById(tournamentId)

  if (!tournament) {
    redirect("/admin")
  }

  // Obtener equipos
  const teams = await getTeamsByTournament(tournamentId)
  const pendingTeams = teams.filter((team) => team.status === "pending")
  const approvedTeams = teams.filter((team) => team.status === "approved")
  const rejectedTeams = teams.filter((team) => team.status === "rejected")
  const expelledTeams = teams.filter((team) => team.status === "expelled")

  // Obtener partidos
  const matches = await getMatchesByTournament(tournamentId)
  const pendingMatches = matches.filter((match) => match.status === "pending" && match.team1_id && match.team2_id)
  const completedMatches = matches.filter((match) => match.status === "completed")
  const upcomingMatches = matches.filter(
    (match) => match.status === "pending" && match.team1_id && match.team2_id && match.match_date,
  )
  const unscheduledMatches = matches.filter(
    (match) => match.status === "pending" && match.team1_id && match.team2_id && !match.match_date,
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin" className="flex items-center text-jade-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al panel de administración
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jade-400 mb-2">Administrar Torneo</h1>
        <p className="text-gray-300">{tournament.title}</p>
      </div>

      <Tabs defaultValue="equipos" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-4 bg-black/80 border border-jade-800/30">
          <TabsTrigger
            value="equipos"
            className="data-[state=active]:bg-jade-900/80 data-[state=active]:text-jade-100 data-[state=active]:shadow-[0_0_10px_rgba(0,255,170,0.3)]"
          >
            Equipos
          </TabsTrigger>
          <TabsTrigger
            value="partidos"
            className="data-[state=active]:bg-jade-900/80 data-[state=active]:text-jade-100 data-[state=active]:shadow-[0_0_10px_rgba(0,255,170,0.3)]"
          >
            Partidos
          </TabsTrigger>
          <TabsTrigger
            value="calendario"
            className="data-[state=active]:bg-jade-900/80 data-[state=active]:text-jade-100 data-[state=active]:shadow-[0_0_10px_rgba(0,255,170,0.3)]"
          >
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Equipos pendientes */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Equipos Pendientes
                  <Badge className="ml-2 bg-yellow-600">{pendingTeams.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {pendingTeams.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay equipos pendientes.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingTeams.map((team) => (
                      <TeamCard key={team.id} team={team} tournamentId={tournamentId} status="pending" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipos aprobados */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Equipos Aprobados
                  <Badge className="ml-2 bg-jade-600">{approvedTeams.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {approvedTeams.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay equipos aprobados.</p>
                ) : (
                  <div className="space-y-4">
                    {approvedTeams.map((team) => (
                      <TeamCard key={team.id} team={team} tournamentId={tournamentId} status="approved" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipos rechazados */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Equipos Rechazados
                  <Badge className="ml-2 bg-red-600">{rejectedTeams.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {rejectedTeams.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay equipos rechazados.</p>
                ) : (
                  <div className="space-y-4">
                    {rejectedTeams.map((team) => (
                      <TeamCard key={team.id} team={team} tournamentId={tournamentId} status="rejected" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipos expulsados */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Equipos Expulsados
                  <Badge className="ml-2 bg-amber-600">{expelledTeams.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {expelledTeams.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay equipos expulsados.</p>
                ) : (
                  <div className="space-y-4">
                    {expelledTeams.map((team) => (
                      <TeamCard key={team.id} team={team} tournamentId={tournamentId} status="expelled" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partidos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Acciones de bracket */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400">Acciones de Bracket</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">
                    Genera el bracket inicial con los equipos aprobados. Esto creará automáticamente los partidos según
                    el número de equipos.
                  </p>
                  <form action={generateBracketAction}>
                    <input type="hidden" name="tournamentId" value={tournamentId} />
                    <Button
                      type="submit"
                      className="w-full bg-jade-600 hover:bg-jade-700 text-white"
                      disabled={approvedTeams.length < 2}
                    >
                      Generar Bracket
                    </Button>
                  </form>
                </div>

                <div className="pt-4 border-t border-jade-800/30">
                  <p className="text-sm text-gray-300 mb-2">
                    Elimina todos los partidos del torneo. Esto te permitirá regenerar el bracket desde cero.
                  </p>
                  <form action={deleteMatchesAction}>
                    <input type="hidden" name="tournamentId" value={tournamentId} />
                    <Button type="submit" variant="destructive" className="w-full" disabled={matches.length === 0}>
                      Eliminar Todos los Partidos
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Partidos pendientes */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Partidos Pendientes
                  <Badge className="ml-2 bg-yellow-600">{pendingMatches.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {pendingMatches.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay partidos pendientes.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingMatches.map((match) => (
                      <MatchResultForm key={match.id} match={match} tournamentId={tournamentId} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partidos completados */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Partidos Completados
                  <Badge className="ml-2 bg-jade-600">{completedMatches.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {completedMatches.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay partidos completados.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedMatches.map((match) => (
                      <div key={match.id} className="bg-black/60 border border-jade-800/30 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-jade-400 font-medium">
                            {match.phase === "roundOf16"
                              ? "Octavos"
                              : match.phase === "quarterFinals"
                                ? "Cuartos"
                                : match.phase === "semiFinals"
                                  ? "Semifinal"
                                  : "Final"}
                          </span>
                          <Badge className="bg-jade-600">Completado</Badge>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span>{match.team1?.name || "TBD"}</span>
                          <span className="font-bold">{match.team1_score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{match.team2?.name || "TBD"}</span>
                          <span className="font-bold">{match.team2_score}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">Ganador: {match.winner?.name || "Empate"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partidos programados */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Partidos Programados
                  <Badge className="ml-2 bg-jade-600">{upcomingMatches.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {upcomingMatches.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay partidos programados.</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                      <div key={match.id} className="bg-black/60 border border-jade-800/30 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-jade-400 font-medium">
                            {match.phase === "roundOf16"
                              ? "Octavos"
                              : match.phase === "quarterFinals"
                                ? "Cuartos"
                                : match.phase === "semiFinals"
                                  ? "Semifinal"
                                  : "Final"}
                          </span>
                          <Badge className="bg-yellow-600">Programado</Badge>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span>{match.team1?.name || "TBD"}</span>
                          <span>vs</span>
                          <span>{match.team2?.name || "TBD"}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400 flex justify-between">
                          <span>Fecha: {match.match_date}</span>
                          <span>Hora: {match.match_time || "Por definir"}</span>
                        </div>
                        <div className="mt-3">
                          <MatchSchedulingForm match={match} tournamentId={tournamentId} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partidos sin programar */}
            <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader>
                <CardTitle className="text-lg text-jade-400 flex items-center">
                  Partidos Sin Programar
                  <Badge className="ml-2 bg-red-600">{unscheduledMatches.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {unscheduledMatches.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay partidos sin programar.</p>
                ) : (
                  <div className="space-y-4">
                    {unscheduledMatches.map((match) => (
                      <MatchSchedulingForm key={match.id} match={match} tournamentId={tournamentId} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para mostrar un equipo
async function TeamCard({
  team,
  tournamentId,
  status,
}: { team: any; tournamentId: number; status: "pending" | "approved" | "rejected" | "expelled" }) {
  // Obtener miembros del equipo
  const members = await getTeamMembers(team.id)

  return (
    <div className="bg-black/60 border border-jade-800/30 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-jade-400">{team.name}</h3>
        <div className="flex items-center space-x-2">
          {/* Eliminar el badge redundante y dejar solo el TeamStatusChanger */}
          <TeamStatusChanger team={team} tournamentId={tournamentId} currentStatus={status} />
          {status === "approved" && <TeamEditButton team={team} members={members} tournamentId={tournamentId} />}
        </div>
      </div>
      <div className="space-y-1 text-sm">
        {members.map((member) => (
          <div key={member.id} className="flex justify-between">
            <span>{member.name}</span>
            <span className="text-gray-400 text-xs">{member.character_class}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {status === "approved" && <span>Aprobado: {new Date(team.approved_at).toLocaleDateString()}</span>}
        {status === "rejected" && (
          <>
            <span>Rechazado: {new Date(team.rejected_at).toLocaleDateString()}</span>
            <p className="mt-1">Motivo: {team.rejection_reason || "No especificado"}</p>
          </>
        )}
        {status === "expelled" && (
          <>
            <span>Expulsado: {new Date(team.expelled_at).toLocaleDateString()}</span>
            <p className="mt-1">Motivo: {team.expulsion_reason || "No especificado"}</p>
          </>
        )}
        {status === "pending" && <span>Pendiente de aprobación</span>}
      </div>
    </div>
  )
}
