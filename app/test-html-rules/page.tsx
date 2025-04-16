"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HtmlRulesEditor from "@/components/admin/html-rules-editor"
import TournamentHtmlRules from "@/components/tournament-html-rules"
import { useState } from "react"

export default function TestHtmlRulesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-forest-400 mb-6">Prueba de Reglas HTML</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30">
          <CardHeader>
            <CardTitle className="text-forest-400">Editor de Reglas HTML</CardTitle>
          </CardHeader>
          <CardContent>
            <TestHtmlRulesEditor />
          </CardContent>
        </Card>

        <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30">
          <CardHeader>
            <CardTitle className="text-forest-400">Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <TestHtmlRulesPreview />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente de editor con estado local
function TestHtmlRulesEditor() {
  const [htmlContent, setHtmlContent] = useState(`<h2>Reglas del Torneo</h2>
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

  const handleSaveRules = async (content: string) => {
    setHtmlContent(content)
    return Promise.resolve()
  }

  return <HtmlRulesEditor onSaveRules={handleSaveRules} initialHtml={htmlContent} />
}

// Componente de vista previa que muestra el HTML renderizado
function TestHtmlRulesPreview() {
  const [htmlContent, setHtmlContent] = useState(`<h2>Reglas del Torneo</h2>
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

  return <TournamentHtmlRules htmlContent={htmlContent} />
}
