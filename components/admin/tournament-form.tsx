"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import { createTournament, updateTournament } from "@/lib/supabase/admin-actions"
import HtmlRulesEditor from "./html-rules-editor"
import type { Tournament, TournamentPrize, TournamentRule } from "@/lib/types"

interface TournamentFormProps {
  tournament?: Tournament
  prizes?: TournamentPrize[]
  rules?: TournamentRule[]
  htmlRules?: string
}

export default function TournamentForm({ tournament, prizes = [], rules = [], htmlRules = "" }: TournamentFormProps) {
  const isEditing = !!tournament

  const [formData, setFormData] = useState({
    title: tournament?.title || "",
    description: tournament?.description || "",
    dateRange: tournament?.date_range || "",
    prize: tournament?.prize || "",
    format: tournament?.format || "3v3",
    mode: tournament?.mode || "PvP",
    maxParticipants: tournament?.max_participants || 16,
    status: tournament?.status || "upcoming",
    featured: tournament?.featured || false,
    registrationType: tournament?.registration_type || "free",
  })

  const [tournamentPrizes, setTournamentPrizes] = useState<
    Array<{
      position: string
      reward: string
      icon: string
      color: string
      id?: number
    }>
  >(
    prizes.length
      ? prizes.map((prize) => ({
          id: prize.id,
          position: prize.position,
          reward: prize.reward,
          icon: prize.icon,
          color: prize.color,
        }))
      : [
          {
            position: "1er Puesto",
            reward: "",
            icon: "trophy",
            color: "text-yellow-500",
          },
        ],
  )

  const [tournamentRules, setTournamentRules] = useState<
    Array<{
      rule: string
      category?: string
      id?: number
    }>
  >(
    rules.length
      ? rules.map((rule) => ({
          id: rule.id,
          rule: rule.rule,
          category: rule.category,
        }))
      : [
          {
            rule: "Prohibido el uso de hacks o programas externos.",
            category: "Reglas Generales",
          },
        ],
  )

  const [currentHtmlRules, setCurrentHtmlRules] = useState(htmlRules || "")
  const [activeRulesTab, setActiveRulesTab] = useState<string>("text")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({ ...formData, [name]: checked })
  }

  const handlePrizeChange = (index: number, field: string, value: string) => {
    const updatedPrizes = [...tournamentPrizes]
    updatedPrizes[index] = {
      ...updatedPrizes[index],
      [field]: value,
    }
    setTournamentPrizes(updatedPrizes)
  }

  const handleRuleChange = (index: number, value: string) => {
    const updatedRules = [...tournamentRules]
    updatedRules[index] = {
      ...updatedRules[index],
      rule: value,
    }
    setTournamentRules(updatedRules)
  }

  const addPrize = () => {
    setTournamentPrizes([
      ...tournamentPrizes,
      {
        position: `${tournamentPrizes.length + 1}º Puesto`,
        reward: "",
        icon: "medal",
        color: "text-gray-400",
      },
    ])
  }

  const addRule = () => {
    setTournamentRules([
      ...tournamentRules,
      {
        rule: "",
        category: "Reglas Generales",
      },
    ])
  }

  const removePrize = (index: number) => {
    setTournamentPrizes(tournamentPrizes.filter((_, i) => i !== index))
  }

  const removeRule = (index: number) => {
    setTournamentRules(tournamentRules.filter((_, i) => i !== index))
  }

  const handleSaveRules = async (processedRules: { category: string; rule: string }[]) => {
    setTournamentRules(
      processedRules.map((rule) => ({
        rule: rule.rule,
        category: rule.category,
      })),
    )
    return Promise.resolve()
  }

  const handleSaveHtmlRules = async (htmlContent: string) => {
    setCurrentHtmlRules(htmlContent)
    return Promise.resolve()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = isEditing
        ? await updateTournament({
            id: tournament.id,
            ...formData,
            prizes: tournamentPrizes,
            rules: tournamentRules,
            htmlRules: activeRulesTab === "html" ? currentHtmlRules : "",
          })
        : await createTournament({
            ...formData,
            prizes: tournamentPrizes,
            rules: tournamentRules,
            htmlRules: activeRulesTab === "html" ? currentHtmlRules : "",
          })

      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success && !isEditing) {
        // Reset form after successful creation
        setFormData({
          title: "",
          description: "",
          dateRange: "",
          prize: "",
          format: "3v3",
          mode: "PvP",
          maxParticipants: 16,
          status: "upcoming",
          featured: false,
          registrationType: "free",
        })
        setTournamentPrizes([
          {
            position: "1er Puesto",
            reward: "",
            icon: "trophy",
            color: "text-yellow-500",
          },
        ])
        setTournamentRules([
          {
            rule: "Prohibido el uso de hacks o programas externos.",
            category: "Reglas Generales",
          },
        ])
        setCurrentHtmlRules("")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setMessage({
        type: "error",
        text: "Error inesperado al guardar el torneo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-jade-900/50 border border-jade-600" : "bg-red-900/30 border border-red-800"
          }`}
        >
          <div className="flex items-start">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-jade-400 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            )}
            <p className={message.type === "success" ? "text-jade-200" : "text-red-200"}>{message.text}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-jade-400">
              Título del Torneo
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
              className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-jade-400">
              Descripción
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={3}
              className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>

          <div>
            <Label htmlFor="dateRange" className="text-jade-400">
              Rango de Fechas
            </Label>
            <Input
              id="dateRange"
              name="dateRange"
              value={formData.dateRange}
              onChange={handleFormChange}
              placeholder="Ej: 10-15 Septiembre 2023"
              className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>

          <div>
            <Label htmlFor="prize" className="text-jade-400">
              Premio Principal (Resumen)
            </Label>
            <Input
              id="prize"
              name="prize"
              value={formData.prize}
              onChange={handleFormChange}
              placeholder="Ej: 10,000 Adena"
              className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>
        </div>

        {/* Configuración del torneo */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="format" className="text-jade-400">
              Formato
            </Label>
            <Select
              value={formData.format}
              onValueChange={(value) => handleSelectChange("format", value)}
              name="format"
            >
              <SelectTrigger className="bg-black/50 border-jade-800 focus:ring-jade-500/30">
                <SelectValue placeholder="Selecciona el formato" />
              </SelectTrigger>
              <SelectContent className="bg-black border-jade-800">
                <SelectItem value="3v3" className="focus:bg-jade-900/50 focus:text-jade-100">
                  3v3
                </SelectItem>
                <SelectItem value="5v5" className="focus:bg-jade-900/50 focus:text-jade-100">
                  5v5
                </SelectItem>
                <SelectItem value="1v1" className="focus:bg-jade-900/50 focus:text-jade-100">
                  1v1
                </SelectItem>
                <SelectItem value="Suizo + Eliminación" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Suizo + Eliminación Directa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mode" className="text-jade-400">
              Modo
            </Label>
            <Select value={formData.mode} onValueChange={(value) => handleSelectChange("mode", value)} name="mode">
              <SelectTrigger className="bg-black/50 border-jade-800 focus:ring-jade-500/30">
                <SelectValue placeholder="Selecciona el modo" />
              </SelectTrigger>
              <SelectContent className="bg-black border-jade-800">
                <SelectItem value="PvP" className="focus:bg-jade-900/50 focus:text-jade-100">
                  PvP
                </SelectItem>
                <SelectItem value="Clan vs Clan" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Clan vs Clan
                </SelectItem>
                <SelectItem value="Conquest" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Conquest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxParticipants" className="text-jade-400">
              Máximo de Participantes
            </Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="2"
              max="64"
              value={formData.maxParticipants}
              onChange={handleFormChange}
              className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-jade-400">
              Estado
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              name="status"
            >
              <SelectTrigger className="bg-black/50 border-jade-800 focus:ring-jade-500/30">
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent className="bg-black border-jade-800">
                <SelectItem value="upcoming" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Próximamente
                </SelectItem>
                <SelectItem value="active" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Activo
                </SelectItem>
                <SelectItem value="completed" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Completado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="rounded border-jade-800 text-jade-600 focus:ring-jade-500/30"
            />
            <Label htmlFor="featured" className="text-jade-400">
              Destacado en la página principal
            </Label>
          </div>

          <div>
            <Label htmlFor="registrationType" className="text-jade-400">
              Tipo de Inscripción
            </Label>
            <Select
              value={formData.registrationType}
              onValueChange={(value) => handleSelectChange("registrationType", value)}
              name="registrationType"
            >
              <SelectTrigger className="bg-black/50 border-jade-800 focus:ring-jade-500/30">
                <SelectValue placeholder="Selecciona el tipo de inscripción" />
              </SelectTrigger>
              <SelectContent className="bg-black border-jade-800">
                <SelectItem value="free" className="focus:bg-jade-900/50 focus:text-jade-100">
                  Gratuita
                </SelectItem>
                <SelectItem value="paid" className="focus:bg-jade-900/50 focus:text-jade-100">
                  De pago
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Configuración de reglas */}
      <div className="pt-6 border-t border-jade-800/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-jade-400">Reglas del Torneo</h3>
        </div>

        <div className="w-full">
          <h3 className="text-lg font-medium text-jade-400 mb-4">Editor de Reglas HTML</h3>
          <HtmlRulesEditor onSaveRules={handleSaveHtmlRules} initialHtml={currentHtmlRules} />
        </div>
      </div>

      {/* Configuración de premios */}
      <div className="pt-6 border-t border-jade-800/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-jade-400">Premios del Torneo</h3>
          <Button type="button" onClick={addPrize} className="bg-jade-600 hover:bg-jade-500 text-white" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Añadir Premio
          </Button>
        </div>

        <div className="space-y-4">
          {tournamentPrizes.map((prize, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-jade-800/30 rounded-md">
              <div>
                <Label htmlFor={`prize-position-${index}`} className="text-jade-400 text-sm">
                  Posición
                </Label>
                <Input
                  id={`prize-position-${index}`}
                  value={prize.position}
                  onChange={(e) => handlePrizeChange(index, "position", e.target.value)}
                  className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`prize-reward-${index}`} className="text-jade-400 text-sm">
                  Recompensa
                </Label>
                <Input
                  id={`prize-reward-${index}`}
                  value={prize.reward}
                  onChange={(e) => handlePrizeChange(index, "reward", e.target.value)}
                  placeholder="Ej: 10,000 Adena + Arma de Grado S"
                  className="bg-black/50 border-jade-800 focus:border-jade-600 focus:ring-jade-500/30"
                />
              </div>
              <div>
                <Label htmlFor={`prize-icon-${index}`} className="text-jade-400 text-sm">
                  Ícono
                </Label>
                <Select value={prize.icon} onValueChange={(value) => handlePrizeChange(index, "icon", value)}>
                  <SelectTrigger className="bg-black/50 border-jade-800 focus:ring-jade-500/30">
                    <SelectValue placeholder="Ícono" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-jade-800">
                    <SelectItem value="trophy" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Trofeo
                    </SelectItem>
                    <SelectItem value="medal" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Medalla
                    </SelectItem>
                    <SelectItem value="award" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Premio
                    </SelectItem>
                    <SelectItem value="gift" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Regalo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Select
                  value={prize.color}
                  onValueChange={(value) => handlePrizeChange(index, "color", value)}
                  className="flex-1 mr-2"
                >
                  <SelectTrigger className="bg-black/50 border-jade-800 focus:ring-jade-500/30">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-jade-800">
                    <SelectItem value="text-yellow-500" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Oro
                    </SelectItem>
                    <SelectItem value="text-gray-400" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Plata
                    </SelectItem>
                    <SelectItem value="text-amber-700" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Bronce
                    </SelectItem>
                    <SelectItem value="text-jade-400" className="focus:bg-jade-900/50 focus:text-jade-100">
                      Jade
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => removePrize(index)}
                  variant="outline"
                  size="icon"
                  className="border-red-800 text-red-400 hover:bg-red-900/30"
                  disabled={tournamentPrizes.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400 mt-2">
          <p>
            Configure los premios que se mostrarán en la página del torneo. Puede añadir múltiples premios para
            diferentes posiciones.
          </p>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <Button type="submit" className="bg-jade-600 hover:bg-jade-500 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Torneo" : "Crear Torneo"}
        </Button>
      </div>
    </form>
  )
}
