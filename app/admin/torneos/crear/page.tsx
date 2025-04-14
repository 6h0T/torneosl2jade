import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import TournamentForm from "@/components/admin/tournament-form"
import AuthCheck from "@/components/admin/auth-check"

export default function CreateTournamentPage() {
  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center text-jade-400 mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al panel de administración
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-jade-400 mb-2">Crear Nuevo Torneo</h1>
          <p className="text-gray-300">
            Completa el formulario para crear un nuevo torneo. Todos los campos son obligatorios.
          </p>
          <p className="text-jade-300 text-sm mt-2">
            Ahora puedes configurar las reglas del torneo directamente desde este formulario.
          </p>
        </div>

        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-jade-400">Información del Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <TournamentForm />
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  )
}
