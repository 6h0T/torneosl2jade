"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import TournamentHtmlRules from "@/components/tournament-html-rules"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function TestHtmlTranslationPage() {
  const { locale, changeLocale } = useLanguage()
  const [htmlContent] = useState(`
<h2>Reglas del Torneo</h2>
<p>Bienvenido al torneo de Lineage 2. A continuación se detallan las reglas que todos los participantes deben seguir:</p>

<h3>Restricciones de Equipo</h3>
<ul>
  <li>Solo se podrá utilizar equipo de grado S +3.</li>
  <li>No se permite el uso de joyería épica.</li>
  <li>No se puede usar argumento.</li>
  <li>Tattoos, Spirit y Corpiños están prohibidos.</li>
</ul>

<h3>Composición de Equipos</h3>
<ul>
  <li>Solo una clase con habilidades curativas por equipo.</li>
  <li>No se permite tener 3 Warriors o 3 Magos en una misma party.</li>
  <li>Es obligatorio tener al menos un Warrior o un Mago en la composición del equipo.</li>
</ul>

<h3>Regla de Resurrección</h3>
<p><strong>Está totalmente prohibido</strong> dar resurrección durante el combate. El equipo que realice una resurrección será automáticamente descalificado.</p>

<h3>Uso de Pociones</h3>
<ul>
  <li>Se permite el uso ilimitado de pociones de MP y CP.</li>
  <li>Las pociones de HP están limitadas a 10 por combate.</li>
</ul>`)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-forest-400 mb-6">Prueba de Traducción HTML</h1>

      <div className="flex items-center space-x-4 mb-6">
        <span className="text-forest-300">Cambiar idioma:</span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={`${locale === "es" ? "bg-forest-900/30 text-forest-400" : "bg-black/50 text-forest-200"} border-forest-800/50 hover:bg-forest-900/30 hover:text-forest-100`}
            onClick={() => changeLocale("es")}
          >
            <Globe className="mr-1 h-3.5 w-3.5" />
            ES
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${locale === "en" ? "bg-forest-900/30 text-forest-400" : "bg-black/50 text-forest-200"} border-forest-800/50 hover:bg-forest-900/30 hover:text-forest-100`}
            onClick={() => changeLocale("en")}
          >
            <Globe className="mr-1 h-3.5 w-3.5" />
            EN
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${locale === "pt" ? "bg-forest-900/30 text-forest-400" : "bg-black/50 text-forest-200"} border-forest-800/50 hover:bg-forest-900/30 hover:text-forest-100`}
            onClick={() => changeLocale("pt")}
          >
            <Globe className="mr-1 h-3.5 w-3.5" />
            PT
          </Button>
        </div>
      </div>

      <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30">
        <CardHeader>
          <CardTitle className="text-forest-400">Reglas del Torneo (Traducción Automática)</CardTitle>
        </CardHeader>
        <CardContent>
          <TournamentHtmlRules htmlContent={htmlContent} />
        </CardContent>
      </Card>
    </div>
  )
}
