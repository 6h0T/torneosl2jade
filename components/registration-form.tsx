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
                      className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white rounded-md w-1/3 px-3 py-2 appearance-none cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/70 transition-colors focus:ring-2 focus:ring-forest-500/30 focus:outline-none"
                      required
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234d9e73' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                        paddingRight: "30px",
                      }}
                    >
                      <option value="" className="bg-black text-gray-400">
                        -- {t("selectCountry")} --
                      </option>
                      <option value="+93" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇫 Afganistán (+93)
                      </option>
                      <option value="+355" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇱 Albania (+355)
                      </option>
                      <option value="+213" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇩🇿 Argelia (+213)
                      </option>
                      <option value="+376" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇩 Andorra (+376)
                      </option>
                      <option value="+244" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇴 Angola (+244)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇮 Anguila (+1)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇬 Antigua y Barbuda (+1)
                      </option>
                      <option value="+54" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇷 Argentina (+54)
                      </option>
                      <option value="+374" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇲 Armenia (+374)
                      </option>
                      <option value="+297" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇼 Aruba (+297)
                      </option>
                      <option value="+61" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇺 Australia (+61)
                      </option>
                      <option value="+43" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇹 Austria (+43)
                      </option>
                      <option value="+994" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇿 Azerbaiyán (+994)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇸 Bahamas (+1)
                      </option>
                      <option value="+973" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇭 Baréin (+973)
                      </option>
                      <option value="+880" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇩 Bangladés (+880)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇧 Barbados (+1)
                      </option>
                      <option value="+375" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇾 Bielorrusia (+375)
                      </option>
                      <option value="+32" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇪 Bélgica (+32)
                      </option>
                      <option value="+501" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇿 Belice (+501)
                      </option>
                      <option value="+229" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇯 Benín (+229)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇲 Bermudas (+1)
                      </option>
                      <option value="+975" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇹 Bután (+975)
                      </option>
                      <option value="+591" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇴 Bolivia (+591)
                      </option>
                      <option value="+387" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇦 Bosnia y Herzegovina (+387)
                      </option>
                      <option value="+267" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇼 Botsuana (+267)
                      </option>
                      <option value="+55" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇷 Brasil (+55)
                      </option>
                      <option value="+246" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇴 Territorio Británico del Océano Índico (+246)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇬 Islas Vírgenes Británicas (+1)
                      </option>
                      <option value="+673" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇳 Brunéi (+673)
                      </option>
                      <option value="+359" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇬 Bulgaria (+359)
                      </option>
                      <option value="+226" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇫 Burkina Faso (+226)
                      </option>
                      <option value="+257" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇮 Burundi (+257)
                      </option>
                      <option value="+855" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇭 Camboya (+855)
                      </option>
                      <option value="+237" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇲 Camerún (+237)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇦 Canadá (+1)
                      </option>
                      <option value="+238" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇻 Cabo Verde (+238)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇾 Islas Caimán (+1)
                      </option>
                      <option value="+236" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇫 República Centroafricana (+236)
                      </option>
                      <option value="+235" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇩 Chad (+235)
                      </option>
                      <option value="+56" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇱 Chile (+56)
                      </option>
                      <option value="+86" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇳 China (+86)
                      </option>
                      <option value="+61" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇽 Isla de Navidad (+61)
                      </option>
                      <option value="+61" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇨 Islas Cocos (+61)
                      </option>
                      <option value="+57" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇴 Colombia (+57)
                      </option>
                      <option value="+269" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇲 Comoras (+269)
                      </option>
                      <option value="+242" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇬 Congo (+242)
                      </option>
                      <option value="+243" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇩 República Democrática del Congo (+243)
                      </option>
                      <option value="+682" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇰 Islas Cook (+682)
                      </option>
                      <option value="+506" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇷 Costa Rica (+506)
                      </option>
                      <option value="+385" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇭🇷 Croacia (+385)
                      </option>
                      <option value="+53" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇺 Cuba (+53)
                      </option>
                      <option value="+599" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇼 Curazao (+599)
                      </option>
                      <option value="+357" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇾 Chipre (+357)
                      </option>
                      <option value="+420" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇿 República Checa (+420)
                      </option>
                      <option value="+45" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇩🇰 Dinamarca (+45)
                      </option>
                      <option value="+253" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇩🇯 Yibuti (+253)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇩🇲 Dominica (+1)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇩🇴 República Dominicana (+1)
                      </option>
                      <option value="+593" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇨 Ecuador (+593)
                      </option>
                      <option value="+20" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇬 Egipto (+20)
                      </option>
                      <option value="+503" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇻 El Salvador (+503)
                      </option>
                      <option value="+240" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇶 Guinea Ecuatorial (+240)
                      </option>
                      <option value="+291" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇷 Eritrea (+291)
                      </option>
                      <option value="+372" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇪 Estonia (+372)
                      </option>
                      <option value="+268" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇿 Esuatini (+268)
                      </option>
                      <option value="+251" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇹 Etiopía (+251)
                      </option>
                      <option value="+500" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇫🇰 Islas Malvinas (+500)
                      </option>
                      <option value="+298" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇫🇴 Islas Feroe (+298)
                      </option>
                      <option value="+679" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇫🇯 Fiyi (+679)
                      </option>
                      <option value="+358" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇫🇮 Finlandia (+358)
                      </option>
                      <option value="+33" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇫🇷 Francia (+33)
                      </option>
                      <option value="+594" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇫 Guayana Francesa (+594)
                      </option>
                      <option value="+689" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇫 Polinesia Francesa (+689)
                      </option>
                      <option value="+241" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇦 Gabón (+241)
                      </option>
                      <option value="+220" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇲 Gambia (+220)
                      </option>
                      <option value="+995" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇪 Georgia (+995)
                      </option>
                      <option value="+49" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇩🇪 Alemania (+49)
                      </option>
                      <option value="+233" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇭 Ghana (+233)
                      </option>
                      <option value="+350" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇮 Gibraltar (+350)
                      </option>
                      <option value="+30" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇷 Grecia (+30)
                      </option>
                      <option value="+299" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇱 Groenlandia (+299)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇩 Granada (+1)
                      </option>
                      <option value="+590" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇵 Guadalupe (+590)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇺 Guam (+1)
                      </option>
                      <option value="+502" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇹 Guatemala (+502)
                      </option>
                      <option value="+44" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇬 Guernsey (+44)
                      </option>
                      <option value="+224" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇳 Guinea (+224)
                      </option>
                      <option value="+245" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇼 Guinea-Bisáu (+245)
                      </option>
                      <option value="+592" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇾 Guyana (+592)
                      </option>
                      <option value="+509" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇭🇹 Haití (+509)
                      </option>
                      <option value="+504" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇭🇳 Honduras (+504)
                      </option>
                      <option value="+852" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇭🇰 Hong Kong (+852)
                      </option>
                      <option value="+36" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇭🇺 Hungría (+36)
                      </option>
                      <option value="+354" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇸 Islandia (+354)
                      </option>
                      <option value="+91" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇳 India (+91)
                      </option>
                      <option value="+62" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇩 Indonesia (+62)
                      </option>
                      <option value="+98" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇷 Irán (+98)
                      </option>
                      <option value="+964" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇶 Irak (+964)
                      </option>
                      <option value="+353" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇪 Irlanda (+353)
                      </option>
                      <option value="+44" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇲 Isla de Man (+44)
                      </option>
                      <option value="+972" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇱 Israel (+972)
                      </option>
                      <option value="+39" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇮🇹 Italia (+39)
                      </option>
                      <option value="+225" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇮 Costa de Marfil (+225)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇯🇲 Jamaica (+1)
                      </option>
                      <option value="+81" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇯🇵 Japón (+81)
                      </option>
                      <option value="+44" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇯🇪 Jersey (+44)
                      </option>
                      <option value="+962" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇯🇴 Jordania (+962)
                      </option>
                      <option value="+7" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇿 Kazajistán (+7)
                      </option>
                      <option value="+254" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇪 Kenia (+254)
                      </option>
                      <option value="+686" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇮 Kiribati (+686)
                      </option>
                      <option value="+383" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇽🇰 Kosovo (+383)
                      </option>
                      <option value="+965" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇼 Kuwait (+965)
                      </option>
                      <option value="+996" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇬 Kirguistán (+996)
                      </option>
                      <option value="+856" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇦 Laos (+856)
                      </option>
                      <option value="+371" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇻 Letonia (+371)
                      </option>
                      <option value="+961" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇧 Líbano (+961)
                      </option>
                      <option value="+266" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇸 Lesoto (+266)
                      </option>
                      <option value="+231" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇷 Liberia (+231)
                      </option>
                      <option value="+218" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇾 Libia (+218)
                      </option>
                      <option value="+423" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇮 Liechtenstein (+423)
                      </option>
                      <option value="+370" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇹 Lituania (+370)
                      </option>
                      <option value="+352" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇺 Luxemburgo (+352)
                      </option>
                      <option value="+853" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇴 Macao (+853)
                      </option>
                      <option value="+389" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇰 Macedonia del Norte (+389)
                      </option>
                      <option value="+261" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇬 Madagascar (+261)
                      </option>
                      <option value="+265" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇼 Malaui (+265)
                      </option>
                      <option value="+60" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇾 Malasia (+60)
                      </option>
                      <option value="+960" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇻 Maldivas (+960)
                      </option>
                      <option value="+223" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇱 Malí (+223)
                      </option>
                      <option value="+356" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇹 Malta (+356)
                      </option>
                      <option value="+692" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇭 Islas Marshall (+692)
                      </option>
                      <option value="+596" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇶 Martinica (+596)
                      </option>
                      <option value="+222" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇷 Mauritania (+222)
                      </option>
                      <option value="+230" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇺 Mauricio (+230)
                      </option>
                      <option value="+262" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇾🇹 Mayotte (+262)
                      </option>
                      <option value="+52" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇽 México (+52)
                      </option>
                      <option value="+691" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇫🇲 Micronesia (+691)
                      </option>
                      <option value="+373" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇩 Moldavia (+373)
                      </option>
                      <option value="+377" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇨 Mónaco (+377)
                      </option>
                      <option value="+976" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇳 Mongolia (+976)
                      </option>
                      <option value="+382" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇪 Montenegro (+382)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇸 Montserrat (+1)
                      </option>
                      <option value="+212" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇦 Marruecos (+212)
                      </option>
                      <option value="+258" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇿 Mozambique (+258)
                      </option>
                      <option value="+95" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇲 Myanmar (+95)
                      </option>
                      <option value="+264" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇦 Namibia (+264)
                      </option>
                      <option value="+674" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇷 Nauru (+674)
                      </option>
                      <option value="+977" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇵 Nepal (+977)
                      </option>
                      <option value="+31" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇱 Países Bajos (+31)
                      </option>
                      <option value="+687" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇨 Nueva Caledonia (+687)
                      </option>
                      <option value="+64" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇿 Nueva Zelanda (+64)
                      </option>
                      <option value="+505" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇮 Nicaragua (+505)
                      </option>
                      <option value="+227" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇪 Níger (+227)
                      </option>
                      <option value="+234" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇬 Nigeria (+234)
                      </option>
                      <option value="+683" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇺 Niue (+683)
                      </option>
                      <option value="+672" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇫 Isla Norfolk (+672)
                      </option>
                      <option value="+850" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇵 Corea del Norte (+850)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇵 Islas Marianas del Norte (+1)
                      </option>
                      <option value="+47" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇳🇴 Noruega (+47)
                      </option>
                      <option value="+968" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇴🇲 Omán (+968)
                      </option>
                      <option value="+92" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇰 Pakistán (+92)
                      </option>
                      <option value="+680" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇼 Palaos (+680)
                      </option>
                      <option value="+970" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇸 Palestina (+970)
                      </option>
                      <option value="+507" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇦 Panamá (+507)
                      </option>
                      <option value="+675" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇬 Papúa Nueva Guinea (+675)
                      </option>
                      <option value="+595" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇾 Paraguay (+595)
                      </option>
                      <option value="+51" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇪 Perú (+51)
                      </option>
                      <option value="+63" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇭 Filipinas (+63)
                      </option>
                      <option value="+48" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇱 Polonia (+48)
                      </option>
                      <option value="+351" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇹 Portugal (+351)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇷 Puerto Rico (+1)
                      </option>
                      <option value="+974" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇶🇦 Catar (+974)
                      </option>
                      <option value="+262" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇷🇪 Reunión (+262)
                      </option>
                      <option value="+40" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇷🇴 Rumania (+40)
                      </option>
                      <option value="+7" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇷🇺 Rusia (+7)
                      </option>
                      <option value="+250" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇷🇼 Ruanda (+250)
                      </option>
                      <option value="+590" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇧🇱 San Bartolomé (+590)
                      </option>
                      <option value="+290" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇭 Santa Elena (+290)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇳 San Cristóbal y Nieves (+1)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇨 Santa Lucía (+1)
                      </option>
                      <option value="+590" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇲🇫 San Martín (+590)
                      </option>
                      <option value="+508" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇵🇲 San Pedro y Miquelón (+508)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇨 San Vicente y las Granadinas (+1)
                      </option>
                      <option value="+685" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇼🇸 Samoa (+685)
                      </option>
                      <option value="+378" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇲 San Marino (+378)
                      </option>
                      <option value="+239" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇹 Santo Tomé y Príncipe (+239)
                      </option>
                      <option value="+966" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇦 Arabia Saudita (+966)
                      </option>
                      <option value="+221" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇳 Senegal (+221)
                      </option>
                      <option value="+381" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇷🇸 Serbia (+381)
                      </option>
                      <option value="+248" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇨 Seychelles (+248)
                      </option>
                      <option value="+232" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇱 Sierra Leona (+232)
                      </option>
                      <option value="+65" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇬 Singapur (+65)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇽 Sint Maarten (+1)
                      </option>
                      <option value="+421" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇰 Eslovaquia (+421)
                      </option>
                      <option value="+386" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇮 Eslovenia (+386)
                      </option>
                      <option value="+677" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇧 Islas Salomón (+677)
                      </option>
                      <option value="+252" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇴 Somalia (+252)
                      </option>
                      <option value="+27" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇿🇦 Sudáfrica (+27)
                      </option>
                      <option value="+82" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇰🇷 Corea del Sur (+82)
                      </option>
                      <option value="+211" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇸 Sudán del Sur (+211)
                      </option>
                      <option value="+34" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇸 España (+34)
                      </option>
                      <option value="+94" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇱🇰 Sri Lanka (+94)
                      </option>
                      <option value="+249" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇩 Sudán (+249)
                      </option>
                      <option value="+597" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇷 Surinam (+597)
                      </option>
                      <option value="+47" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇯 Svalbard y Jan Mayen (+47)
                      </option>
                      <option value="+46" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇪 Suecia (+46)
                      </option>
                      <option value="+41" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇨🇭 Suiza (+41)
                      </option>
                      <option value="+963" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇸🇾 Siria (+963)
                      </option>
                      <option value="+886" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇼 Taiwán (+886)
                      </option>
                      <option value="+992" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇯 Tayikistán (+992)
                      </option>
                      <option value="+255" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇿 Tanzania (+255)
                      </option>
                      <option value="+66" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇭 Tailandia (+66)
                      </option>
                      <option value="+670" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇱 Timor Oriental (+670)
                      </option>
                      <option value="+228" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇬 Togo (+228)
                      </option>
                      <option value="+690" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇰 Tokelau (+690)
                      </option>
                      <option value="+676" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇴 Tonga (+676)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇹 Trinidad y Tobago (+1)
                      </option>
                      <option value="+216" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇳 Túnez (+216)
                      </option>
                      <option value="+90" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇷 Turquía (+90)
                      </option>
                      <option value="+993" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇲 Turkmenistán (+993)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇨 Islas Turcas y Caicos (+1)
                      </option>
                      <option value="+688" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇹🇻 Tuvalu (+688)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇮 Islas Vírgenes de los Estados Unidos (+1)
                      </option>
                      <option value="+256" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇺🇬 Uganda (+256)
                      </option>
                      <option value="+380" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇺🇦 Ucrania (+380)
                      </option>
                      <option value="+971" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇦🇪 Emiratos Árabes Unidos (+971)
                      </option>
                      <option value="+44" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇬🇧 Reino Unido (+44)
                      </option>
                      <option value="+1" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇺🇸 Estados Unidos (+1)
                      </option>
                      <option value="+598" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇺🇾 Uruguay (+598)
                      </option>
                      <option value="+998" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇺🇿 Uzbekistán (+998)
                      </option>
                      <option value="+678" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇺 Vanuatu (+678)
                      </option>
                      <option value="+379" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇦 Ciudad del Vaticano (+379)
                      </option>
                      <option value="+58" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇪 Venezuela (+58)
                      </option>
                      <option value="+84" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇻🇳 Vietnam (+84)
                      </option>
                      <option value="+681" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇼🇫 Wallis y Futuna (+681)
                      </option>
                      <option value="+212" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇪🇭 Sahara Occidental (+212)
                      </option>
                      <option value="+967" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇾🇪 Yemen (+967)
                      </option>
                      <option value="+260" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇿🇲 Zambia (+260)
                      </option>
                      <option value="+263" className="bg-black/90 text-white py-1 hover:bg-forest-900/50">
                        🇿🇼 Zimbabue (+263)
                      </option>
                    </select>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="123456789"
                      required
                      className="bg-black/50 border-forest-800/50 focus:border-forest-400 text-white w-2/3 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-black/70 transition-colors focus:ring-2 focus:ring-forest-500/30 focus:outline-none"
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
