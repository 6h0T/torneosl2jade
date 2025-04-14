import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Medal, Star, Swords, Flag } from "lucide-react"
import { createServerComponentClient } from "@/lib/supabase/server"
import PageLayout from "../page-layout"

export default async function RankingPage() {
  // Fetch team rankings from the database
  const supabase = createServerComponentClient()
  const { data: rankings, error } = await supabase
    .from("team_rankings")
    .select(`
      *,
      team:team_id(id, name, tournament_id)
    `)
    .order("points", { ascending: false })

  if (error) {
    console.error("Error fetching rankings:", error)
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center text-jade-400 mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la página principal
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-jade-400 mb-2">Ranking de Equipos</h1>
          <p className="text-gray-300">Clasificación de los mejores equipos por puntos de torneo</p>
        </div>

        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-jade-400">Tabla de Clasificación</CardTitle>
          </CardHeader>
          <CardContent>
            {!rankings || rankings.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-jade-600/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-jade-400 mb-2">No hay equipos clasificados</h3>
                <p className="text-gray-400">
                  Los equipos aparecerán en el ranking una vez que hayan participado en torneos.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-jade-800/30">
                      <th className="px-4 py-3 text-left text-jade-400 font-medium">Posición</th>
                      <th className="px-4 py-3 text-left text-jade-400 font-medium">Equipo</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">Puntos</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">Victorias</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">Derrotas</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">Torneos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((ranking, index) => (
                      <tr
                        key={ranking.id}
                        className={`border-b border-jade-800/20 ${
                          index < 3 ? "bg-jade-900/10" : "hover:bg-black/40"
                        } transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                            {index === 1 && <Medal className="h-5 w-5 text-gray-400 mr-2" />}
                            {index === 2 && <Medal className="h-5 w-5 text-amber-700 mr-2" />}
                            {index > 2 && <span className="w-5 mr-2 text-center">{index + 1}</span>}
                            {index < 3 && <Badge className="bg-jade-600">{index + 1}</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Link
                            href={`/torneos/${ranking.team?.tournament_id}/equipos`}
                            className="hover:text-jade-400 transition-colors"
                          >
                            {ranking.team?.name || "Equipo desconocido"}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-jade-400 font-bold">{ranking.points}</span>
                        </td>
                        <td className="px-4 py-3 text-center">{ranking.wins}</td>
                        <td className="px-4 py-3 text-center">{ranking.losses}</td>
                        <td className="px-4 py-3 text-center">{ranking.tournaments_played}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-jade-400 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Sistema de Puntos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Victoria en torneo</span>
                  <span className="font-bold text-jade-400">100 puntos</span>
                </li>
                <li className="flex justify-between">
                  <span>2º puesto</span>
                  <span className="font-bold text-jade-400">75 puntos</span>
                </li>
                <li className="flex justify-between">
                  <span>Semifinalista</span>
                  <span className="font-bold text-jade-400">50 puntos</span>
                </li>
                <li className="flex justify-between">
                  <span>Cuartofinalista</span>
                  <span className="font-bold text-jade-400">25 puntos</span>
                </li>
                <li className="flex justify-between">
                  <span>Victoria en partido</span>
                  <span className="font-bold text-jade-400">10 puntos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-jade-400 flex items-center">
                <Swords className="h-5 w-5 mr-2 text-red-500" />
                Estadísticas de Combate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Las estadísticas se actualizan automáticamente después de cada partido y torneo finalizado.
              </p>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Victorias</span>
                  <span>Total de partidos ganados</span>
                </li>
                <li className="flex justify-between">
                  <span>Derrotas</span>
                  <span>Total de partidos perdidos</span>
                </li>
                <li className="flex justify-between">
                  <span>Torneos</span>
                  <span>Participaciones en torneos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-jade-400 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-jade-400" />
                Temporadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                El ranking actual corresponde a la temporada en curso. Al finalizar la temporada, se entregarán
                recompensas a los equipos mejor clasificados.
              </p>
              <div className="text-sm">
                <p className="font-medium text-jade-400">Temporada actual: 2023-Q3</p>
                <p className="text-xs text-gray-400 mt-1">Finaliza: 30 de septiembre de 2023</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
