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
            <form action={handleRegister} className="space-y-6">
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
                    {t("teamPhone")}
                  </Label>
                  <div className="flex space-x-2">
                    <select
                      id="countryCode"
                      name="countryCode"
                      className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white rounded-md w-1/3"
                      required
                    >
                      <option value="">-- {t("selectCountry")} --</option>
                      <option value="+54">🇦🇷 Argentina (+54)</option>
                      <option value="+591">🇧🇴 Bolivia (+591)</option>
                      <option value="+55">🇧🇷 Brasil (+55)</option>
                      <option value="+56">🇨🇱 Chile (+56)</option>
                      <option value="+57">🇨🇴 Colombia (+57)</option>
                      <option value="+506">🇨🇷 Costa Rica (+506)</option>
                      <option value="+53">🇨🇺 Cuba (+53)</option>
                      <option value="+593">🇪🇨 Ecuador (+593)</option>
                      <option value="+503">🇸🇻 El Salvador (+503)</option>
                      <option value="+34">🇪🇸 España (+34)</option>
                      <option value="+502">🇬🇹 Guatemala (+502)</option>
                      <option value="+504">🇭🇳 Honduras (+504)</option>
                      <option value="+52">🇲🇽 México (+52)</option>
                      <option value="+505">🇳🇮 Nicaragua (+505)</option>
                      <option value="+507">🇵🇦 Panamá (+507)</option>
                      <option value="+595">🇵🇾 Paraguay (+595)</option>
                      <option value="+51">🇵🇪 Perú (+51)</option>
                      <option value="+1">🇵🇷 Puerto Rico (+1)</option>
                      <option value="+1">🇩🇴 República Dominicana (+1)</option>
                      <option value="+598">🇺🇾 Uruguay (+598)</option>
                      <option value="+58">🇻🇪 Venezuela (+58)</option>
                      <option value="+1">🇺🇸 Estados Unidos (+1)</option>
                      <option value="+44">🇬🇧 Reino Unido (+44)</option>
                      <option value="+351">🇵🇹 Portugal (+351)</option>
                    </select>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="123456789"
                      required
                      className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white w-2/3"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-jade-800/30">
                  <h3 className="text-sm font-medium mb-4 text-forest-400">{t("teamMembers")}</h3>

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
                        className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
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
                        className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
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
                        className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white"
                      />
                      <input type="hidden" name="member3Class" value="No especificada" />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700 text-white">
                {t("registerTeam")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
