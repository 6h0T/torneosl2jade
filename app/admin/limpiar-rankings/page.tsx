"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Trash, Check } from "lucide-react"
import Link from "next/link"

export default function LimpiarRankingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    deleted?: number
  } | null>(null)

  const handleCleanRankings = async () => {
    if (isLoading) return
    
    try {
      setIsLoading(true)
      setResult(null)
      
      const response = await fetch("/api/clean-3v3-rankings")
      const data = await response.json()
      
      setResult(data)
    } catch (error) {
      console.error("Error al limpiar rankings:", error)
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
          <h1 className="text-3xl font-bold text-forest-400 mb-2">Limpiar Rankings 3vs3</h1>
          <p className="text-gray-300">Herramienta para eliminar los datos de prueba de los rankings 3vs3</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Volver al panel</Button>
        </Link>
      </div>

      <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
        <CardHeader>
          <CardTitle className="text-forest-400">Eliminar rankings 3vs3</CardTitle>
          <CardDescription>
            Esta acción eliminará todos los registros de ranking para equipos en modo 3vs3.
            Use esta herramienta solo para limpiar datos de prueba.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Esta acción es irreversible. Se eliminarán todos los datos de ranking para equipos 3vs3.
            </AlertDescription>
          </Alert>
          
          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-6">
              {result.success ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Operación exitosa" : "Error"}</AlertTitle>
              <AlertDescription>
                {result.message}
                {result.success && result.deleted !== undefined && (
                  <p className="mt-2 font-semibold">
                    Se eliminaron {result.deleted} registros de ranking.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            onClick={handleCleanRankings}
            disabled={isLoading}
            className="flex items-center"
          >
            <Trash className="mr-2 h-4 w-4" />
            {isLoading ? "Limpiando..." : "Limpiar Rankings 3vs3"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 