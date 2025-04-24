"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Trophy } from "lucide-react"
import { generateInitialBracket, updateMatchResult, deleteAllMatches } from "@/lib/supabase/admin-actions"
import type { Match } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [phaseType, setPhaseType] = useState<'swiss' | 'elimination'>('swiss')
  const [round, setRound] = useState<string>('1')

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

    const result = await generateInitialBracket(tournamentId, phaseType, round)

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

      {/* Selectores de fase y ronda para generar bracket */}
      <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
        <CardHeader>
          <CardTitle className="text-lg text-jade-400">Generar Bracket</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phaseType" className="text-gray-300">
                Tipo de Fase
              </Label>
              <Select 
                value={phaseType} 
                onValueChange={(value: 'swiss' | 'elimination') => {
                  setPhaseType(value)
                  setRound(value === 'swiss' ? '1' : 'roundOf16')
                }}
              >
                <SelectTrigger className="bg-black/50 border-gray-700">
                  <SelectValue placeholder="Selecciona el tipo de fase" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  <SelectItem value="swiss">Fase Suiza</SelectItem>
                  <SelectItem value="elimination">Fase Eliminación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="round" className="text-gray-300">
                Ronda
              </Label>
              <Select value={round} onValueChange={setRound}>
                <SelectTrigger className="bg-black/50 border-gray-700">
                  <SelectValue placeholder="Selecciona la ronda" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  {phaseType === 'swiss' ? (
                    <>
                      <SelectItem value="1">Ronda 1</SelectItem>
                      <SelectItem value="2">Ronda 2</SelectItem>
                      <SelectItem value="3">Ronda 3</SelectItem>
                      <SelectItem value="4">Ronda 4</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="roundOf16">Octavos de Final</SelectItem>
                      <SelectItem value="quarterFinals">Cuartos de Final</SelectItem>
                      <SelectItem value="semiFinals">Semifinal</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <form action={generateBracketAction}>
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <input type="hidden" name="phaseType" value={phaseType} />
            <input type="hidden" name="round" value={round} />
            <Button
              type="submit"
              className="w-full bg-jade-600 hover:bg-jade-500 text-white mt-4"
              disabled={matches.length > 0}
            >
              Generar Bracket para {phaseType === 'swiss' ? `Ronda ${round}` : getPhaseTitle(round)}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Eliminar partidos */}
      {matches.length > 0 && (
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-400">Eliminar Partidos</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-300 mb-4">
              Elimina todos los partidos del torneo. Esto te permitirá regenerar el bracket desde cero.
            </p>
            <Button 
              className="w-full bg-red-800 hover:bg-red-700 text-white" 
              onClick={handleDeleteClick}
            >
              Eliminar Todos los Partidos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vista de partidos actuales */}
      {matches.length > 0 && (
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-lg text-jade-400">Partidos Actuales</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {/* Selector de fase y ronda para ver partidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Ver Fase</Label>
                <Select 
                  value={phaseType} 
                  onValueChange={(value: 'swiss' | 'elimination') => {
                    setPhaseType(value)
                    setRound(value === 'swiss' ? '1' : 'roundOf16')
                  }}
                >
                  <SelectTrigger className="bg-black/50 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-gray-700">
                    <SelectItem value="swiss">Fase Suiza</SelectItem>
                    <SelectItem value="elimination">Fase Eliminación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Ver Ronda</Label>
                <Select value={round} onValueChange={setRound}>
                  <SelectTrigger className="bg-black/50 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-gray-700">
                    {phaseType === 'swiss' ? (
                      <>
                        <SelectItem value="1">Ronda 1</SelectItem>
                        <SelectItem value="2">Ronda 2</SelectItem>
                        <SelectItem value="3">Ronda 3</SelectItem>
                        <SelectItem value="4">Ronda 4</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="roundOf16">Octavos de Final</SelectItem>
                        <SelectItem value="quarterFinals">Cuartos de Final</SelectItem>
                        <SelectItem value="semiFinals">Semifinal</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de partidos de la fase/ronda seleccionada */}
            <div className="space-y-4">
              {matches
                .filter(m => 
                  phaseType === 'swiss' 
                    ? m.phase_type === 'swiss' && m.swiss_round === parseInt(round)
                    : m.phase === round
                )
                .map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onUpdateClick={handleUpdateClick}
                  />
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo para generar bracket */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Generar Bracket</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <form action={generateBracketAction}>
              <input type="hidden" name="tournamentId" value={tournamentId} />
              <input type="hidden" name="phaseType" value={phaseType} />
              <input type="hidden" name="round" value={round} />
              <div className="space-y-4">
                {/* Selector de tipo de fase */}
                <div className="space-y-2">
                  <Label htmlFor="phaseType" className="text-gray-300">
                    Tipo de Fase
                  </Label>
                  <Select 
                    value={phaseType} 
                    onValueChange={(value: 'swiss' | 'elimination') => {
                      setPhaseType(value)
                      setRound(value === 'swiss' ? '1' : 'roundOf16')
                    }}
                  >
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-gray-700">
                      <SelectItem value="swiss">Fase Suiza</SelectItem>
                      <SelectItem value="elimination">Fase Eliminación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de ronda */}
                <div className="space-y-2">
                  <Label htmlFor="round" className="text-gray-300">
                    Ronda
                  </Label>
                  <Select value={round} onValueChange={setRound}>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-gray-700">
                      {phaseType === 'swiss' ? (
                        <>
                          <SelectItem value="1">Ronda 1</SelectItem>
                          <SelectItem value="2">Ronda 2</SelectItem>
                          <SelectItem value="3">Ronda 3</SelectItem>
                          <SelectItem value="4">Ronda 4</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="roundOf16">Octavos de Final</SelectItem>
                          <SelectItem value="quarterFinals">Cuartos de Final</SelectItem>
                          <SelectItem value="semiFinals">Semifinal</SelectItem>
                          <SelectItem value="final">Final</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-jade-600 hover:bg-jade-500 text-white mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Generar Bracket"}
              </Button>
            </form>
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

// Componente MatchCard para mostrar cada partido
function MatchCard({ match, onUpdateClick }: { match: Match; onUpdateClick: (match: Match) => void }) {
  return (
    <div className="p-4 border border-jade-800/30 rounded-lg bg-black/50">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{match.team1?.name || "Por determinar"}</span>
            <span className="text-xl text-jade-400">vs</span>
            <span className="text-sm font-medium">{match.team2?.name || "Por determinar"}</span>
          </div>
          <div className="text-xs text-gray-400">
            {match.match_date ? new Date(match.match_date).toLocaleDateString() : "Fecha por definir"}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-jade-600 text-jade-400"
          onClick={() => onUpdateClick(match)}
        >
          Actualizar
        </Button>
      </div>
    </div>
  )
}
