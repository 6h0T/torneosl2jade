"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Trophy, Shield } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import type { Tournament } from "@/lib/types"

interface TournamentSummaryProps {
  tournament: Tournament
  totalTeams: number
}

export default function TournamentSummary({ tournament, totalTeams }: TournamentSummaryProps) {
  const { t, translateContent } = useLanguage()

  // Determinar el estado para mostrar el badge adecuado
  const getStatusBadge = () => {
    switch (tournament.status) {
      case "upcoming":
        return <Badge className="bg-amber-600">{t("upcoming")}</Badge>
      case "active":
        return <Badge className="bg-jade-600">{t("active")}</Badge>
      case "completed":
        return <Badge className="bg-gray-600">{t("completed")}</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30 hover:border-jade-600/50 transition-all duration-300 h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-forest-400 font-decorative">
            {translateContent(tournament.title)}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-300 line-clamp-2">
          {translateContent(tournament.description)}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-amber-400" />
            <span>{translateContent(tournament.date_range)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Trophy className="mr-2 h-4 w-4 text-jade-400" />
            <span>{translateContent(tournament.prize)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-forest-400" />
            <span>
              {tournament.format === "1v1" ? t("players") : t("teams")}: {totalTeams}/{tournament.max_participants}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Shield className="mr-2 h-4 w-4 text-forest-400" />
            <span>{translateContent(tournament.format)} - {translateContent(tournament.mode)}</span>
          </div>
        </div>
        
        <div className="pt-2">
          <Link 
            href={`/torneos/${tournament.id}`}
            className="text-sm text-jade-400 hover:text-jade-300 hover:underline"
          >
            {t("viewTournament")} →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 