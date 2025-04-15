"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Inicio de sesión exitoso. Redirigiendo...")
        setTimeout(() => {
          router.push(redirectedFrom)
        }, 1500)
      }
    } catch (err) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.")
      console.error("Error de inicio de sesión:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-sm border-jade-800/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-forest-400 text-center">Panel de Administración</CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-900/30 border border-red-800 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-forest-900/50 border border-forest-600 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-forest-400 mr-2 mt-0.5" />
                <p className="text-forest-200 text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-forest-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
                className="bg-black/50 border-forest-800 focus:border-forest-600 focus:ring-forest-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-forest-200">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="bg-black/50 border-forest-800 focus:border-forest-600 focus:ring-forest-500/30"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-500 text-white" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
