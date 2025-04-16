"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertCircle,
  CheckCircle2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Eye,
  Save,
  Shield,
  ChevronDown,
  Globe,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { translateHtmlContent } from "@/utils/html-translator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Locale } from "@/i18n/translations"

interface HtmlRulesEditorProps {
  onSaveRules?: (htmlContent: string) => Promise<void>
  initialHtml?: string
}

export default function HtmlRulesEditor({ onSaveRules, initialHtml = "" }: HtmlRulesEditorProps) {
  const { locale, t } = useLanguage()
  const [htmlContent, setHtmlContent] = useState(initialHtml)
  const [showPreview, setShowPreview] = useState(false)
  const [previewLocale, setPreviewLocale] = useState<Locale>("es")
  const [translatedContent, setTranslatedContent] = useState(htmlContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Update content when initialHtml changes (e.g., when editing an existing tournament)
    if (initialHtml) {
      setHtmlContent(initialHtml)
    }
  }, [initialHtml])

  // Traducir el contenido HTML cuando cambia el idioma de vista previa
  useEffect(() => {
    if (typeof window !== "undefined" && htmlContent) {
      const translated = translateHtmlContent(htmlContent, previewLocale)
      setTranslatedContent(translated)
    }
  }, [htmlContent, previewLocale])

  const insertTag = (openTag: string, closeTag: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    const newText = beforeText + openTag + selectedText + closeTag + afterText
    setHtmlContent(newText)

    // Set cursor position after the inserted content
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + openTag.length + selectedText.length + closeTag.length
      textarea.selectionEnd = start + openTag.length + selectedText.length + closeTag.length
    }, 0)
  }

  const handleSaveRules = async () => {
    if (!onSaveRules) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      await onSaveRules(htmlContent)
      setMessage({
        type: "success",
        text: "Reglas HTML guardadas correctamente.",
      })
    } catch (error) {
      console.error("Error al guardar las reglas HTML:", error)
      setMessage({
        type: "error",
        text: "Error al guardar las reglas HTML. Inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Plantilla de ejemplo para reglas HTML
  const exampleTemplate = `
<h2>Restricciones de Equipo</h2>
<ul>
  <li>Solo se podrá utilizar equipo de grado <strong>S +3</strong>.</li>
  <li>No se permite el uso de joyería épica.</li>
  <li>No se puede usar argumento.</li>
  <li><strong>Tattoos, Spirit y Corpiños</strong> están prohibidos.</li>
  <li>No se podrá utilizar <strong>Skin</strong>.</li>
</ul>

<h2>Condiciones del Área de Combate</h2>
<p>El área de combate neutraliza los efectos de:</p>
<ul>
  <li>Dolls</li>
  <li>Skills evolutivos</li>
</ul>
<p>Esto garantiza que todos los jugadores estén en igualdad de condiciones.</p>

<h2>Composición de Equipos</h2>
<ul>
  <li>Solo una clase con habilidades curativas por equipo.</li>
  <li>Ejemplo: Si hay un Bishop, no puede haber un Elder en el mismo equipo.</li>
  <li>No se permite tener 3 Warriors o 3 Magos en una misma party.</li>
  <li>Es obligatorio tener al menos un <strong>Warrior</strong> o un <strong>Mago</strong> en la composición del equipo.</li>
</ul>
`

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-forest-900/50 border border-forest-600"
              : "bg-red-900/30 border border-red-800"
          }`}
        >
          <div className="flex items-start">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-forest-400 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            )}
            <p className={message.type === "success" ? "text-forest-200" : "text-red-200"}>{message.text}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<h2>", "</h2>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            H2
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<h3>", "</h3>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            H3
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<p>", "</p>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            P
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<strong>", "</strong>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<em>", "</em>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<ol>\n  <li>", "</li>\n</ol>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<li>", "</li>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            LI
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<br>", "")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            BR
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("<code>", "</code>")}
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHtmlContent(exampleTemplate)}
            className="bg-black/50 border-forest-800 text-amber-400 hover:bg-amber-900/30 ml-auto"
          >
            Usar Plantilla
          </Button>
        </div>

        <Textarea
          ref={textareaRef}
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="Ingresa el código HTML para las reglas del torneo..."
          className="min-h-[300px] font-mono text-sm bg-black/50 border-forest-800 focus:border-forest-600 focus:ring-forest-500/30"
        />

        <div className="flex justify-between mt-4">
          <Button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="bg-black/50 border-forest-800 text-forest-400 hover:bg-forest-900/30"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Ocultar Vista Previa" : "Vista Previa"}
          </Button>

          {onSaveRules && (
            <Button
              type="button"
              onClick={handleSaveRules}
              className="bg-forest-600 hover:bg-forest-500 text-white"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar Reglas HTML"}
            </Button>
          )}
        </div>
      </div>

      {showPreview && (
        <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30 mt-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-forest-400">Vista Previa</h3>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-forest-400" />
                <Tabs
                  value={previewLocale}
                  onValueChange={(value) => setPreviewLocale(value as Locale)}
                  className="w-auto"
                >
                  <TabsList className="grid grid-cols-3 h-8 w-auto bg-black/80 border border-forest-800/30">
                    <TabsTrigger
                      value="es"
                      className="px-2 h-6 data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
                    >
                      ES
                    </TabsTrigger>
                    <TabsTrigger
                      value="en"
                      className="px-2 h-6 data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
                    >
                      EN
                    </TabsTrigger>
                    <TabsTrigger
                      value="pt"
                      className="px-2 h-6 data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
                    >
                      PT
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="border border-forest-800/30 rounded-md p-3">
              <div className="flex items-center justify-between cursor-pointer text-sm">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-jade-400" />
                  <span className="text-jade-400">{t("rules")}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-amber-400" />
              </div>
              <div className="pt-2 pl-6 text-sm">
                <div
                  className="prose prose-invert prose-sm max-w-none prose-headings:text-forest-400 prose-headings:text-sm prose-headings:font-medium prose-headings:my-1 prose-p:text-gray-300 prose-p:my-1 prose-p:text-xs prose-li:text-gray-300 prose-li:text-xs prose-ul:my-1 prose-ol:my-1 prose-strong:text-forest-300"
                  dangerouslySetInnerHTML={{ __html: translatedContent }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
