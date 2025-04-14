import { registerTeam, getActiveTournament } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import RegistrationForm from "@/components/registration-form"

export default async function RegistroPage() {
  // Obtener el torneo activo
  const activeTournament = await getActiveTournament()

  // Si no hay torneo activo, redirigir a la página principal
  if (!activeTournament) {
    redirect("/")
  }

  async function handleRegister(formData: FormData) {
    "use server"
    const result = await registerTeam(formData)

    if (result.success) {
      redirect(`/torneos/${result.tournamentId}?success=true`)
    } else {
      // En un caso real, manejaríamos el error de forma más elegante
      console.error("Error en el registro:", result.message)
      redirect(`/registro?error=${encodeURIComponent(result.message)}`)
    }
  }

  return <RegistrationForm activeTournament={activeTournament} handleRegister={handleRegister} />
}
