"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, Trophy, Clock, Award } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function HomeContent({
  activeTournaments,
  upcomingTournaments,
  completedTournaments,
  activeParticipantsInfo,
  upcomingParticipantsInfo,
}: {
  activeTournaments: any[]
  upcomingTournaments: any[]
  completedTournaments: any[]
  activeParticipantsInfo: any[]
  upcomingParticipantsInfo: any[]
}) {
  const { t } = useLanguage()

  return (
    <div className="mx-auto px-8 md:px-16 lg:px-24 py-6 max-w-6xl flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="mb-6 bg-black/40 backdrop-blur-sm p-4 rounded-lg text-center w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-forest-400 tracking-wide capitalize font-decorative">
          {t("tournamentTitle")}
        </h1>
        <p className="text-white text-lg leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {t("tournamentSubtitle")} <br />
          {t("tournamentSubtitle2")}
        </p>
      </div>

      <Tabs defaultValue="proximos" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-4 bg-black/80 border border-forest-800/30 mx-auto">
          <TabsTrigger
            value="proximos"
            className="data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
          >
            {t("upcoming")}
          </TabsTrigger>
          <TabsTrigger
            value="activos"
            className="data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
          >
            {t("active")}
          </TabsTrigger>
          <TabsTrigger
            value="pasados"
            className="data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
          >
            {t("past")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="mt-0 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-4xl">
            {upcomingTournaments.length > 0 ? (
              upcomingTournaments.map((tournament) => {
                const participantInfo = upcomingParticipantsInfo.find((info) => info.id === tournament.id)
                const participants = participantInfo ? `${participantInfo.count}/${participantInfo.max}` : "0/32"
                
                return (
                  <TournamentCard
                    key={tournament.id}
                    id={tournament.id.toString()}
                    title={tournament.title}
                    description={tournament.description}
                    date={tournament.date_range}
                    participants={participants}
                    status={t("upcoming")}
                    prize={tournament.prize}
                    featured={tournament.featured}
                    tournament={tournament}
                  />
                )
              })
            ) : (
              <div className="bg-black/80 backdrop-blur-sm border border-forest-800/30 rounded-lg p-6 text-center col-span-2">
                <p className="text-gray-400">{t("noUpcomingTournaments")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activos" className="mt-0 flex justify-center">
          <div className="max-w-md w-full">
            {activeTournaments.length > 0 ? (
              activeTournaments.map((tournament) => {
                const participantInfo = activeParticipantsInfo.find((info) => info.id === tournament.id)
                const participants = participantInfo ? `${participantInfo.count}/${participantInfo.max}` : "0/32"

                return (
                  <TournamentCard
                    key={tournament.id}
                    id={tournament.id.toString()}
                    title={tournament.title}
                    description={tournament.description}
                    date={tournament.date_range}
                    participants={participants}
                    status={t("registrationsOpen")}
                    prize={tournament.prize}
                    featured={tournament.featured}
                    isRegistrationOpen={true}
                    tournament={tournament}
                  />
                )
              })
            ) : (
              <div className="bg-black/80 backdrop-blur-sm border border-forest-800/30 rounded-lg p-6 text-center">
                <p className="text-gray-400">{t("noActiveTournaments")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pasados" className="mt-0 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
            {completedTournaments.length > 0 ? (
              completedTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  id={tournament.id.toString()}
                  title={tournament.title}
                  description={tournament.description}
                  date={tournament.date_range}
                  participants="32/32"
                  status={t("past")}
                  prize={tournament.prize}
                  featured={tournament.featured}
                  winner="Los Inmortales"
                  tournament={tournament}
                />
              ))
            ) : (
              <div className="bg-black/80 backdrop-blur-sm border border-forest-800/30 rounded-lg p-6 text-center col-span-3">
                <p className="text-gray-400">{t("noCompletedTournaments")}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TournamentCardProps {
  id: string
  title: string
  description: string
  date: string
  participants: string
  status: string
  prize: string
  featured?: boolean
  winner?: string
  isRegistrationOpen?: boolean
  tournament?: any
}

function TournamentCard({
  id,
  title,
  description,
  date,
  participants,
  status,
  prize,
  featured = false,
  winner,
  isRegistrationOpen = false,
  tournament,
}: TournamentCardProps) {
  const { t, translateContent } = useLanguage()

  return (
    <Card
      className={`bg-black/80 backdrop-blur-sm border-forest-800/30 ${
        featured ? "ring-2 ring-forest-500 border-forest-600" : ""
      }`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-forest-400 capitalize font-decorative">{translateContent(title)}</CardTitle>
        </div>
        <CardDescription className="text-gray-300 text-sm leading-relaxed">
          {translateContent(description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-amber-400" />
          <div>
            <span className="text-sm text-amber-300 font-medium">{translateContent(date)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-forest-400" />
          <span>
            {tournament?.format === "1v1" ? t("players") : t("teams")}: {participants}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-forest-400" />
          <span>
            {t("status")}:{" "}
            {isRegistrationOpen ? <span className="text-amber-400 font-medium">{t("registrationsOpen")}</span> : status}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Trophy className="mr-2 h-4 w-4 text-forest-400" />
          <span>
            {t("prize")}: {prize}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Award className="mr-2 h-4 w-4 text-forest-400" />
          <span>
            {t("registrationType")}:{" "}
            {tournament?.registration_type === "free" ? (
              <span className="text-green-400 font-medium">{t("free")}</span>
            ) : (
              <span className="text-amber-400 font-medium">{t("paid")}</span>
            )}
          </span>
        </div>
        {winner && (
          <div className="flex items-center text-sm font-medium">
            <span className="mr-2">{t("winner")}:</span>
            <span className="text-forest-400">{translateContent(winner)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/torneos/${id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-forest-600 text-forest-400 hover:bg-forest-900/50 hover:text-forest-100 hover:border-forest-400"
          >
            {isRegistrationOpen ? t("viewTournament") : t("viewDetails")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
