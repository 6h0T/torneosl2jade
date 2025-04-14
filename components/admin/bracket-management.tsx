"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react"
import { generateInitialBracket, updateMatchResult, deleteAllMatches } from "@/lib/supabase/admin-actions"
import type { Match } from "@/lib/types"

interface BracketManagementProps {
  matches: Match[]
  tournamentId: number
}

export default function BracketManagement({ matches, tournamentId }: BracketManagementProps) {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [team1Score, setTeam1Score] = useState<number>(0)
  const [team2Score, setTeam2Score] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Agrupar partidos por fase
  const roundOf16Matches = matches
    .filter((match) => match.phase === "roundOf16")
    .sort((a, b) => a.match_order - b.match_order)
  const quarterFinalMatches = matches
    .filter((match) => match.phase === "quarterFinals")
    .sort((a, b) => a.match_order - b.match_order)
  const semiFinalMatches = matches
    .filter((match) => match.phase === "semiFinals")
    .sort((a, b) => a.match_order - b.match_order)
  const finalMatches = matches.filter((match) => match.phase === "final").sort((a, b) => a.match_order - b.match_order)

  const handleGenerateClick = () => {
    setIsGenerateDialogOpen(true)
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleUpdateClick = (match: Match) => {
    setSelectedMatch(match)
    setTeam1Score(match.team1_score || 0)
    setTeam2Score(match.team2_score || 0)
    setIsUpdateDialogOpen(true)
  }

  const handleGenerateConfirm = async () => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await generateInitialBracket(tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setIsGenerateDialogOpen(false)
        setMessage(null)
        window.location.reload()
      }, 2000)
    }
  }

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await deleteAllMatches(tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setIsDeleteDialogOpen(false)
        setMessage(null)
        window.location.reload()
      }, 2000)
    }
  }

  const handleUpdateConfirm = async () => {
    if (!selectedMatch) return

    setIsSubmitting(true)
    setMessage(null)

    const result = await updateMatchResult(selectedMatch.id, team1Score, team2Score, tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setIsUpdateDialogOpen(false)
        setMessage(null)
        window.location.reload()
      }, 2000)
    }
  }

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case "roundOf16":
        return "Octavos de Final"
      case "quarterFinals":
        return "Cuartos de Final"
      case "semiFinals":
        return "Semifinales"
      case "final":
        return "Final"
      default:
        return phase
    }
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de estado */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-jade-900/50 border border-jade-600" : "bg-red-900/30 border border-red-800"
          }`}
        >
          <div className="flex items-start">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-jade-400 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            )}
            <p className={message.type === "success" ? "text-jade-200" : "text-red-200"}>{message.text}</p>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-4">
        <Button
          className="bg-jade-600 hover:bg-jade-500 text-white"
          onClick={handleGenerateClick}
          disabled={matches.length > 0}
        >
          Generar Bracket Inicial
        </Button>
        {matches.length > 0 && (
          <Button className="bg-red-800 hover:bg-red-700 text-white" onClick={handleDeleteClick}>
            Eliminar Todos los Partidos
          </Button>
        )}
      </div>

      {/* Información sobre el bracket */}
      {matches.length === 0 ? (
        <div className="bg-black/50 border border-jade-800/30 rounded-md p-6 text-center">
          <p className="text-gray-300 mb-4">No hay partidos generados para este torneo.</p>
          <p className="text-gray-400 text-sm">
            Haz clic en &quot;Generar Bracket Inicial&quot; para crear automáticamente los partidos basados en los
            equipos aprobados.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Octavos de Final */}
          {roundOf16Matches.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-jade-400 mb-3">Octavos de Final</h3>
              <MatchesTable matches={roundOf16Matches} onUpdateClick={handleUpdateClick} />
            </div>
          )}

          {/* Cuartos de Final */}
          {quarterFinalMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-jade-400 mb-3">Cuartos de Final</h3>
              <MatchesTable matches={quarterFinalMatches} onUpdateClick={handleUpdateClick} />
            </div>
          )}

          {/* Semifinales */}
          {semiFinalMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-jade-400 mb-3">Semifinales</h3>
              <MatchesTable matches={semiFinalMatches} onUpdateClick={handleUpdateClick} />
            </div>
          )}

          {/* Final */}
          {finalMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-jade-400 mb-3">Final</h3>
              <MatchesTable matches={finalMatches} onUpdateClick={handleUpdateClick} />
            </div>
          )}
        </div>
      )}

      {/* Diálogo para generar bracket */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Generar Bracket Inicial</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">¿Estás seguro de que deseas generar el bracket inicial para este torneo?</p>
            <p className="text-gray-400 text-sm mt-2">
              Esta acción creará automáticamente los partidos basados en los equipos aprobados. Asegúrate de haber
              aprobado todos los equipos que deseas incluir en el torneo.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsGenerateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-jade-600 hover:bg-jade-500 text-white"
              onClick={handleGenerateConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar partidos */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-red-400">Eliminar Todos los Partidos</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">¿Estás seguro de que deseas eliminar todos los partidos de este torneo?</p>
            <p className="text-gray-400 text-sm mt-2">
              Esta acción eliminará permanentemente todos los partidos y resultados. Tendrás que generar el bracket
              nuevamente.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-800 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para actualizar resultado */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Actualizar Resultado</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-gray-300">
              Ingresa el resultado del partido entre{" "}
              <span className="font-bold">{selectedMatch?.team1?.name || "Equipo 1"}</span> y{" "}
              <span className="font-bold">{selectedMatch?.team2?.name || "Equipo 2"}</span>.
            </p>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="team1Score" className="text-gray-300">
                  {selectedMatch?.team1?.name || "Equipo 1"}
                </Label>
                <Input
                  id="team1Score"
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(Number(e.target.value))}
                  className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
                />
              </div>

              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-xl">vs</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team2Score" className="text-gray-300">
                  {selectedMatch?.team2?.name || "Equipo 2"}
                </Label>
                <Input
                  id="team2Score"
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(Number(e.target.value))}
                  className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
                />
              </div>
            </div>

            <p className="text-gray-400 text-sm">El equipo ganador avanzará automáticamente a la siguiente ronda.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsUpdateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-jade-600 hover:bg-jade-500 text-white"
              onClick={handleUpdateConfirm}
              disabled={isSubmitting || (!selectedMatch?.team1_id && !selectedMatch?.team2_id)}
            >
              {isSubmitting ? "Procesando..." : "Guardar Resultado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MatchesTableProps {
  matches: Match[]
  onUpdateClick: (match: Match) => void
}

function MatchesTable({ matches, onUpdateClick }: MatchesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="border border-jade-800/30">
        <TableHeader className="bg-black/50">
          <TableRow>
            <TableHead className="text-jade-300">ID</TableHead>
            <TableHead className="text-jade-300">Equipo 1</TableHead>
            <TableHead className="text-jade-300">Equipo 2</TableHead>
            <TableHead className="text-jade-300">Resultado</TableHead>
            <TableHead className="text-jade-300">Ganador</TableHead>
            <TableHead className="text-jade-300">Fecha</TableHead>
            <TableHead className="text-jade-300">Estado</TableHead>
            <TableHead className="text-jade-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id} className="border-b border-jade-800/20">
              <TableCell>{match.id}</TableCell>
              <TableCell className="font-medium">{match.team1?.name || "Por determinar"}</TableCell>
              <TableCell className="font-medium">{match.team2?.name || "Por determinar"}</TableCell>
              <TableCell>
                {match.team1_score !== null && match.team2_score !== null
                  ? `${match.team1_score} - ${match.team2_score}`
                  : "Sin jugar"}
              </TableCell>
              <TableCell>
                {match.winner?.name ? (
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{match.winner.name}</span>
                  </div>
                ) : (
                  "Sin definir"
                )}
              </TableCell>
              <TableCell>{match.match_date || "Por definir"}</TableCell>
              <TableCell>
                <Badge
                  className={
                    match.status === "completed"
                      ? "bg-jade-600"
                      : match.status === "in_progress"
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                  }
                >
                  {match.status === "completed"
                    ? "Completado"
                    : match.status === "in_progress"
                      ? "En progreso"
                      : "Pendiente"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-jade-600 text-jade-400 hover:bg-jade-900/50"
                  onClick={() => onUpdateClick(match)}
                  disabled={!match.team1_id && !match.team2_id}
                >
                  Actualizar Resultado
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
