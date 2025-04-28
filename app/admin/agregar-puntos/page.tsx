"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Award, Check, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AgregarPuntosPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    updated?: Array<{
      id: number
      teamId: number
      teamName: string
      category: string
      position: number
      format?: string
      oldPoints: number
      newPoints: number
      pointsAdded: number
    }>
  } | null>(null)

  const handleAddPoints = async () => {
    if (isLoading) return
    
    try {
      setIsLoading(true)
      setResult(null)
      
      const response = await fetch("/api/add-points-one-time")
      const data = await response.json()
      
      setResult(data)
    } catch (error) {
      console.error("Error al agregar puntos:", error)
      setResult({
        success: false,
        message: "Error al procesar la solicitud. Verifica la consola para más detalles."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-forest-400 mb-2">Agregar Puntos Extra</h1>
          <p className="text-gray-300">Herramienta para agregar puntos extras a los tres primeros puestos de cada categoría</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Volver al panel</Button>
        </Link>
      </div>

      <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
        <CardHeader>
          <CardTitle className="text-forest-400">Agregar puntos extras por posición</CardTitle>
          <CardDescription>
            Esta herramienta agregará los siguientes puntos extra:
            <ul className="list-disc ml-5 mt-2">
              <li>15 puntos extras a los primeros puestos</li>
              <li>10 puntos extras a los segundos puestos</li>
              <li>5 puntos extras a los terceros puestos</li>
            </ul>
            <div className="mt-2 text-amber-400">
              <strong>ADVERTENCIA:</strong> Esta acción solo debe ejecutarse UNA VEZ. Si se ejecuta varias veces, 
              se duplicarán los puntos extras.
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-6">
              {result.success ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Operación exitosa" : "Error"}</AlertTitle>
              <AlertDescription>
                {result.message}
                
                {result.success && result.updated && result.updated.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Equipos actualizados:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="border-b border-jade-800/30">
                          <tr>
                            <th className="px-4 py-2">Equipo</th>
                            <th className="px-4 py-2">Categoría</th>
                            <th className="px-4 py-2 text-center">Posición</th>
                            <th className="px-4 py-2 text-right">Puntos Anteriores</th>
                            <th className="px-4 py-2 text-right">Puntos Añadidos</th>
                            <th className="px-4 py-2 text-right">Puntos Actuales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.updated.map((item) => (
                            <tr key={item.id} className="border-b border-jade-800/20">
                              <td className="px-4 py-2 font-medium">{item.teamName}</td>
                              <td className="px-4 py-2">{item.category}</td>
                              <td className="px-4 py-2 text-center">{item.position}°</td>
                              <td className="px-4 py-2 text-right">{item.oldPoints}</td>
                              <td className="px-4 py-2 text-right text-green-400">+{item.pointsAdded}</td>
                              <td className="px-4 py-2 text-right font-bold">{item.newPoints}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            onClick={handleAddPoints}
            disabled={isLoading}
            className="flex items-center bg-amber-600 hover:bg-amber-500"
          >
            <Award className="mr-2 h-4 w-4" />
            {isLoading ? "Agregando puntos extras..." : "Agregar puntos extras"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 