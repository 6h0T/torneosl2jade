import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DatabaseTester from "@/components/debug/database-tester"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegistrationDebugPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/registro" className="flex items-center text-forest-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al registro
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-forest-400 mb-6">Diagnóstico de Registro</h1>

        <div className="space-y-6">
          <DatabaseTester />

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg">Variables de Entorno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ No configurado"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ No configurado"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">SUPABASE_URL:</span>{" "}
                  {process.env.SUPABASE_URL ? "✅ Configurado" : "❌ No configurado"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">SUPABASE_SERVICE_ROLE_KEY:</span>{" "}
                  {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Configurado" : "❌ No configurado"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
            <CardHeader>
              <CardTitle className="text-lg">Instrucciones de Solución</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Si estás experimentando problemas con el registro de equipos, sigue estos pasos:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Verifica que todas las variables de entorno estén configuradas correctamente.</li>
                  <li>
                    Asegúrate de que la conexión a la base de datos esté funcionando (prueba con el botón arriba).
                  </li>
                  <li>Revisa los permisos de la base de datos para asegurarte de que tienes permisos de escritura.</li>
                  <li>Verifica que la tabla "teams" y "team_members" existan en tu base de datos.</li>
                  <li>Comprueba que haya al menos un torneo activo en la base de datos.</li>
                </ol>

                <p className="text-sm mt-4">Si sigues teniendo problemas, contacta al administrador del sistema.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
