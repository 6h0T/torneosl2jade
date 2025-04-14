"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Users, Shield } from "lucide-react"
import { BracketConnector } from "@/components/ui/bracket-connector"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Match } from "@/lib/types"

export default function TournamentBracket({ tournamentId }: { tournamentId: number }) {
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const bracketRef = useRef<HTMLDivElement>(null)
  const [matches, setMatches] = useState<{
    roundOf16: Match[]
    quarterFinals: Match[]
    semiFinals: Match[]
    final: Match[]
  }>({
    roundOf16: [],
    quarterFinals: [],
    semiFinals: [],
    final: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const supabase = createClientComponentClient()

        // Obtener todos los partidos del torneo
        const { data, error } = await supabase
          .from("matches")
          .select(
            `
            *,
            team1:team1_id(id, name),
            team2:team2_id(id, name),
            winner:winner_id(id, name)
          `,
          )
          .eq("tournament_id", tournamentId)
          .order("match_order", { ascending: true })

        if (error) {
          console.error("Error fetching matches:", error)
          return
        }

        if (data && data.length > 0) {
          // Organizar los partidos por fase
          const roundOf16 = data.filter((match) => match.phase === "roundOf16")
          const quarterFinals = data.filter((match) => match.phase === "quarterFinals")
          const semiFinals = data.filter((match) => match.phase === "semiFinals")
          const final = data.filter((match) => match.phase === "final")

          setMatches({
            roundOf16,
            quarterFinals,
            semiFinals,
            final,
          })
        } else {
          // Si no hay partidos, mostrar mensaje
          setMatches({
            roundOf16: [],
            quarterFinals: [],
            semiFinals: [],
            final: [],
          })
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()

    // Configurar actualización en tiempo real
    const supabase = createClientComponentClient()

    const matchesSubscription = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => {
          // Cuando hay cambios, actualizar los datos
          fetchMatches()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(matchesSubscription)
    }
  }, [tournamentId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jade-400 border-r-transparent"></div>
          <p className="mt-4 text-jade-300">Cargando bracket del torneo...</p>
        </div>
      </div>
    )
  }

  // Si no hay partidos, mostrar mensaje
  if (
    matches.roundOf16.length === 0 &&
    matches.quarterFinals.length === 0 &&
    matches.semiFinals.length === 0 &&
    matches.final.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-jade-300 mb-4">El bracket del torneo aún no está disponible.</p>
          <p className="text-gray-400 text-sm">Los partidos se generarán una vez que se hayan aprobado los equipos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="md:hidden mb-4 p-3 bg-black/80 backdrop-blur-sm border border-jade-800/30 rounded-lg text-sm text-jade-300">
        <p>Para una mejor experiencia, gira tu dispositivo horizontalmente o desliza para ver el bracket completo.</p>
      </div>
      <div className="relative">
        {/* Panel de información del partido seleccionado */}
        {selectedMatch && (
          <MatchInfoPanel
            match={
              matches.roundOf16.find((m) => m.id.toString() === selectedMatch) ||
              matches.quarterFinals.find((m) => m.id.toString() === selectedMatch) ||
              matches.semiFinals.find((m) => m.id.toString() === selectedMatch) ||
              matches.final.find((m) => m.id.toString() === selectedMatch)
            }
            onClose={() => setSelectedMatch(null)}
          />
        )}

        {/* Bracket principal */}
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="min-w-[900px] w-full p-2" ref={bracketRef}>
            <div className="flex justify-between relative">
              {/* Octavos de Final */}
              {matches.roundOf16.length > 0 && (
                <>
                  <div className="w-[170px] z-10 flex flex-col">
                    <h3
                      className={`text-sm font-medium mb-3 ${
                        matches.roundOf16.every((m) => m.status === "completed")
                          ? "text-gray-500"
                          : "text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]"
                      }`}
                    >
                      Octavos de Final
                    </h3>
                    <div className="space-y-3 flex-grow">
                      {matches.roundOf16.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          isHovered={hoveredMatch === match.id.toString()}
                          isSelected={selectedMatch === match.id.toString()}
                          onHover={setHoveredMatch}
                          onClick={setSelectedMatch}
                          isCompleted={match.status === "completed"}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Líneas de conexión para octavos a cuartos */}
                  <div className="w-[60px] relative z-0">
                    <div className="absolute inset-0">
                      <BracketConnector
                        inputs={matches.roundOf16.map((m) => m.id.toString())}
                        outputs={matches.quarterFinals.map((m) => m.id.toString())}
                        isCompleted={matches.roundOf16.every((m) => m.status === "completed")}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Cuartos de Final */}
              {matches.quarterFinals.length > 0 && (
                <>
                  <div className="w-[170px] z-10 flex flex-col">
                    <h3
                      className={`text-sm font-medium mb-3 ${
                        matches.quarterFinals.every((m) => m.status === "completed")
                          ? "text-gray-500"
                          : "text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]"
                      }`}
                    >
                      Cuartos de Final
                    </h3>
                    <div className="flex-grow flex flex-col justify-around">
                      {matches.quarterFinals.map((match) => (
                        <div key={match.id} className="py-2">
                          <MatchCard
                            match={match}
                            isHovered={hoveredMatch === match.id.toString()}
                            isSelected={selectedMatch === match.id.toString()}
                            onHover={setHoveredMatch}
                            onClick={setSelectedMatch}
                            isCompleted={match.status === "completed"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Líneas de conexión para cuartos a semifinales */}
                  <div className="w-[60px] relative z-0">
                    <div className="absolute inset-0">
                      <BracketConnector
                        inputs={matches.quarterFinals.map((m) => m.id.toString())}
                        outputs={matches.semiFinals.map((m) => m.id.toString())}
                        isCompleted={matches.quarterFinals.every((m) => m.status === "completed")}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Semifinales */}
              {matches.semiFinals.length > 0 && (
                <>
                  <div className="w-[170px] z-10 flex flex-col">
                    <h3
                      className={`text-sm font-medium mb-3 ${
                        matches.semiFinals.every((m) => m.status === "completed")
                          ? "text-gray-500"
                          : "text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]"
                      }`}
                    >
                      Semifinales
                    </h3>
                    <div className="flex-grow flex flex-col justify-around">
                      {matches.semiFinals.map((match) => (
                        <div key={match.id} className="py-2">
                          <MatchCard
                            match={match}
                            isHovered={hoveredMatch === match.id.toString()}
                            isSelected={selectedMatch === match.id.toString()}
                            onHover={setHoveredMatch}
                            onClick={setSelectedMatch}
                            isCompleted={match.status === "completed"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Líneas de conexión para semifinales a final */}
                  <div className="w-[60px] relative z-0">
                    <div className="absolute inset-0">
                      <BracketConnector
                        inputs={matches.semiFinals.map((m) => m.id.toString())}
                        outputs={matches.final.map((m) => m.id.toString())}
                        isCompleted={matches.semiFinals.every((m) => m.status === "completed")}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Final */}
              {matches.final.length > 0 && (
                <div className="w-[170px] z-10 flex flex-col">
                  <h3 className="text-sm font-medium mb-3 text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
                    Final
                  </h3>
                  <div className="flex-grow flex items-center justify-center">
                    {matches.final.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        isHovered={hoveredMatch === match.id.toString()}
                        isSelected={selectedMatch === match.id.toString()}
                        onHover={setHoveredMatch}
                        onClick={setSelectedMatch}
                        isCompleted={match.status === "completed"}
                        isFinal={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MatchCardProps {
  match: Match
  isHovered: boolean
  isSelected: boolean
  isCompleted: boolean
  onHover: (id: string | null) => void
  onClick: (id: string | null) => void
  isFinal?: boolean
}

function MatchCard({ match, isHovered, isSelected, isCompleted, onHover, onClick, isFinal = false }: MatchCardProps) {
  const team1Name = match.team1?.name || "Por determinar"
  const team2Name = match.team2?.name || "Por determinar"
  const team1Score = match.team1_score !== null ? match.team1_score : "-"
  const team2Score = match.team2_score !== null ? match.team2_score : "-"
  const winnerName = match.winner?.name || null
  const team1Won = winnerName === team1Name
  const team2Won = winnerName === team2Name
  const isPending = match.status === "pending"

  return (
    <div
      id={match.id.toString()}
      className={`relative border rounded-md cursor-pointer transition-all duration-300
                ${isHovered || isSelected ? "border-jade-400 shadow-[0_0_10px_rgba(0,255,170,0.3)]" : isCompleted ? "border-gray-700" : "border-jade-800/30"}
                ${isFinal ? "bg-black/90" : isCompleted ? "bg-black/80" : "bg-black/80"}
                ${isSelected ? "scale-105 z-10" : ""}`}
      onMouseEnter={() => onHover(match.id.toString())}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(match.id.toString())}
    >
      <div className="p-2 space-y-1">
        <div className="flex justify-between items-center">
          <div
            className={`font-medium text-sm ${team1Won ? "text-jade-400" : isCompleted && !team1Won ? "text-gray-500" : ""}`}
          >
            {team1Name}
          </div>
          <div
            className={`font-medium text-sm ${team1Won ? "text-jade-400" : isCompleted && !team1Won ? "text-gray-500" : ""}`}
          >
            {team1Score}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div
            className={`font-medium text-sm ${team2Won ? "text-jade-400" : isCompleted && !team2Won ? "text-gray-500" : ""}`}
          >
            {team2Name}
          </div>
          <div
            className={`font-medium text-sm ${team2Won ? "text-jade-400" : isCompleted && !team2Won ? "text-gray-500" : ""}`}
          >
            {team2Score}
          </div>
        </div>
        <div className="text-[10px] text-gray-400 flex justify-between items-center pt-1 border-t border-jade-800/20">
          <span>{match.match_date || "Fecha por definir"}</span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1 py-0 h-4 ${
              isPending
                ? "text-jade-400 border-jade-600"
                : isCompleted
                  ? "text-gray-500 border-gray-700"
                  : "text-yellow-400 border-yellow-600"
            }`}
          >
            {isPending ? "Pendiente" : isCompleted ? "Completado" : "En progreso"}
          </Badge>
        </div>
      </div>
      {isFinal && winnerName && (
        <div className="absolute -top-2 -right-2 bg-jade-600 text-white text-xs px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,170,0.5)]">
          Campeón
        </div>
      )}
    </div>
  )
}

interface MatchInfoPanelProps {
  match: Match | undefined
  onClose: () => void
}

function MatchInfoPanel({ match, onClose }: MatchInfoPanelProps) {
  if (!match) return null

  const team1Name = match.team1?.name || "Por determinar"
  const team2Name = match.team2?.name || "Por determinar"
  const team1Score = match.team1_score !== null ? match.team1_score : "-"
  const team2Score = match.team2_score !== null ? match.team2_score : "-"
  const winnerName = match.winner?.name || null
  const isPending = match.status === "pending"
  const isCompleted = match.status === "completed"

  return (
    <div className="fixed md:absolute top-0 left-0 md:right-0 md:left-auto w-full md:w-[300px] h-auto max-h-[90vh] md:max-h-none overflow-y-auto bg-black/90 backdrop-blur-md border border-jade-800/30 rounded-lg p-4 z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-jade-400">Detalles del Partido</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-base font-bold">{team1Name}</div>
            <div className="text-2xl mt-2 font-bold text-jade-400">{team1Score}</div>
          </div>
          <div className="text-gray-400 text-lg px-2">vs</div>
          <div className="text-center flex-1">
            <div className="text-base font-bold">{team2Name}</div>
            <div className="text-2xl mt-2 font-bold text-jade-400">{team2Score}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-jade-400 mr-2" />
            <span>{match.match_date || "Fecha por definir"}</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-jade-400 mr-2" />
            <span>Mejor de 3</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-jade-400 mr-2" />
            <span>3v3</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-jade-400 mr-2" />
            <span>
              {isCompleted && winnerName ? `Ganador: ${winnerName}` : isPending ? "Por disputar" : "En progreso"}
            </span>
          </div>
        </div>

        {isPending && (
          <div className="bg-jade-900/30 border border-jade-800/50 rounded p-3 text-xs">
            <p className="text-jade-300">
              Este partido está programado para el {match.match_date || "una fecha por definir"} a las{" "}
              {match.match_time || "una hora por definir"}. ¡No te lo pierdas!
            </p>
          </div>
        )}

        {isCompleted && winnerName && (
          <div className="bg-black/50 border border-jade-800/50 rounded p-3 text-xs">
            <p className="text-gray-300">
              <span className="text-jade-400 font-medium">{winnerName}</span> ha avanzado a la siguiente ronda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
