"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Shield } from "lucide-react"
import TournamentRulesDropdown from "@/components/tournament-rules-dropdown"

interface RulesTextProcessorProps {
  onSaveRules?: (rules: { category: string; rule: string }[]) => Promise<void>
  initialText?: string
}

export default function RulesTextProcessor({ onSaveRules, initialText = "" }: RulesTextProcessorProps) {
  const [rulesText, setRulesText] = useState(initialText)
  const [processedRules, setProcessedRules] = useState<{ category: string; rule: string }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const processRules = () => {
    setIsProcessing(true)
    setMessage(null)

    try {
      // Dividir el texto por líneas o por puntos específicos
      const lines = rulesText.split(/\n|(?<=\.)\s+/g).filter((line) => line.trim().length > 0)

      const processedRules: { category: string; rule: string }[] = []
      let currentCategory = "Reglas Generales"

      // Expresiones regulares para detectar categorías
      const categoryRegex = /^(⚔️\s*)?([^:]+):/

      lines.forEach((line) => {
        line = line.trim()

        // Verificar si la línea es un título de categoría
        const categoryMatch = line.match(categoryRegex)

        if (categoryMatch) {
          // Es un título de categoría
          currentCategory = categoryMatch[2].trim()

          // Extraer la primera regla si hay contenido después de los dos puntos
          const firstRule = line.substring(categoryMatch[0].length).trim()
          if (firstRule) {
            processedRules.push({
              category: currentCategory,
              rule: firstRule,
            })
          }
        } else {
          // Es una regla dentro de la categoría actual
          processedRules.push({
            category: currentCategory,
            rule: line,
          })
        }
      })

      setProcessedRules(processedRules)
      setShowPreview(true)
      setMessage({
        type: "success",
        text: `Se han procesado ${processedRules.length} reglas en ${new Set(processedRules.map((r) => r.category)).size} categorías.`,
      })
    } catch (error) {
      console.error("Error al procesar las reglas:", error)
      setMessage({
        type: "error",
        text: "Error al procesar el texto de reglas. Verifica el formato.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveRules = async () => {
    if (!onSaveRules) return

    setIsProcessing(true)
    setMessage(null)

    try {
      await onSaveRules(processedRules)
      setMessage({
        type: "success",
        text: "Reglas guardadas correctamente.",
      })
    } catch (error) {
      console.error("Error al guardar las reglas:", error)
      setMessage({
        type: "error",
        text: "Error al guardar las reglas. Inténtalo de nuevo.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-forest-900/50 border border-forest-600"
              : "bg-red-900/30 border border-red-800"
          }`}
        >
          <div className="flex items-start">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-forest-400 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            )}
            <p className={message.type === "success" ? "text-forest-200" : "text-red-200"}>{message.text}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-forest-400 mr-2" />
          <h3 className="text-lg font-medium text-forest-400">Procesador de Reglas</h3>
        </div>

        <p className="text-sm text-gray-300">
          Ingresa el texto completo de las reglas. El sistema detectará automáticamente las categorías y reglas. Las
          categorías deben terminar con dos puntos (:) y cada regla debe estar en una línea separada o terminar con un
          punto.
        </p>

        <Textarea
          value={rulesText}
          onChange={(e) => setRulesText(e.target.value)}
          placeholder="Ejemplo:
Restricciones de Equipo: Solo se podrá utilizar equipo de grado S +3.
No se permite el uso de joyería épica.
No se puede usar argumento.

Composición de Equipos:
Solo una clase con habilidades curativas por equipo.
No se permite tener 3 Warriors o 3 Magos en una misma party."
          className="min-h-[300px] bg-black/50 border-forest-800 focus:border-forest-600 focus:ring-forest-500/30"
        />

        <div className="flex space-x-4">
          <Button
            onClick={processRules}
            className="bg-forest-600 hover:bg-forest-500 text-white"
            disabled={isProcessing || !rulesText.trim()}
          >
            {isProcessing ? "Procesando..." : "Procesar Reglas"}
          </Button>

          {processedRules.length > 0 && onSaveRules && (
            <Button
              onClick={handleSaveRules}
              className="bg-amber-600 hover:bg-amber-500 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Guardando..." : "Guardar Reglas"}
            </Button>
          )}
        </div>
      </div>

      {showPreview && (
        <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30 mt-6">
          <CardHeader>
            <CardTitle className="text-forest-400 text-lg">Vista Previa de Reglas</CardTitle>
          </CardHeader>
          <CardContent>
            <TournamentRulesDropdown rules={[]} rawText={rulesText} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
