"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Users,
  Trophy,
  Clock,
  ArrowLeft,
  Shield,
  Swords,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import TournamentBracket from "@/components/tournament-bracket"
import TournamentFormatInfo from "@/components/tournament-format-info"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Import both rules components
import TournamentRulesDropdown from "@/components/tournament-rules-dropdown"
import TournamentHtmlRules from "@/components/tournament-html-rules"

export default function TournamentDetails({
  tournament,
  rules,
  prizes,
  approvedTeams,
  tournamentId,
}: {
  tournament: any
  rules: any[]
  prizes: any[]
  approvedTeams: any[]
  tournamentId: number
}) {
  const { t, translateContent } = useLanguage()

  return (
    <div className="container mx-auto px-3 md:px-4 py-6 md:py-8 hide-scrollbar">
      <Link href="/" className="flex items-center text-forest-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToTournaments")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Columna de información del torneo - 3 columnas */}
        <div className="lg:col-span-3">
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30 mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-forest-400 font-decorative">
                    {translateContent(tournament.title)}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-amber-400" />
                  <div>
                    <span className="text-sm text-amber-300 font-medium">
                      {translateContent(tournament.date_range)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-jade-400" />
                  <span>
                    {tournament.format === "1v1" ? t("players") : t("teams")}: {approvedTeams.length}/
                    {tournament.max_participants}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-jade-400" />
                  <span>
                    {t("status")}: <span className="text-amber-400 font-medium">{t("registrationsOpen")}</span>
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Trophy className="mr-2 h-4 w-4 text-forest-400" />
                  <span>
                    {t("prize")}: {translateContent(tournament.prize)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="mr-2 h-4 w-4 text-jade-400" />
                  <span>
                    {t("format")}: {translateContent(tournament.format)}
                  </span>
                </div>

                {/* Añadir el componente de información del formato */}
                <TournamentFormatInfo format={tournament.format} />

                <div className="flex items-center text-sm">
                  <Swords className="mr-2 h-4 w-4 text-jade-400" />
                  <span>
                    {t("mode")}: {translateContent(tournament.mode)}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  {tournament.registration_type === "free" ? (
                    <>
                      <Award className="mr-2 h-4 w-4 text-green-400" />
                      <span>
                        {t("registrationType")}: <span className="text-green-400 font-medium">{t("free")}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4 text-amber-400" />
                      <span>
                        {t("registrationType")}: <span className="text-amber-400 font-medium">{t("paid")}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-jade-800/30">
                <h3 className="text-sm font-medium mb-2 text-forest-400">{t("description")}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{translateContent(tournament.description)}</p>
              </div>

              {/* Use HTML rules if available, otherwise use the category-based rules */}
              {tournament.html_rules ? (
                <TournamentHtmlRules htmlContent={tournament.html_rules} />
              ) : (
                <TournamentRulesDropdown rules={rules} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna del bracket - 6 columnas */}
        <div className="lg:col-span-6">
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
                {t("bracket")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <TournamentBracket tournamentId={tournamentId} />
            </CardContent>
          </Card>
        </div>

        {/* Columna de equipos y premios - 3 columnas */}
        <div className="lg:col-span-3">
          {/* Card de equipos participantes */}
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30 mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
                {t("participatingTeams")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <TeamsSection teams={approvedTeams} />
            </CardContent>
          </Card>

          {/* Card de premios */}
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
                {t("prizes")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {prizes.length > 0 ? (
                  prizes.map((prize) => {
                    const IconComponent = getIconComponent(prize.icon)
                    return (
                      <div key={prize.id} className="flex items-start">
                        <IconComponent className={`h-5 w-5 ${prize.color} mr-2 mt-0.5`} />
                        <div>
                          <div className="font-medium text-sm">{translateContent(prize.position)}</div>
                          <div className="text-xs text-gray-300">{translateContent(prize.reward)}</div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-amber-400 text-xs italic">{t("toBeConfirmed")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// TeamCard component and other helper functions remain unchanged
function TeamsSection({ teams }: { teams: any[] }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-3">
      {teams.length === 0 ? (
        <p className="text-xs text-gray-400">{t("noTeamsRegistered")}</p>
      ) : (
        <div className="space-y-2">
          {teams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

function TeamCard({ team, index }: { team: any; index: number }) {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="p-3 border border-jade-800/30 rounded-lg bg-black/40">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-black/60 border border-jade-800/30 flex items-center justify-center mr-2">
            <span className="text-[10px]">{index + 1}</span>
          </div>
          <span className="font-medium text-sm">{team.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-jade-400 border-jade-600">
            {t("approved")}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-jade-900/20"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-jade-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-jade-400" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-1 pl-7 mt-2 pt-2 border-t border-jade-800/20"
        >
          {team.members && team.members.length > 0 ? (
            team.members.map((member: any) => (
              <div key={member.id} className="text-xs text-gray-300 flex items-center">
                <div className="w-3 h-3 rounded-full bg-black/60 border border-jade-800/30 flex items-center justify-center mr-2">
                  <span className="text-[8px]">•</span>
                </div>
                {member.name}
                {member.character_class && member.character_class !== "No especificada" && (
                  <span className="text-jade-400 ml-1">({member.character_class})</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic">{t("noMembersInfo")}</div>
          )}
        </motion.div>
      )}
    </div>
  )
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "trophy":
      return Trophy
    case "medal":
      return Award
    case "award":
      return Award
    case "gift":
      return Award
    default:
      return Trophy
  }
}
