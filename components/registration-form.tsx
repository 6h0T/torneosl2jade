"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface RegistrationFormProps {
  activeTournament: any
  handleRegister: (formData: FormData) => Promise<void>
}

export default function RegistrationForm({ activeTournament, handleRegister }: RegistrationFormProps) {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-jade-400 mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToMain")}
      </Link>

      <div className="max-w-md mx-auto">
        <Card className="bg-black/80 backdrop-blur-sm border-jade-800/30">
          <CardHeader>
            <CardTitle className="text-xl text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">
              {t("teamRegistration")}
            </CardTitle>
            <CardDescription>
              {t("completeForm")} {activeTournament.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamName" className="text-jade-400">
                    {t("teamName")}
                  </Label>
                  <Input
                    id="teamName"
                    name="teamName"
                    placeholder={t("teamName")}
                    required
                    className="bg-black/50 border-jade-800/50 focus:border-jade-400 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-jade-800/30">
                  <h3 className="text-sm font-medium mb-4 text-jade-400">{t("teamMembers")}</h3>

                  {/* Miembro 1 (Líder) */}
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
                        className="bg-black/50 border-jade-800/50 focus:border-jade-400 text-white"
                      />
                      <input type="hidden" name="member1Class" value="No especificada" />
                    </div>
                  </div>

                  {/* Miembro 2 */}
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
                        className="bg-black/50 border-jade-800/50 focus:border-jade-400 text-white"
                      />
                      <input type="hidden" name="member2Class" value="No especificada" />
                    </div>
                  </div>

                  {/* Miembro 3 */}
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
                        className="bg-black/50 border-jade-800/50 focus:border-jade-400 text-white"
                      />
                      <input type="hidden" name="member3Class" value="No especificada" />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-jade-600 hover:bg-jade-700 text-white shadow-[0_0_10px_rgba(0,255,170,0.3)]"
              >
                {t("registerTeam")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
