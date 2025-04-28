"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Flag } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import RankingNavbar from "@/components/ranking-navbar"
import CopyrightFooter from "@/components/copyright-footer"
import RankingTabs from "@/components/ranking-tabs"

export default function RankingPage() {
  const { t } = useLanguage()

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
          <h1 className="text-3xl font-bold text-forest-400 mb-2">{t("ranking")}</h1>
          <p className="text-gray-300">{t("rankingDescription")}</p>
        </div>

        {/* Sistema de puntos y temporada antes de las pestañas */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-forest-400 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                {t("pointsSystem")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>{t("tournamentVictory")}</span>
                  <span className="font-bold text-forest-400">15 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("secondPlace")}</span>
                  <span className="font-bold text-forest-400">10 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("semifinalist")}</span>
                  <span className="font-bold text-forest-400">5 {t("points")}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("matchVictory")}</span>
                  <span className="font-bold text-forest-400">10 {t("points")}</span>
                </li>
              </ul>
              <p className="text-xs text-gray-400 mt-4">
                * La victoria en torneo otorga 15 puntos adicionales al ganador de la final
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-forest-400 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-jade-400" />
                {t("seasons")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                El sistema de temporadas estará disponible próximamente. 
                Los jugadores podrán competir por recompensas exclusivas al final de cada temporada.
              </p>
              <div className="text-sm">
                <p className="font-medium text-amber-400">¡Próximamente!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Componente de pestañas de ranking */}
        <RankingTabs />
      </div>
      <CopyrightFooter />
    </div>
  )
}
