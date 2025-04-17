"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, RefreshCw } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DatabaseTester() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [details, setDetails] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setStatus("loading")
    setMessage("Probando conexión a la base de datos...")
    setDetails("")

    try {
      // Create Supabase client
      const supabase = createClientComponentClient()

      if (!supabase) {
        setStatus("error")
        setMessage("Error al crear el cliente de Supabase")
        setDetails("No se pudo inicializar el cliente de Supabase. Verifica las variables de entorno.")
        setIsLoading(false)
        return
      }

      // Test connection by fetching a simple query
      const { data, error } = await supabase.from("tournaments").select("count").limit(1)

      if (error) {
        setStatus("error")
        setMessage("Error de conexión a la base de datos")
        setDetails(`Error: ${error.message}\nCódigo: ${error.code}\nDetalles: ${JSON.stringify(error.details)}`)
        setIsLoading(false)
        return
      }

      // Test permissions by trying to insert and then delete a test record
      const testId = `test_${Date.now()}`
      const { error: insertError } = await supabase.from("teams").insert([
        {
          id: testId,
          name: "Test Team (Delete Me)",
          tournament_id: 1,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        setStatus("error")
        setMessage("Error de permisos de escritura")
        setDetails(
          `Error: ${insertError.message}\nCódigo: ${insertError.code}\nDetalles: ${JSON.stringify(insertError.details)}`,
        )
        setIsLoading(false)
        return
      }

      // Clean up the test record
      await supabase.from("teams").delete().eq("id", testId)

      // If we got here, everything is working
      setStatus("success")
      setMessage("Conexión exitosa a la base de datos")
      setDetails(
        "La conexión a la base de datos está funcionando correctamente y tienes permisos de lectura y escritura.",
      )
    } catch (error) {
      setStatus("error")
      setMessage("Error inesperado")
      setDetails(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Diagnóstico de Base de Datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {status === "loading" && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-forest-400 border-r-transparent" />
            )}
            {status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
            <span
              className={
                status === "success" ? "text-green-500" : status === "error" ? "text-red-500" : "text-gray-400"
              }
            >
              {message}
            </span>
          </div>

          {details && (
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-forest-400 hover:underline flex items-center"
              >
                {isExpanded ? "Ocultar detalles" : "Mostrar detalles"}
              </button>
              {isExpanded && (
                <pre className="mt-2 p-2 bg-black/50 border border-forest-800/30 rounded-md text-xs text-gray-300 whitespace-pre-wrap">
                  {details}
                </pre>
              )}
            </div>
          )}

          <Button
            onClick={testConnection}
            disabled={isLoading}
            variant="outline"
            className="mt-2 border-forest-600 text-forest-400 hover:bg-forest-900/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Probar conexión
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
