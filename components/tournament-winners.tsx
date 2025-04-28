"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Award, Medal } from "lucide-react"
import { useEffect, useState } from "react"
import { getTournamentWinners } from "@/lib/supabase/actions"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export default function TournamentWinners({ tournamentId, format }: { tournamentId: number, format: string }) {
  const { t } = useLanguage()
  const [winners, setWinners] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true)
      const result = await getTournamentWinners(tournamentId)
      setWinners(result)
      setLoading(false)
    }

    fetchWinners()
  }, [tournamentId])

  // Si está cargando o no hay ganadores, no mostrar nada
  if (loading || !winners) {
    return null
  }

  const { champion, runnerUp, semifinalists, is1v1, playerDetails } = winners

  // Animación para los ganadores
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30 mb-6 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-jade-900/40 to-forest-900/40">
        <CardTitle className="text-lg text-amber-300 drop-shadow-[0_0_5px_rgba(255,210,60,0.5)] flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-400" />
          {t("podium")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div 
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Campeón - 1er Lugar */}
          <motion.div variants={item} className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-4 shadow-lg">
              <Trophy className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="font-medium text-amber-400">{t("podiumFirstPlace")}</div>
              <div className="text-lg font-bold text-white">
                {is1v1 && playerDetails && champion 
                  ? playerDetails[champion.id]?.name
                  : champion?.name || t("notAvailable")}
              </div>
              {is1v1 && playerDetails && champion && (
                <div className="text-sm text-gray-400">
                  {t("characterClass")}: {playerDetails[champion.id]?.character_class || t("notAvailable")}
                </div>
              )}
            </div>
          </motion.div>

          {/* Subcampeón - 2do Lugar */}
          <motion.div variants={item} className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mr-4 shadow-lg">
              <Award className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="font-medium text-gray-400">{t("podiumSecondPlace")}</div>
              <div className="text-lg font-bold text-white">
                {is1v1 && playerDetails && runnerUp 
                  ? playerDetails[runnerUp.id]?.name
                  : runnerUp?.name || t("notAvailable")}
              </div>
              {is1v1 && playerDetails && runnerUp && (
                <div className="text-sm text-gray-400">
                  {t("characterClass")}: {playerDetails[runnerUp.id]?.character_class || t("notAvailable")}
                </div>
              )}
            </div>
          </motion.div>

          {/* Semifinalistas - 3er lugar */}
          {semifinalists && semifinalists.length > 0 && (
            <motion.div variants={item}>
              <div className="font-medium text-amber-700 mb-2">{t("podiumThirdPlace")}</div>
              <div className="space-y-3">
                {semifinalists.map((semi: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center mr-3 shadow-md">
                      <Medal className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {is1v1 && playerDetails && semi 
                          ? playerDetails[semi.id]?.name
                          : semi?.name || t("notAvailable")}
                      </div>
                      {is1v1 && playerDetails && semi && (
                        <div className="text-sm text-gray-400">
                          {t("characterClass")}: {playerDetails[semi.id]?.character_class || t("notAvailable")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
} 