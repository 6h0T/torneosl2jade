// Asegurarnos de que estamos importando el archivo correcto
import { registerTeam } from "./actions"
import { getActiveTournament } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function RegistroPage({ searchParams }: { searchParams: { error?: string } }) {
  // Get active tournament
  const activeTournament = await getActiveTournament()

  // If no active tournament, redirect to home page
  if (!activeTournament) {
    redirect("/")
  }

  async function handleRegister(formData: FormData) {
    "use server"
    console.log("Servidor: Procesando registro...")
    const result = await registerTeam(formData)
    console.log("Servidor: Resultado del registro:", result)

    // En lugar de redirigir, devolvemos el resultado para que el cliente decida qué hacer
    return result
  }

  return (
    <>
      {searchParams.error && (
        <div className="container mx-auto px-4 mt-4 max-w-md">
          <Card className="bg-red-900/30 border border-red-800">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-red-200">{searchParams.error}</p>
                  <Link href="/registro/debug" className="text-red-300 text-sm hover:underline mt-2 inline-block">
                    Ir a la página de diagnóstico →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <RegistrationForm activeTournament={activeTournament} handleRegister={handleRegister} />
    </>
  )
}
