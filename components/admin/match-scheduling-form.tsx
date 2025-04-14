"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Calendar, Clock } from "lucide-react"
import { updateMatchSchedule } from "@/lib/supabase/admin-actions"
import type { Match } from "@/lib/types"

interface MatchSchedulingFormProps {
  match: Match
  tournamentId: number
}

export default function MatchSchedulingForm({ match, tournamentId }: MatchSchedulingFormProps) {
  const [matchDate, setMatchDate] = useState<string>(match.match_date || "")
  const [matchTime, setMatchTime] = useState<string>(match.match_time || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleUpdateSchedule = async () => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await updateMatchSchedule(match.id, matchDate, matchTime, tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  return (
    <div className="bg-black/60 border border-jade-800/30 rounded-lg p-4">
      {message && (
        <div
          className={`p-2 rounded-md mb-3 ${
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

      <h4 className="font-medium text-jade-400 mb-3">
        Programar Partido: {match.team1?.name || "Equipo 1"} vs {match.team2?.name || "Equipo 2"}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`match-date-${match.id}`} className="text-gray-300 flex items-center">
            <Calendar className="h-4 w-4 mr-1" /> Fecha del partido
          </Label>
          <Input
            type="date"
            id={`match-date-${match.id}`}
            className="bg-black/50 border-gray-700 text-white text-sm focus:border-jade-600 focus:ring-jade-500/30"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`match-time-${match.id}`} className="text-gray-300 flex items-center">
            <Clock className="h-4 w-4 mr-1" /> Hora del partido
          </Label>
          <Input
            type="time"
            id={`match-time-${match.id}`}
            className="bg-black/50 border-gray-700 text-white text-sm focus:border-jade-600 focus:ring-jade-500/30"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
          />
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-4">
        Programa la fecha y hora del partido para que los equipos puedan prepararse. Los participantes recibirán una
        notificación con esta información.
      </div>

      <Button
        className="w-full bg-jade-600 hover:bg-jade-700 text-white text-sm"
        onClick={handleUpdateSchedule}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando..." : "Guardar Programación"}
      </Button>
    </div>
  )
}
