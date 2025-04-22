import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Trophy, Video, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { getTournaments } from "@/lib/supabase/actions"
import AuthCheck from "@/components/admin/auth-check"
import DatabaseStatus from "@/components/admin/database-status"

export default async function AdminPage() {
  // Obtener todos los torneos
  const tournaments = await getTournaments()

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <DatabaseStatus />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-jade-400 mb-2">Panel de Administración</h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-300">Gestiona torneos, equipos y partidos.</p>
            <div className="flex gap-2">
              <Link href="/admin/torneos/nuevo">
                <Button className="bg-jade-600 hover:bg-jade-500 text-white">
                  <Trophy className="h-4 w-4 mr-2" />
                  Crear Nuevo Torneo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-black/80 backdrop-blur-sm border-jade-800/30">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
                    {tournament.title}
                  </CardTitle>
                  <Badge
                    className={
                      tournament.status === "active"
                        ? "bg-jade-600"
                        : tournament.status === "upcoming"
                          ? "bg-yellow-600"
                          : "bg-gray-600"
                    }
                  >
                    {tournament.status === "active"
                      ? "Activo"
                      : tournament.status === "upcoming"
                        ? "Próximo"
                        : "Completado"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">{tournament.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                <div className="flex items-center text-sm">
                  <CalendarDays className="mr-2 h-4 w-4 text-jade-400" />
                  <span>{tournament.date_range}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-jade-400" />
                  <span>Máx. participantes: {tournament.max_participants}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Trophy className="mr-2 h-4 w-4 text-jade-400" />
                  <span>Premio: {tournament.prize}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link href={`/admin/torneos/${tournament.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-jade-600 text-jade-400 hover:bg-jade-900/50 hover:text-jade-100 hover:border-jade-400 shadow-[0_0_10px_rgba(0,255,170,0.1)]"
                  >
                    Administrar
                  </Button>
                </Link>
                <Link href={`/admin/torneos/editar/${tournament.id}`} className="flex-none">
                  <Button
                    variant="outline"
                    className="border-amber-600 text-amber-400 hover:bg-amber-900/50 hover:text-amber-100 hover:border-amber-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          {/* Card para la gestión de transmisiones */}
          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30 col-span-1">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">Transmisiones</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Gestiona las transmisiones de diferentes plataformas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              <div className="flex items-center text-sm">
                <Video className="mr-2 h-4 w-4 text-jade-400" />
                <span>Configura transmisiones de Twitch, YouTube, Facebook y Kick</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href="/admin/streams" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-jade-600 text-jade-400 hover:bg-jade-900/50 hover:text-jade-100 hover:border-jade-400 shadow-[0_0_10px_rgba(0,255,170,0.1)]"
                >
                  Administrar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthCheck>
  )
}
