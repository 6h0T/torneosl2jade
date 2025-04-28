"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, UserCircle, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { getRankingsByFormat } from "@/lib/supabase/actions"

export default function RankingTabs() {
  const [rankings, setRankings] = useState<{
    solo: any[],
    duo: any[],
    team: any[]
  }>({
    solo: [],
    duo: [],
    team: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchRankings() {
      try {
        setIsLoading(true)
        const result = await getRankingsByFormat()
        setRankings(result)
      } catch (error) {
        console.error("Error fetching rankings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankings()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-forest-400 border-r-transparent"></div>
          <p className="mt-4 text-forest-300">{t("loadingRankings")}</p>
        </div>
      </div>
    )
  }

  const hasAnyRankings = rankings.solo.length > 0 || rankings.duo.length > 0 || rankings.team.length > 0

  if (!hasAnyRankings) {
    return (
      <div className="text-center py-8">
        <Trophy className="h-12 w-12 text-forest-600/50 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-forest-400 mb-2">{t("noRankedTeams")}</h3>
        <p className="text-gray-400">{t("teamsWillAppearAfterParticipation")}</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="solo" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="solo" className="data-[state=active]:bg-jade-700 data-[state=active]:text-white">
          <UserCircle className="mr-2 h-4 w-4" />
          1vs1
        </TabsTrigger>
        <TabsTrigger value="duo" className="data-[state=active]:bg-jade-700 data-[state=active]:text-white">
          <Users className="mr-2 h-4 w-4" />
          2vs2
        </TabsTrigger>
        <TabsTrigger value="team" className="data-[state=active]:bg-jade-700 data-[state=active]:text-white">
          <Users className="mr-2 h-4 w-4" />
          3vs3
        </TabsTrigger>
      </TabsList>

      {/* Contenido para 1vs1 */}
      <TabsContent value="solo">
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-forest-400 flex items-center">
              <UserCircle className="mr-2 h-5 w-5" />
              {t("soloRanking")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankings.solo.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">{t("noSoloRankings")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-jade-800/30">
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("position")}</th>
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("player")}</th>
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("characterClass")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("points")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("wins")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("losses")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.solo.map((ranking, index) => (
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
                            {index < 3 && <Badge className="bg-forest-600">{index + 1}</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Link
                            href={`/torneos/${ranking.team?.tournament_id}/equipos`}
                            className="hover:text-forest-400 transition-colors"
                          >
                            {ranking.playerName || t("unknownPlayer")}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {ranking.characterClass || t("notSpecified")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-forest-400 font-bold">{ranking.points}</span>
                        </td>
                        <td className="px-4 py-3 text-center">{ranking.wins}</td>
                        <td className="px-4 py-3 text-center">{ranking.losses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Contenido para 2vs2 */}
      <TabsContent value="duo">
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-forest-400 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              {t("duoRanking")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankings.duo.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">{t("noDuoRankings")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-jade-800/30">
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("position")}</th>
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("team")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("points")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("wins")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("losses")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("tournamentsPlayed")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.duo.map((ranking, index) => (
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
                            {index < 3 && <Badge className="bg-forest-600">{index + 1}</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Link
                            href={`/torneos/${ranking.team?.tournament_id}/equipos`}
                            className="hover:text-forest-400 transition-colors"
                          >
                            {ranking.team?.name || t("unknownTeam")}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-forest-400 font-bold">{ranking.points}</span>
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
      </TabsContent>

      {/* Contenido para 3vs3 */}
      <TabsContent value="team">
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-forest-400 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              {t("teamRanking")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankings.team.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">{t("noTeamRankings")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-jade-800/30">
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("position")}</th>
                      <th className="px-4 py-3 text-left text-forest-400 font-medium">{t("team")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("points")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("wins")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("losses")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("tournamentsPlayed")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.team.map((ranking, index) => (
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
                            {index < 3 && <Badge className="bg-forest-600">{index + 1}</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Link
                            href={`/torneos/${ranking.team?.tournament_id}/equipos`}
                            className="hover:text-forest-400 transition-colors"
                          >
                            {ranking.team?.name || t("unknownTeam")}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-forest-400 font-bold">{ranking.points}</span>
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
      </TabsContent>
    </Tabs>
  )
} 