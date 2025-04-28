// Asegurémonos de que la página se revalida correctamente
export const dynamic = "force-dynamic"
export const revalidate = 0 // Esto deshabilita el caché para esta página
export const fetchCache = "force-no-store" // Forzar que no se use caché

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Phone, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { getTournamentById, getTeamsByTournament, getTeamMembers, getMatchesByTournament } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import MatchResultForm from "@/components/admin/match-result-form"
import MatchSchedulingForm from "@/components/admin/match-scheduling-form"
import TeamEditButton from "@/components/admin/team-edit-button"
import TeamStatusChanger from "@/components/admin/team-status-changer"
import type { Match as MatchType, Team as TeamType, TeamMember as TeamMemberType } from "@/lib/types"
import RefreshButton from "@/components/refresh-button"
import AuthCheck from "@/components/admin/auth-check"
import BracketActions from "@/components/admin/bracket-actions"
import { checkAndCloseRegistration, updateTournamentStatus, toggleTournamentMode } from "@/lib/supabase/admin-actions"

import { generateBracketAction, deleteMatchesAction } from "./actions"

interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminTournamentPage({ params, searchParams }: PageProps) {
  // Convertir el ID a número de forma segura
  const id = params?.id
  if (!id || isNaN(Number(id))) {
    redirect("/admin")
  }

  const tournamentId = Number(id)
  const timestamp = typeof searchParams?.t === 'string' ? searchParams.t : Date.now().toString()

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
  let matchesError: any = null

  // Solo intentar obtener partidos si hay equipos aprobados
  // Esto evita errores cuando el torneo está en fase de registro
  if (approvedTeams.length >= 2) {
    try {
      matches = await getMatchesByTournament(tournamentId)
    } catch (error) {
      console.error("Error fetching matches:", error)
      // No establecer matchesError si estamos en fase de registro
      // Solo registrar el error en la consola
      console.log("El torneo podría estar en fase de registro, ignorando error de partidos")
    }
  } else {
    console.log("No hay suficientes equipos aprobados para generar partidos")
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
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin" className="flex items-center text-jade-400 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel de administración
          </Link>

          {/* Botón de recarga manual */}
          <Link
            href={`/admin/torneos/${tournamentId}?t=${Date.now()}`}
            className="flex items-center text-jade-400 hover:underline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar datos
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-jade-400 mb-2">Administrar Torneo</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-300">{tournament.title}</p>
            <RefreshButton className="bg-jade-600 hover:bg-jade-500 text-white" />
          </div>
        </div>

        {/* Mostrar información sobre la fase actual del torneo */}
        <div className="mb-6 p-4 bg-black/50 border border-jade-800/30 rounded-md">
          <div className="flex items-start">
            <div>
              <p className="text-jade-200 font-medium">
                Estado del torneo: <span className="text-jade-400">{tournament.status}</span>
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {approvedTeams.length < 2 ? (
                  <>
                    Este torneo está en fase de registro. Se necesitan al menos 2 equipos aprobados para generar el
                    bracket.
                    <br />
                    Equipos aprobados actualmente: {approvedTeams.length}
                  </>
                ) : matches.length === 0 ? (
                  "Hay suficientes equipos aprobados. Puedes generar el bracket cuando estés listo."
                ) : (
                  "El torneo está en curso. Puedes gestionar los partidos en las pestañas correspondientes."
                )}
              </p>
              
              {/* Información de depuración */}
              <details className="mt-3 text-xs text-gray-400">
                <summary>Información técnica del torneo (debug)</summary>
                <pre className="mt-2 p-2 bg-black/80 rounded overflow-auto max-h-60">
                  {JSON.stringify(tournament, null, 2)}
                </pre>
                <div className="mt-2">
                  <p>Equipos cargados:</p>
                  <ul className="list-disc pl-5">
                    <li>Total: {teams.length}</li>
                    <li>Pendientes: {pendingTeams.length}</li>
                    <li>Aprobados: {approvedTeams.length}</li>
                    <li>Rechazados: {rejectedTeams.length}</li>
                    <li>Expulsados: {expelledTeams.length}</li>
                  </ul>
                  <p className="mt-2">ID de equipos aprobados:</p>
                  <pre className="p-2 bg-black/80 rounded overflow-auto max-h-40">
                    {JSON.stringify(approvedTeams.map(team => ({ id: team.id, name: team.name })), null, 2)}
                  </pre>
                  <p className="mt-2 text-yellow-400">
                    Si ves que los contadores no coinciden con los equipos visibles, intenta recargar la página manualmente (Ctrl+R)
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Información y gestión de inscripciones */}
        <div className="mb-6 p-4 bg-black/50 border border-jade-800/30 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-jade-200 font-medium">
                Estado de inscripciones: 
                <span className={tournament.status === "upcoming" 
                  ? "text-green-400 ml-2" 
                  : "text-amber-400 ml-2"}>
                  {tournament.status === "upcoming" ? "Abiertas" : "Cerradas"}
                </span>
              </p>
              <p className="text-gray-300 text-sm mt-1">
                Cupo: {approvedTeams.length} de {tournament.max_participants} equipos
                {approvedTeams.length >= tournament.max_participants && (
                  <span className="text-amber-400 ml-2">
                    El torneo está lleno
                  </span>
                )}
              </p>
            </div>
            <form action={async () => {
              "use server"
              // Usar la nueva función que solo alterna el estado del torneo
              const result = await toggleTournamentMode(tournamentId)
              if (!result.success) {
                console.error("Error al actualizar el estado de las inscripciones:", result.message)
              }
              redirect(`/admin/torneos/${tournamentId}?t=${Date.now()}`)
            }}>
              <Button
                type="submit"
                className={tournament.status === "upcoming"
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-green-600 hover:bg-green-500"}
              >
                {tournament.status === "upcoming"
                  ? "Cerrar inscripciones"
                  : "Abrir inscripciones"}
              </Button>
            </form>
          </div>
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
                <p className="text-red-400 text-xs mt-2">Error: {matchesError?.message || "Desconocido"}</p>
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
                        <TeamCard
                          key={`${team.id}-${timestamp}`}
                          team={team}
                          tournamentId={tournamentId}
                          status="pending"
                        />
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
                        <TeamCard
                          key={`${team.id}-${timestamp}`}
                          team={team}
                          tournamentId={tournamentId}
                          status="approved"
                        />
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
                        <TeamCard
                          key={`${team.id}-${timestamp}`}
                          team={team}
                          tournamentId={tournamentId}
                          status="rejected"
                        />
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
                    <Badge className="ml-2 bg-red-600">{expelledTeams.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {expelledTeams.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay equipos expulsados.</p>
                  ) : (
                    <div className="space-y-4">
                      {expelledTeams.map((team) => (
                        <TeamCard
                          key={`${team.id}-${timestamp}`}
                          team={team}
                          tournamentId={tournamentId}
                          status="expelled"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partidos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Usar el nuevo componente cliente */}
              <BracketActions 
                tournamentId={tournamentId}
                approvedTeamsCount={approvedTeams.length}
                matchesCount={matches.length}
                generateBracketAction={generateBracketAction}
                deleteMatchesAction={deleteMatchesAction}
              />

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
                    <p className="text-gray-400 text-sm">
                      {approvedTeams.length < 2
                        ? "No hay suficientes equipos aprobados para crear partidos."
                        : matches.length === 0
                          ? "No hay partidos generados. Usa el botón 'Generar Bracket' para crear los partidos."
                          : "No hay partidos pendientes."}
                    </p>
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
                    <p className="text-gray-400 text-sm">
                      {matches.length === 0 ? "No hay partidos generados todavía." : "No hay partidos completados."}
                    </p>
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
                    <p className="text-gray-400 text-sm">
                      {matches.length === 0 ? "No hay partidos generados todavía." : "No hay partidos programados."}
                    </p>
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
                    <p className="text-gray-400 text-sm">
                      {matches.length === 0 ? "No hay partidos generados todavía." : "No hay partidos sin programar."}
                    </p>
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
    </AuthCheck>
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
  // Utilizar los miembros que ya vienen incluidos en el equipo en lugar de hacer una llamada adicional
  let members: TeamMemberType[] = team.members || [];

  // Add a timestamp to force re-rendering when the component is displayed
  const renderTimestamp = Date.now();

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

      <div className="space-y-1 text-sm">
        {members.length > 0 ? (
          members.map((member) => (
            <div key={`${member.id}-${renderTimestamp}`} className="flex justify-between">
              <span>{member.name}</span>
              <span className="text-gray-400 text-xs">{member.character_class}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-xs italic">No hay información de miembros disponible.</p>
        )}
      </div>

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
