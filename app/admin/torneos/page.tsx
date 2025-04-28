import { getTournaments } from "@/lib/supabase/actions"
import { updateTournamentStatus } from "@/lib/supabase/admin"

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments()

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-forest-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-forest-200 mb-8">Administrar Torneos</h1>
        <div className="space-y-8">
          {tournaments.map((tournament) => (
            <form
              key={tournament.id}
              action={async (formData) => {
                "use server"
                const newStatus = formData.get("status") as string
                await updateTournamentStatus(tournament.id, newStatus)
              }}
              className="bg-black/80 rounded-lg p-6 border border-jade-800/30"
            >
              <h2 className="text-xl font-semibold text-forest-100 mb-2">{tournament.title}</h2>
              <div className="mb-4">
                <label className="block text-forest-300 mb-1">Estado actual:</label>
                <span className="text-jade-400 font-bold">{tournament.status}</span>
              </div>
              <div className="mb-4">
                <label className="block text-forest-300 mb-1">Cambiar estado:</label>
                <select
                  name="status"
                  defaultValue={tournament.status}
                  className="bg-forest-900 text-white border border-forest-700 rounded px-3 py-2"
                >
                  <option value="upcoming">Inscripciones abiertas</option>
                  <option value="active">En curso</option>
                  <option value="completed">Finalizado</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-jade-700 hover:bg-jade-600 text-white font-bold px-6 py-2 rounded"
              >
                Guardar
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
} 