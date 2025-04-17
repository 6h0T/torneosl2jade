"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClientComponentClient()

        // Try to fetch a single row from the teams table
        const { data, error } = await supabase.from("teams").select("id").limit(1)

        if (error) {
          console.error("Database connection error:", error)
          setStatus("error")
          setMessage(`Error: ${error.message}`)
          return
        }

        setStatus("connected")
        setMessage(`Connected successfully. Data available: ${data ? "Yes" : "No"}`)
      } catch (err) {
        console.error("Unexpected error:", err)
        setStatus("error")
        setMessage(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    checkConnection()
  }, [])

  if (status === "loading") {
    return <div className="p-2 text-sm text-gray-400">Verificando conexión a la base de datos...</div>
  }

  return (
    <div
      className={`p-2 text-sm rounded-md ${
        status === "connected"
          ? "text-forest-400 bg-forest-900/20 border border-forest-800/30"
          : "text-red-400 bg-red-900/20 border border-red-800/30"
      }`}
    >
      <div className="flex items-center">
        {status === "connected" ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
        <span>{message}</span>
      </div>
    </div>
  )
}
