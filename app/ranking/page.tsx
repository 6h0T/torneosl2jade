"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, Swords, Flag } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import RankingNavbar from "@/components/ranking-navbar"
import CopyrightFooter from "@/components/copyright-footer"

export default function RankingPage() {
  const [rankings, setRankings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchRankings() {
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("team_rankings")
          .select(`
            *,
            team:team_id(id, name, tournament_id)
          `)
          .order("points", { ascending: false })

        if (error) {
          console.error("Error fetching rankings:", error)
          return
        }

        setRankings(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankings()
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col hide-scrollbar"
      style={{
        backgroundImage: "url(/background-detail.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <RankingNavbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-jade-400 mb-2">{t("teamRanking")}</h1>
          <p className="text-gray-300">{t("rankingDescription")}</p>
        </div>

        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-jade-400">{t("rankingTable")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jade-400 border-r-transparent"></div>
                  <p className="mt-4 text-jade-300">{t("loadingRankings")}</p>
                </div>
              </div>
            ) : !rankings || rankings.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-jade-600/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-jade-400 mb-2">{t("noRankedTeams")}</h3>
                <p className="text-gray-400">{t("teamsWillAppearAfterParticipation")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-jade-800/30">
                      <th className="px-4 py-3 text-left text-jade-400 font-medium">{t("position")}</th>
                      <th className="px-4 py-3 text-left text-jade-400 font-medium">{t("team")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("points")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("wins")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("losses")}</th>
                      <th className="px-4 py-3 text-center text-jade-400 font-medium">{t("tournamentsPlayed")}</th>
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
                            {ranking.team?.name || t("unknownTeam")}
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
                {t("pointsSystem")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>{t("tournamentVictory")}</span>
                  <span className="font-bold text-jade-400">100 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("secondPlace")}</span>
                  <span className="font-bold text-jade-400">75 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("semifinalist")}</span>
                  <span className="font-bold text-jade-400">50 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("quarterfinalist")}</span>
                  <span className="font-bold text-jade-400">25 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("matchVictory")}</span>
                  <span className="font-bold text-jade-400">10 {t("points")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-jade-400 flex items-center">
                <Swords className="h-5 w-5 mr-2 text-red-500" />
                {t("combatStatistics")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">{t("statisticsUpdateAutomatically")}</p>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>{t("wins")}</span>
                  <span>{t("totalMatchesWon")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("losses")}</span>
                  <span>{t("totalMatchesLost")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("tournaments")}</span>
                  <span>{t("tournamentParticipations")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-jade-400 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-jade-400" />
                {t("seasons")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">{t("currentSeasonDescription")}</p>
              <div className="text-sm">
                <p className="font-medium text-jade-400">{t("currentSeason")}: 2023-Q3</p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("endsOn")}: 30 {t("september")} 2023
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CopyrightFooter />
    </div>
  )
}
