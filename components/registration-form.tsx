"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import { CountrySelector, type Country } from "@/components/country-selector"
import RegistrationSuccessDialog from "@/components/registration-success-dialog"
import { useRouter } from "next/navigation"

interface RegistrationFormProps {
  activeTournament: any
  handleRegister: (formData: FormData) => Promise<any>
}

export default function RegistrationForm({ activeTournament, handleRegister }: RegistrationFormProps) {
  const { t } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined)
  const [phoneExample, setPhoneExample] = useState<string>("123456789")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<any>(null)
  const [tournamentType, setTournamentType] = useState<"1v1" | "3v3">("3v3")
  const router = useRouter()

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Añadir el countryCode al formData si existe un país seleccionado
      if (selectedCountry) {
        formData.set("countryCode", selectedCountry.prefix)
      }

      console.log("Cliente: Enviando formulario...")
      // Obtener el resultado del registro
      const result = await handleRegister(formData)
      console.log("Cliente: Resultado recibido:", result)

      if (result && result.success) {
        console.log("Cliente: Registro exitoso, mostrando diálogo")
        // Primero actualizamos el resultado y luego mostramos el diálogo
        setRegistrationResult(result)
        // Usar un setTimeout para asegurar que el estado se actualice antes de mostrar el diálogo
        setTimeout(() => {
          setShowSuccessDialog(true)
          console.log("Cliente: Dialog should be visible now")
        }, 100)
        router.push(`/torneos/${result.tournamentId}`)
      } else if (result && !result.success) {
        console.log("Cliente: Error en el registro:", result.message)
        // Mostrar mensaje de error del servidor
        setErrorMessage(result.message || "Error al registrar el equipo. Por favor, inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage("Error al enviar el formulario. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-forest-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToMain")}
      </Link>

      <div className="max-w-md mx-auto">
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-xl text-forest-400">{t("teamRegistration")}</CardTitle>
            <CardDescription>
              {t("completeForm")} {activeTournament.title}
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
                  <Label htmlFor="teamName" className="text-forest-400">
                    {t("teamName")}
                  </Label>
                  <Input
                    id="teamName"
                    name="teamName"
                    placeholder={t("teamName")}
                    required
                    className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
                  />
                </div>

                <div className="mt-4 space-y-4">
                  <Label htmlFor="teamPhone" className="text-forest-400">
                    {t("teamPhone")} <span className="text-gray-400 text-xs">(Opcional)</span>
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

                <div className="pt-4 border-t border-jade-800/30">
                  <h3 className="text-sm font-medium mb-4 text-forest-400">{t("teamMembers")}</h3>

                  {/* Member 1 (Leader) */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="member1Name" className="text-jade-400">
                        {t("member1")}
                      </Label>
                      <Input
                        id="member1Name"
                        name="member1Name"
                        placeholder={t("characterName")}
                        required
                        className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
                      />
                      <input type="hidden" name="member1Class" value="No especificada" />
                    </div>
                  </div>

                  {/* Renderizar miembros adicionales solo si es 3v3 */}
                  {activeTournament.type === "3v3" && (
                    <>
                      {/* Member 2 */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <Label htmlFor="member2Name" className="text-jade-400">
                            {t("member2")}
                          </Label>
                          <Input
                            id="member2Name"
                            name="member2Name"
                            placeholder={t("characterName")}
                            required
                            className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
                          />
                          <input type="hidden" name="member2Class" value="No especificada" />
                        </div>
                      </div>

                      {/* Member 3 */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="member3Name" className="text-jade-400">
                            {t("member3")}
                          </Label>
                          <Input
                            id="member3Name"
                            name="member3Name"
                            placeholder={t("characterName")}
                            required
                            className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
                          />
                          <input type="hidden" name="member3Class" value="No especificada" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-forest-600 hover:bg-forest-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : t("registerTeam")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de registro exitoso - siempre renderizado */}
      <RegistrationSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        tournamentId={registrationResult?.tournamentId || activeTournament.id}
      />
    </div>
  )
}
