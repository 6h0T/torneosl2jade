import PageLayout from "./page-layout"
import { getTournaments, getTeamsByTournament } from "@/lib/supabase/actions"
import HomeContent from "@/components/home-content"

export default async function Home() {
  // Obtener torneos de la base de datos
  const activeTournaments = await getTournaments("active")
  const upcomingTournaments = await getTournaments("upcoming")
  const completedTournaments = await getTournaments("completed")

  // Obtener información de participantes para torneos activos y próximos
  const activeParticipantsInfo = await Promise.all(
    activeTournaments.map(async (tournament) => {
      const teams = await getTeamsByTournament(tournament.id, "approved")
      return {
        id: tournament.id,
        count: teams.length,
        max: tournament.max_participants || 32,
      }
    }),
  )

  // Obtener información de participantes para torneos próximos
  const upcomingParticipantsInfo = await Promise.all(
    upcomingTournaments.map(async (tournament) => {
      const teams = await getTeamsByTournament(tournament.id, "approved")
      return {
        id: tournament.id,
        count: teams.length,
        max: tournament.max_participants || 32,
      }
    }),
  )

  return (
    <PageLayout>
      <HomeContent
        activeTournaments={activeTournaments}
        upcomingTournaments={upcomingTournaments}
        completedTournaments={completedTournaments}
        activeParticipantsInfo={activeParticipantsInfo}
        upcomingParticipantsInfo={upcomingParticipantsInfo}
      />
    </PageLayout>
  )
}
