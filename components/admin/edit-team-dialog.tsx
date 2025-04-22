"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Users, Phone } from "lucide-react"
import { updateTeam } from "@/lib/supabase/admin-actions"
import type { Team, TeamMember } from "@/lib/types"

interface EditTeamDialogProps {
  isOpen: boolean
  onClose: () => void
  team: Team
  members: TeamMember[]
  tournamentId: number
}

export default function EditTeamDialog({ isOpen, onClose, team, members, tournamentId }: EditTeamDialogProps) {
  const [teamName, setTeamName] = useState(team.name)
  const [teamPhone, setTeamPhone] = useState(team.phone || '')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(members)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleMemberNameChange = (index: number, value: string) => {
    const updatedMembers = [...teamMembers]
    updatedMembers[index] = {
      ...updatedMembers[index],
      name: value,
    }
    setTeamMembers(updatedMembers)
  }

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setMessage({
        type: "error",
        text: "El nombre del equipo no puede estar vacío.",
      })
      return
    }

    // Validar que todos los miembros tengan nombre
    for (const member of teamMembers) {
      if (!member.name.trim()) {
        setMessage({
          type: "error",
          text: "Todos los miembros deben tener un nombre.",
        })
        return
      }
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await updateTeam({
        teamId: team.id,
        teamName,
        teamPhone,
        members: teamMembers,
        tournamentId,
      })

      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success) {
        setTimeout(() => {
          onClose()
          // Recargar la página para mostrar los cambios
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      console.error("Error al actualizar el equipo:", error)
      setMessage({
        type: "error",
        text: "Error inesperado al actualizar el equipo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-jade-800/30">
        <DialogHeader>
          <DialogTitle className="text-jade-400">Editar Equipo</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.type === "success"
                  ? "bg-jade-900/50 border border-jade-600"
                  : "bg-red-900/30 border border-red-800"
              }`}
            >
              <div className="flex items-start">
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-jade-400 mr-2 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                )}
                <p className={`text-sm ${message.type === "success" ? "text-jade-200" : "text-red-200"}`}>
                  {message.text}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-gray-300">
              Nombre del Equipo
            </Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamPhone" className="text-gray-300 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Número de Teléfono
            </Label>
            <Input
              id="teamPhone"
              value={teamPhone}
              onChange={(e) => setTeamPhone(e.target.value)}
              placeholder="Ej: +34 123456789"
              className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-jade-400 mr-2" />
              <h3 className="text-sm font-medium text-jade-300">Miembros del Equipo</h3>
            </div>

            {teamMembers.map((member, index) => (
              <div key={member.id} className="space-y-2 p-3 border border-jade-800/30 rounded-md">
                <div>
                  <Label htmlFor={`member-${index}-name`} className="text-gray-300 text-xs">
                    Nombre del Personaje
                  </Label>
                  <Input
                    id={`member-${index}-name`}
                    value={member.name}
                    onChange={(e) => handleMemberNameChange(index, e.target.value)}
                    className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="border-gray-700 text-gray-300" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button className="bg-jade-600 hover:bg-jade-500 text-white" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
