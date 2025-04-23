"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TournamentSummary from "@/components/tournament-summary"
import { useLanguage } from "@/contexts/language-context"
import type { Tournament } from "@/lib/types"

export default function TournamentsList() {
  const [tournaments, setTournaments] = useState<{
    active: (Tournament & { total_teams: number })[]
    upcoming: (Tournament & { total_teams: number })[]
    past: (Tournament & { total_teams: number })[]
  }>({
    active: [],
    upcoming: [],
    past: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const supabase = createClientComponentClient()
        
        // Obtener todos los torneos
        const { data, error } = await supabase
          .from("tournaments")
          .select(`
            *,
            total_teams:teams!inner(count)
          `)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching tournaments:", error)
          return
        }

        // Procesar los datos y agrupar por estado
        const processedTournaments = data.map(tournament => ({
          ...tournament,
          total_teams: tournament.total_teams[0].count
        }))

        const active = processedTournaments.filter(t => t.status === "active")
        const upcoming = processedTournaments.filter(t => t.status === "upcoming")
        const past = processedTournaments.filter(t => t.status === "completed")

        setTournaments({
          active,
          upcoming,
          past
        })
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-jade-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-6 bg-black/80 border border-jade-800/30">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-jade-900/80 data-[state=active]:text-jade-100 data-[state=active]:shadow-[0_0_10px_rgba(0,255,170,0.3)]"
          >
            {t("active")}
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-jade-900/80 data-[state=active]:text-jade-100 data-[state=active]:shadow-[0_0_10px_rgba(0,255,170,0.3)]"
          >
            {t("upcoming")}
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-jade-900/80 data-[state=active]:text-jade-100 data-[state=active]:shadow-[0_0_10px_rgba(0,255,170,0.3)]"
          >
            {t("past")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {tournaments.active.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t("noActiveTournaments")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.active.map(tournament => (
                <TournamentSummary 
                  key={tournament.id} 
                  tournament={tournament}
                  totalTeams={tournament.total_teams}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          {tournaments.upcoming.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t("noUpcomingTournaments")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.upcoming.map(tournament => (
                <TournamentSummary 
                  key={tournament.id} 
                  tournament={tournament}
                  totalTeams={tournament.total_teams}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          {tournaments.past.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t("noCompletedTournaments")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournaments.past.map(tournament => (
                <TournamentSummary 
                  key={tournament.id} 
                  tournament={tournament}
                  totalTeams={tournament.total_teams}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 