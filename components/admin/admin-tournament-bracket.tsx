"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Users, Shield, Edit2 } from "lucide-react"
import { BracketConnector } from "@/components/ui/bracket-connector"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { updateMatchResult } from "@/lib/supabase/admin-actions"
import type { Match } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import MatchCard from "@/components/admin/match-card"
import DeleteExpelledTeamsButton from "@/components/admin/delete-expelled-teams-button"

export default function AdminTournamentBracket({ tournamentId }: { tournamentId: number }) {
  // Estados existentes del TournamentBracket
  const [matches, setMatches] = useState<{
    swiss: Match[]
    roundOf16: Match[]
    quarterFinals: Match[]
    semiFinals: Match[]
    final: Match[]
  }>({
    swiss: [],
    roundOf16: [],
    quarterFinals: [],
    semiFinals: [],
    final: [],
  })
  
  // Nuevos estados para la edición
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [team1Score, setTeam1Score] = useState<number>(0)
  const [team2Score, setTeam2Score] = useState<number>(0)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // ... resto de estados y useEffect del TournamentBracket original ...

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match)
    setTeam1Score(match.team1_score || 0)
    setTeam2Score(match.team2_score || 0)
    setIsEditDialogOpen(true)
  }

  const handleUpdateResult = async () => {
    if (!editingMatch) return

    setIsSubmitting(true)
    setMessage(null)

    const result = await updateMatchResult(editingMatch.id, team1Score, team2Score, tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setIsEditDialogOpen(false)
        setMessage(null)
      }, 2000)
    }
  }

  // Componente de tarjeta de partido modificado para administración
  function AdminMatchCard({ match, isHovered, isSelected, isCompleted }: MatchCardProps) {
    const team1Name = match.team1?.name || "Por determinar"
    const team2Name = match.team2?.name || "Por determinar"
    const team1Score = match.team1_score !== null ? match.team1_score : "-"
    const team2Score = match.team2_score !== null ? match.team2_score : "-"

    return (
      <div
        className={`relative border rounded-md p-3 transition-all duration-300
          ${isHovered || isSelected ? "border-jade-400 shadow-[0_0_10px_rgba(0,255,170,0.3)]" : 
            isCompleted ? "border-gray-700" : "border-jade-800/30"}
          ${isCompleted ? "bg-black/80" : "bg-black/80"}
          ${isSelected ? "scale-105 z-10" : ""}`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">{team1Name}</span>
              <span className="font-medium text-sm">{team1Score}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{team2Name}</span>
              <span className="font-medium text-sm">{team2Score}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-jade-400 hover:text-jade-300"
            onClick={() => handleEditMatch(match)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-[10px] text-gray-400 flex justify-between items-center pt-1 border-t border-jade-800/20">
          <span>{match.match_date || "Fecha por definir"}</span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1 py-0 h-4 ${
              match.status === "pending"
                ? "text-jade-400 border-jade-600"
                : "text-gray-500 border-gray-700"
            }`}
          >
            {match.status === "pending" ? "Pendiente" : "Completado"}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Contenido principal del bracket */}
      <div className="w-full space-y-4">
        {/* ... resto del contenido del TournamentBracket ... */}
        {/* Reemplazar los MatchCard por AdminMatchCard */}
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Actualizar Resultado</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-gray-300">
              Ingresa el resultado del partido entre{" "}
              <span className="font-bold">{editingMatch?.team1?.name || "Equipo 1"}</span> y{" "}
              <span className="font-bold">{editingMatch?.team2?.name || "Equipo 2"}</span>
            </p>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="team1Score" className="text-gray-300">
                  {editingMatch?.team1?.name || "Equipo 1"}
                </Label>
                <Input
                  id="team1Score"
                  type="number"
                  min="0"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(Number(e.target.value))}
                  className="bg-black/50 border-gray-700"
                />
              </div>

              <div className="flex items-center justify-center">
                <span className="text-gray-400 text-xl">vs</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team2Score" className="text-gray-300">
                  {editingMatch?.team2?.name || "Equipo 2"}
                </Label>
                <Input
                  id="team2Score"
                  type="number"
                  min="0"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(Number(e.target.value))}
                  className="bg-black/50 border-gray-700"
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.type === "success" ? "bg-jade-900/30 text-jade-400" : "bg-red-900/30 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
              className="border-gray-700 text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateResult}
              disabled={isSubmitting}
              className="bg-jade-600 hover:bg-jade-500 text-white"
            >
              {isSubmitting ? "Actualizando..." : "Guardar Resultado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Añadir nuevo TabsContent para Brackets */}
      <TabsContent value="brackets" className="mt-0">
        <div className="grid grid-cols-1 gap-6">
          {/* Panel de Control de Brackets */}
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-jade-400">Control de Brackets</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Selector de Fase */}
                <div className="space-y-2">
                  <Label>Tipo de Fase</Label>
                  <Select defaultValue="swiss">
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-gray-700">
                      <SelectItem value="swiss">Fase Suiza</SelectItem>
                      <SelectItem value="elimination">Eliminación Directa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Selector de Ronda */}
                <div className="space-y-2">
                  <Label>Ronda</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-gray-700">
                      <SelectItem value="1">Ronda 1</SelectItem>
                      <SelectItem value="2">Ronda 2</SelectItem>
                      <SelectItem value="3">Ronda 3</SelectItem>
                      <SelectItem value="roundOf16">Octavos de Final</SelectItem>
                      <SelectItem value="quarterFinals">Cuartos de Final</SelectItem>
                      <SelectItem value="semiFinals">Semifinal</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Acciones de Bracket */}
              <div className="flex flex-col gap-4">
                <form action={generateBracketAction}>
                  <input type="hidden" name="tournamentId" value={tournamentId} />
                  <input type="hidden" name="phaseType" value="swiss" />
                  <input type="hidden" name="round" value="1" />
                  <Button 
                    type="submit"
                    className="w-full bg-jade-600 hover:bg-jade-500 text-white"
                    disabled={approvedTeams.length < 2}
                  >
                    Generar Bracket Inicial
                  </Button>
                </form>

                <form action={deleteMatchesAction}>
                  <input type="hidden" name="tournamentId" value={tournamentId} />
                  <Button 
                    type="submit" 
                    variant="destructive" 
                    className="w-full"
                    disabled={matches.length === 0}
                  >
                    Eliminar Todos los Partidos
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Visualización del Bracket */}
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-jade-400">Bracket Actual</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {matches.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No hay partidos generados. Usa el panel de control superior para generar el bracket.
                </p>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      tournamentId={tournamentId}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipos Expulsados */}
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-jade-400 flex items-center justify-between">
                <div className="flex items-center">
                  Equipos Expulsados
                  <Badge className="ml-2 bg-red-600">{expelledTeams.length}</Badge>
                </div>
                {expelledTeams.length > 0 && (
                  <DeleteExpelledTeamsButton 
                    tournamentId={tournamentId} 
                    className="ml-4"
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {expelledTeams.length === 0 ? (
                <p className="text-gray-400 text-sm">No hay equipos expulsados.</p>
              ) : (
                <div className="space-y-4">
                  {expelledTeams.map((team) => (
                    <TeamCard
                      key={`${team.id}-${timestamp}`}
                      team={team}
                      tournamentId={tournamentId}
                      status="expelled"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  )
} 