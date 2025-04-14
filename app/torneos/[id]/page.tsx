import {
  getTournamentById,
  getTournamentRules,
  getTournamentPrizes,
  getTeamsByTournament,
} from "@/lib/supabase/actions"
import TournamentDetails from "@/components/tournament-details"
import TournamentNotFound from "@/components/tournament-not-found"

export default async function TournamentPage({ params }: { params: { id: string } }) {
  const tournamentId = Number.parseInt(params.id)

  // Obtener datos del torneo
  const tournament = await getTournamentById(tournamentId)

  if (!tournament) {
    return <TournamentNotFound />
  }

  // Obtener reglas, premios y equipos
  const rules = await getTournamentRules(tournamentId)
  const prizes = await getTournamentPrizes(tournamentId)
  const teams = await getTeamsByTournament(tournamentId)
  const approvedTeams = teams.filter((team) => team.status === "approved")

  return (
    <TournamentDetails
      tournament={tournament}
      rules={rules}
      prizes={prizes}
      approvedTeams={approvedTeams}
      tournamentId={tournamentId}
    />
  )
}
