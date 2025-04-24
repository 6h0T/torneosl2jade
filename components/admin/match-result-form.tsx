"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react"
import { updateMatchResult } from "@/lib/supabase/admin-actions"
import type { Match } from "@/lib/types"

interface MatchResultFormProps {
  match: Match
  tournamentId: number
}

export default function MatchResultForm({ match, tournamentId }: MatchResultFormProps) {
  const [selectedWinner, setSelectedWinner] = useState<1 | 2 | null>(null)
  const [team1Score, setTeam1Score] = useState<number>(match.team1_score || 0)
  const [team2Score, setTeam2Score] = useState<number>(match.team2_score || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const isEliminationPhase = match.phase_type === 'elimination'

  const handleUpdateConfirm = async () => {
    if (selectedWinner === null) return

    setIsSubmitting(true)
    setMessage(null)

    // En fase de eliminación usamos los puntajes ingresados
    // En fase suiza el ganador obtiene 1 punto y el perdedor 0
    const finalTeam1Score = isEliminationPhase ? team1Score : (selectedWinner === 1 ? 1 : 0)
    const finalTeam2Score = isEliminationPhase ? team2Score : (selectedWinner === 2 ? 1 : 0)

    const result = await updateMatchResult(match.id, finalTeam1Score, finalTeam2Score, tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setMessage(null)
        window.location.reload()
      }, 2000)
    }
  }

  return (
    <div className="bg-black/60 border border-jade-800/30 rounded-lg p-3">
      {message && (
        <div
          className={`p-2 rounded-md mb-2 ${
            message.type === "success" ? "bg-jade-900/50 border border-jade-600" : "bg-red-900/30 border border-red-800"
          }`}
        >
          <div className="flex items-start">
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-jade-400 mr-2 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
            )}
            <p className={`text-sm ${message.type === "success" ? "text-jade-200" : "text-red-200"}`}>{message.text}</p>
          </div>
        </div>
      )}
      <h4 className="font-medium text-jade-400 mb-2">
        {match.team1?.name || "Equipo 1"} vs {match.team2?.name || "Equipo 2"}
      </h4>

      {/* Botones de Ganador/Perdedor */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Button
          variant={selectedWinner === 1 ? "default" : "outline"}
          className={`w-full ${
            selectedWinner === 1 
              ? "bg-jade-600 hover:bg-jade-700 text-white" 
              : "border-gray-700 hover:border-jade-600"
          }`}
          onClick={() => setSelectedWinner(1)}
        >
          <Trophy className={`h-4 w-4 mr-2 ${selectedWinner === 1 ? "text-white" : "text-jade-400"}`} />
          {match.team1?.name || "Equipo 1"}
        </Button>
        <Button
          variant={selectedWinner === 2 ? "default" : "outline"}
          className={`w-full ${
            selectedWinner === 2 
              ? "bg-jade-600 hover:bg-jade-700 text-white" 
              : "border-gray-700 hover:border-jade-600"
          }`}
          onClick={() => setSelectedWinner(2)}
        >
          <Trophy className={`h-4 w-4 mr-2 ${selectedWinner === 2 ? "text-white" : "text-jade-400"}`} />
          {match.team2?.name || "Equipo 2"}
        </Button>
      </div>

      {/* Campos de puntaje (solo visibles en fase de eliminación) */}
      {isEliminationPhase && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <Label htmlFor={`team1-score-${match.id}`} className="text-gray-300 text-xs">
              Victorias {match.team1?.name || "Equipo 1"}
            </Label>
            <Input
              type="number"
              id={`team1-score-${match.id}`}
              className="bg-black/50 border-gray-700 text-white text-sm focus:border-jade-600 focus:ring-jade-500/30"
              value={team1Score}
              onChange={(e) => setTeam1Score(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor={`team2-score-${match.id}`} className="text-gray-300 text-xs">
              Victorias {match.team2?.name || "Equipo 2"}
            </Label>
            <Input
              type="number"
              id={`team2-score-${match.id}`}
              className="bg-black/50 border-gray-700 text-white text-sm focus:border-jade-600 focus:ring-jade-500/30"
              value={team2Score}
              onChange={(e) => setTeam2Score(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <Button
        className="w-full bg-jade-600 hover:bg-jade-700 text-white text-sm"
        onClick={handleUpdateConfirm}
        disabled={isSubmitting || selectedWinner === null}
      >
        {isSubmitting ? "Guardando..." : "Confirmar Resultado"}
      </Button>
    </div>
  )
}
