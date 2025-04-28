"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CountrySelector, type Country } from "@/components/country-selector"
import RegistrationSuccessDialog from "@/components/registration-success-dialog"

interface RegistrationForm1v1Props {
  activeTournament: any
  handleRegister: (formData: FormData) => Promise<any>
}

export default function RegistrationForm1v1({ activeTournament, handleRegister }: RegistrationForm1v1Props) {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined)
  const [phoneExample, setPhoneExample] = useState<string>("123456789")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const formData = new FormData(e.currentTarget)
      if (selectedCountry) {
        formData.set("countryCode", selectedCountry.prefix)
      }
      const result = await handleRegister(formData)
      if (result && result.success) {
        setRegistrationResult(result)
        setTimeout(() => {
          setShowSuccessDialog(true)
        }, 100)
      } else if (result && !result.success) {
        setErrorMessage(result.message || "Error al registrar. Por favor, inténtalo de nuevo.")
      }
    } catch (error) {
      setErrorMessage("Error al enviar el formulario. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-forest-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la página principal
      </Link>
      <div className="max-w-md mx-auto">
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-xl text-forest-400">Registro Individual</CardTitle>
            <CardDescription>
              Completa el formulario para registrarte en el torneo {activeTournament.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-200 text-sm">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member1Name" className="text-jade-400 text-lg font-semibold">
                    Nombre del personaje
                  </Label>
                  <Input
                    id="member1Name"
                    name="member1Name"
                    placeholder="Nombre del personaje"
                    required
                    className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
                  />
                  <input type="hidden" name="member1Class" value="No especificada" />
                </div>
                <div className="mt-4 space-y-4">
                  <Label htmlFor="phoneNumber" className="text-forest-400 text-lg font-semibold">
                    Teléfono de contacto <span className="text-gray-400 text-xs">(Opcional)</span>
                  </Label>
                  <div className="flex space-x-2">
                    <div className="w-1/3">
                      <CountrySelector
                        onSelect={(country) => {
                          setSelectedCountry(country)
                          setPhoneExample(country.example)
                        }}
                        selectedCountry={selectedCountry}
                      />
                    </div>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder={phoneExample}
                      className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white w-2/3 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/70 transition-colors focus:ring-2 focus:ring-forest-500/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-forest-600 hover:bg-forest-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Registrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <RegistrationSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        tournamentId={registrationResult?.tournamentId || activeTournament.id}
      />
    </div>
  )
} 