// Asegurémonos de que la página se revalida correctamente
// Añade o modifica esta línea al principio del archivo
export const dynamic = "force-dynamic"
export const revalidate = 0 // Esto deshabilita el caché para esta página
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Phone, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getTournamentById, getTeamsByTournament, getTeamMembers, getMatchesByTournament } from "@/lib/supabase/actions"
import { generateInitialBracket, deleteAllMatches } from "@/lib/supabase/admin-actions"
import { redirect } from "next/navigation"
import MatchResultForm from "@/components/admin/match-result-form"
import MatchSchedulingForm from "@/components/admin/match-scheduling-form"
import TeamEditButton from "@/components/admin/team-edit-button"
import TeamStatusChanger from "@/components/admin/team-status-changer"
import type { Match as MatchType, Team as TeamType, TeamMember as TeamMemberType } from "@/lib/types"

// Acciones del servidor - definidas fuera del componente
async function generateBracketAction(formData: FormData): Promise<void> {
  "use server"
  const tournamentId = Number(formData.get("tournamentId"))
  await generateInitialBracket(tournamentId)
}

async function deleteMatchesAction(formData: FormData): Promise<void> {
  "use server"
  const tournamentId = Number(formData.get("tournamentId"))
  await deleteAllMatches(tournamentId)
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

  // Obtener partidos con manejo de errores
  let matches: MatchType[] = []
  let matchesError: Error | null = null
  try {
    matches = await getMatchesByTournament(tournamentId)
  } catch (error) {
    console.error("Error fetching matches:", error)
    matchesError = error instanceof Error ? error : new Error(String(error))
  }

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
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin" className="flex items-center text-jade-400 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al panel de administración
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jade-400 mb-2">Administrar Torneo</h1>
        <p className="text-gray-300">{tournament.title}</p>
      </div>

      {matchesError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium">Error al cargar los partidos</p>
              <p className="text-red-300 text-sm mt-1">
                Se produjo un error al intentar cargar los partidos del torneo. Intenta recargar la página o verifica la
                conexión a la base de datos.
              </p>
              <p className="text-red-400 text-xs mt-2">Error: {matchesError.message}</p>
            </div>
          </div>
        </div>
      )}

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
                      <MatchResultForm key={match.id} match={match as any} tournamentId={tournamentId} />
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
                          <MatchSchedulingForm match={match as any} tournamentId={tournamentId} />
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
                      <MatchSchedulingForm key={match.id} match={match as any} tournamentId={tournamentId} />
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
}: {
  team: TeamType
  tournamentId: number
  status: "pending" | "approved" | "rejected" | "expelled"
}) {
  // Obtener miembros del equipo con manejo de errores
  let members: TeamMemberType[] = []
  let error: Error | null = null

  try {
    members = await getTeamMembers(team.id)
  } catch (err) {
    console.error(`Error fetching members for team ${team.id}:`, err)
    error = err instanceof Error ? err : new Error(String(err))
  }

  return (
    <div className="bg-black/60 border border-jade-800/30 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-jade-400">{team.name}</h3>
        <div className="flex items-center space-x-2">
          {/* Eliminar el badge redundante y dejar solo el TeamStatusChanger */}
          <TeamStatusChanger team={team as any} tournamentId={tournamentId} currentStatus={status} />
          {status === "approved" && (
            <TeamEditButton team={team as any} members={members as any} tournamentId={tournamentId} />
          )}
        </div>
      </div>

      {error ? (
        <div className="text-red-400 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Error al cargar miembros del equipo
        </div>
      ) : (
        <div className="space-y-1 text-sm">
          {members.length > 0 ? (
            members.map((member) => (
              <div key={member.id} className="flex justify-between">
                <span>{member.name}</span>
                <span className="text-gray-400 text-xs">{member.character_class}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs italic">No hay información de miembros disponible.</p>
          )}
        </div>
      )}

      <div className="mt-2 text-xs">
        {/* Mostrar el teléfono en verde por encima del estado */}
        {team.phone && status === "pending" && (
          <div className="text-green-500 font-medium mb-1">
            <Phone className="h-3 w-3 inline-block mr-1" />
            {team.phone}
          </div>
        )}
        <div className="text-gray-400">
          {status === "approved" && team.approved_at && (
            <span>Aprobado: {new Date(team.approved_at).toLocaleDateString()}</span>
          )}
          {status === "rejected" && team.rejected_at && (
            <>
              <span>Rechazado: {new Date(team.rejected_at).toLocaleDateString()}</span>
              <p className="mt-1">Motivo: {team.rejection_reason || "No especificado"}</p>
            </>
          )}
          {status === "expelled" && team.rejected_at && (
            <>
              <span>Expulsado: {new Date(team.rejected_at).toLocaleDateString()}</span>
              <p className="mt-1">
                Motivo: {team.rejection_reason ? team.rejection_reason.replace("[Expulsado] ", "") : "No especificado"}
              </p>
            </>
          )}
          {status === "pending" && <span>Pendiente de aprobación</span>}
        </div>
      </div>
    </div>
  )
}
