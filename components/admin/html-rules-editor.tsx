"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Shield, Bold, Italic, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HtmlRulesEditorProps {
  onSaveRules?: (htmlRules: string) => Promise<void>
  initialHtml?: string
}

export default function HtmlRulesEditor({ onSaveRules, initialHtml = "" }: HtmlRulesEditorProps) {
  const [htmlContent, setHtmlContent] = useState(initialHtml)
  const [previewContent, setPreviewContent] = useState(initialHtml)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<string>("edit")

  const handlePreview = () => {
    setPreviewContent(htmlContent)
    setActiveTab("preview")
  }

  const handleSaveRules = async () => {
    if (!onSaveRules) return

    setIsProcessing(true)
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
      setIsProcessing(false)
    }
  }

  const insertTag = (tag: string) => {
    const textarea = document.getElementById("html-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = htmlContent.substring(start, end)
    const beforeText = htmlContent.substring(0, start)
    const afterText = htmlContent.substring(end)

    let newText = ""
    switch (tag) {
      case "b":
        newText = `${beforeText}<b>${selectedText}</b>${afterText}`
        break
      case "i":
        newText = `${beforeText}<i>${selectedText}</i>${afterText}`
        break
      case "ul":
        newText = `${beforeText}<ul>\n  <li>${selectedText}</li>\n</ul>${afterText}`
        break
      case "li":
        newText = `${beforeText}<li>${selectedText}</li>${afterText}`
        break
      case "br":
        newText = `${beforeText}<br>${afterText}`
        break
      case "h3":
        newText = `${beforeText}<h3>${selectedText}</h3>${afterText}`
        break
      case "p":
        newText = `${beforeText}<p>${selectedText}</p>${afterText}`
        break
      default:
        newText = htmlContent
    }

    setHtmlContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2)
    }, 0)
  }

  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-forest-400 mr-2" />
          <h3 className="text-lg font-medium text-forest-400">Editor de Reglas HTML</h3>
        </div>

        <p className="text-sm text-gray-300">
          Utiliza HTML para dar formato a las reglas del torneo. Puedes usar etiquetas como &lt;b&gt;, &lt;i&gt;,
          &lt;ul&gt;, &lt;li&gt;, &lt;br&gt;, etc.
        </p>

        <div className="bg-black/50 border border-forest-800/30 rounded-md p-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("b")}
            >
              <Bold className="h-4 w-4 mr-1" /> Negrita
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("i")}
            >
              <Italic className="h-4 w-4 mr-1" /> Cursiva
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("ul")}
            >
              <List className="h-4 w-4 mr-1" /> Lista
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("li")}
            >
              <List className="h-4 w-4 mr-1" /> Elemento
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("br")}
            >
              Salto de línea
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("h3")}
            >
              Título
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 border-forest-600 text-forest-400"
              onClick={() => insertTag("p")}
            >
              Párrafo
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/80 border border-forest-800/30">
            <TabsTrigger
              value="edit"
              className="data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
            >
              Editar HTML
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-forest-900/80 data-[state=active]:text-forest-100"
            >
              Vista Previa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0">
            <textarea
              id="html-editor"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="w-full h-[400px] p-4 bg-black/50 border-forest-800 focus:border-forest-600 focus:ring-forest-500/30 font-mono text-sm"
              placeholder="<h3>Restricciones de Equipo:</h3>
<ul>
  <li>Solo se podrá utilizar equipo de grado S +3.</li>
  <li>No se permite el uso de joyería épica.</li>
</ul>

<h3>Composición de Equipos:</h3>
<ul>
  <li>Solo una clase con habilidades curativas por equipo.</li>
  <li>No se permite tener 3 Warriors o 3 Magos en una misma party.</li>
</ul>"
            ></textarea>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <Card className="bg-black/80 backdrop-blur-sm border-forest-800/30">
              <CardHeader>
                <CardTitle className="text-forest-400 text-lg">Vista Previa de Reglas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-gray-300 text-sm space-y-4"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex space-x-4">
          <Button
            onClick={handlePreview}
            className="bg-amber-600 hover:bg-amber-500 text-white"
            disabled={isProcessing}
          >
            Vista Previa
          </Button>

          <Button
            onClick={handleSaveRules}
            className="bg-forest-600 hover:bg-forest-500 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? "Guardando..." : "Guardar Reglas HTML"}
          </Button>
        </div>
      </div>
    </div>
  )
}
