"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { updateMatchResult } from "@/lib/supabase/admin-actions"
import type { Match } from "@/lib/types"

interface MatchResultFormProps {
  match: Match
  tournamentId: number
}

export default function MatchResultForm({ match, tournamentId }: MatchResultFormProps) {
  const [team1Score, setTeam1Score] = useState<number>(match.team1_score || 0)
  const [team2Score, setTeam2Score] = useState<number>(match.team2_score || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleUpdateConfirm = async () => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await updateMatchResult(match.id, team1Score, team2Score, tournamentId)

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
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <Label htmlFor={`team1-score-${match.id}`} className="text-gray-300 text-xs">
            {match.team1?.name || "Equipo 1"}
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
            {match.team2?.name || "Equipo 2"}
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
      <Button
        className="w-full bg-jade-600 hover:bg-jade-700 text-white text-sm"
        onClick={handleUpdateConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando..." : "Guardar Resultado"}
      </Button>
    </div>
  )
}
