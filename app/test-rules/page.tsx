import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TournamentRulesExample from "@/components/tournament-rules-example"

export default function TestRulesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-forest-400 mb-6">Test de Reglas</h1>

      <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30">
        <CardHeader>
          <CardTitle className="text-forest-400">Ejemplo de Reglas</CardTitle>
        </CardHeader>
        <CardContent>
          <TournamentRulesExample />
        </CardContent>
      </Card>
    </div>
  )
}
