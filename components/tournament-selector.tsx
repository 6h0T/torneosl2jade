"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Tournament } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TournamentSelectorProps {
  tournaments: Tournament[]
}

export default function TournamentSelector({ tournaments }: TournamentSelectorProps) {
  const router = useRouter()
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    router.push(`/registro/${tournament.id}`)
  }

  return (
    <div>
      <Link href="/" className="flex items-center text-forest-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>

      <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
        <CardHeader>
          <CardTitle className="text-xl text-forest-400">Torneos Disponibles</CardTitle>
          <CardDescription className="text-forest-200">
            Selecciona el torneo en el que deseas participar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="flex items-center justify-between bg-forest-900/50 hover:bg-forest-800/50 border border-forest-700/30 rounded-lg p-4 transition-colors">
                <span className="text-lg font-semibold text-forest-100">{tournament.title}</span>
                <Button
                  onClick={() => handleTournamentSelect(tournament)}
                  className="ml-4 bg-jade-700 hover:bg-jade-600 text-white font-bold px-6"
                >
                  Registro
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 