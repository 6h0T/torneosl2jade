import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import RulesTextProcessor from "@/components/admin/rules-text-processor"
import AuthCheck from "@/components/admin/auth-check"
import { getTournamentById, getTournamentRules } from "@/lib/supabase/actions"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Acción del servidor para guardar las reglas
async function saveRules(tournamentId: number, rules: { category: string; rule: string }[]) {
  "use server"

  try {
    const supabase = createServerComponentClient()

    // Eliminar reglas existentes
    await supabase.from("tournament_rules").delete().eq("tournament_id", tournamentId)

    // Insertar nuevas reglas
    if (rules.length > 0) {
      const rulesToInsert = rules.map((rule) => ({
        tournament_id: tournamentId,
        category: rule.category,
        rule: rule.rule,
      }))

      const { error } = await supabase.from("tournament_rules").insert(rulesToInsert)

      if (error) {
        console.error("Error al insertar reglas:", error)
        throw new Error("Error al guardar las reglas")
      }
    }

    // Revalidar rutas
    revalidatePath(`/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}`)
    revalidatePath(`/admin/torneos/${tournamentId}/reglas`)

    return { success: true }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error }
  }
}

export default async function TournamentRulesPage({ params }: { params: { id: string } }) {
  const tournamentId = Number.parseInt(params.id)

  // Obtener datos del torneo
  const tournament = await getTournamentById(tournamentId)

  if (!tournament) {
    redirect("/admin")
  }

  // Obtener reglas existentes
  const rules = await getTournamentRules(tournamentId)

  // Convertir reglas a texto para el procesador
  const rulesText =
    rules.length > 0
      ? rules
          .sort((a, b) => a.id - b.id)
          .map((rule) => rule.rule)
          .join("\n\n")
      : ""

  // Función para guardar las reglas
  async function handleSaveRules(processedRules: { category: string; rule: string }[]) {
    "use server"
    return saveRules(tournamentId, processedRules)
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/admin/torneos/${tournamentId}`}
          className="flex items-center text-forest-400 mb-6 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al torneo
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-forest-400 mb-2">Gestión de Reglas</h1>
          <p className="text-gray-300">{tournament.title}</p>
        </div>

        <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30">
          <CardHeader>
            <CardTitle className="text-forest-400 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Reglas del Torneo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RulesTextProcessor onSaveRules={handleSaveRules} initialText={rulesText} />
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  )
}
