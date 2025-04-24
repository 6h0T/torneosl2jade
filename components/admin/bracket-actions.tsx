"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BracketActionsProps {
  tournamentId: number
  approvedTeamsCount: number
  matchesCount: number
  generateBracketAction: any
  deleteMatchesAction: any
}

export default function BracketActions({ 
  tournamentId, 
  approvedTeamsCount, 
  matchesCount,
  generateBracketAction,
  deleteMatchesAction
}: BracketActionsProps) {
  const [phaseType, setPhaseType] = useState<'swiss' | 'elimination'>('swiss')
  const [round, setRound] = useState('1')

  return (
    <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
      <CardHeader>
        <CardTitle className="text-lg text-jade-400">Acciones de Bracket</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector de Fase */}
          <div className="space-y-2">
            <Label htmlFor="phaseType" className="text-gray-300">
              Tipo de Fase
            </Label>
            <Select value={phaseType} onValueChange={(value: 'swiss' | 'elimination') => setPhaseType(value)}>
              <SelectTrigger className="bg-black/50 border-gray-700">
                <SelectValue placeholder="Selecciona el tipo de fase" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-gray-700">
                <SelectItem value="swiss">Fase Suiza</SelectItem>
                <SelectItem value="elimination">Fase Eliminación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selector de Ronda */}
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

        <div>
          <p className="text-sm text-gray-300 mb-2">
            Genera el bracket inicial con los equipos aprobados. Esto creará automáticamente los partidos según
            el número de equipos.
          </p>
          <form action={generateBracketAction}>
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <input type="hidden" name="phaseType" value={phaseType} />
            <input type="hidden" name="round" value={round} />
            <Button
              type="submit"
              className="w-full bg-jade-600 hover:bg-jade-700 text-white"
              disabled={approvedTeamsCount < 2}
            >
              Generar Bracket
            </Button>
          </form>
          {approvedTeamsCount < 2 && (
            <p className="text-amber-400 text-xs mt-2">
              Se necesitan al menos 2 equipos aprobados para generar el bracket.
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-jade-800/30">
          <p className="text-sm text-gray-300 mb-2">
            Elimina todos los partidos del torneo. Esto te permitirá regenerar el bracket desde cero.
          </p>
          <form action={deleteMatchesAction}>
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <Button type="submit" variant="destructive" className="w-full" disabled={matchesCount === 0}>
              Eliminar Todos los Partidos
            </Button>
          </form>
          {matchesCount === 0 && (
            <p className="text-gray-400 text-xs mt-2">
              No hay partidos para eliminar. Genera el bracket primero.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}