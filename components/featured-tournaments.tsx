"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import TournamentSummary from "@/components/tournament-summary"
import { useLanguage } from "@/contexts/language-context"
import type { Tournament } from "@/lib/types"

export default function FeaturedTournaments() {
  const [featuredTournaments, setFeaturedTournaments] = useState<(Tournament & { total_teams: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchFeaturedTournaments() {
      try {
        const supabase = createClientComponentClient()
        
        // Obtener torneos destacados
        const { data: tournaments, error } = await supabase
          .from("tournaments")
          .select(`
            *,
            total_teams:teams!inner(count)
          `)
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) {
          console.error("Error fetching featured tournaments:", error)
          return
        }

        // Procesar los datos para obtener el recuento de equipos
        const processedTournaments = tournaments.map(tournament => ({
          ...tournament,
          total_teams: tournament.total_teams[0].count
        }))

        setFeaturedTournaments(processedTournaments)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedTournaments()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-forest-400 mb-6">{t("active")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-black/60 border border-jade-800/30 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (featuredTournaments.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-forest-400 mb-6">{t("active")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredTournaments.map(tournament => (
          <TournamentSummary 
            key={tournament.id} 
            tournament={tournament}
            totalTeams={tournament.total_teams}
          />
        ))}
      </div>
    </div>
  )
} 