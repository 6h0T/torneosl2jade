"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react"
import { changeTeamStatus, deleteTeam } from "@/lib/supabase/admin-actions"
import type { Team } from "@/lib/types"

interface TeamStatusChangerProps {
  team: Team
  tournamentId: number
  currentStatus: string
}

export default function TeamStatusChanger({ team, tournamentId, currentStatus }: TeamStatusChangerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Efecto para manejar la eliminación automática de equipos expulsados
  useEffect(() => {
    // Si el equipo es expulsado, set a timeout to delete it after 1 minute
    if (selectedStatus === "expelled" && message?.type === "success") {
      const timer = setTimeout(async () => {
        try {
          await deleteTeam(team.id, tournamentId)
          // La página será revalidada por la función deleteTeam
        } catch (error) {
          console.error("Error deleting expelled team:", error)
        }
      }, 60000) // 60000ms = 1 minuto

      return () => clearTimeout(timer)
    }
  }, [selectedStatus, message, team.id, tournamentId])

  // Función para cambiar el estado del equipo
  const handleStatusChange = async () => {
    if (selectedStatus === currentStatus) {
      setMessage({
        type: "error",
        text: "El estado seleccionado es el mismo que el actual.",
      })
      return
    }

    if ((selectedStatus === "rejected" || selectedStatus === "expelled") && !reason.trim()) {
      setMessage({
        type: "error",
        text: "Debes proporcionar un motivo para rechazar o expulsar al equipo.",
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await changeTeamStatus({
        teamId: team.id,
        status: selectedStatus as "approved" | "rejected" | "expelled",
        reason: reason,
        tournamentId,
      })

      // Añadir mensaje adicional para equipos expulsados
      if (result.success && selectedStatus === "expelled") {
        result.message += " El equipo será eliminado automáticamente en 1 minuto."
      }

      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success) {
        // Show success message
        setMessage({
          type: "success",
          text: result.message,
        })

        // Wait longer before closing dialog and reloading
        setTimeout(() => {
          setIsDialogOpen(false)

          // Add another delay before reloading to ensure DB updates are complete
          setTimeout(() => {
            window.location.reload()
          }, 1000) // 1 second delay before reload
        }, 1500)
      }
    } catch (error) {
      console.error("Error al cambiar el estado del equipo:", error)
      setMessage({
        type: "error",
        text: "Error inesperado al cambiar el estado del equipo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determinar el color del botón según el estado actual
  const getButtonStyle = () => {
    switch (currentStatus) {
      case "approved":
        return "text-jade-500 border-jade-500 hover:bg-jade-900/20"
      case "rejected":
        return "text-red-500 border-red-500 hover:bg-red-900/20"
      case "expelled":
        return "text-amber-500 border-amber-500 hover:bg-amber-900/20"
      default:
        return "text-gray-500 border-gray-500 hover:bg-gray-900/20"
    }
  }

  // Determinar el texto del botón según el estado actual
  const getButtonText = () => {
    switch (currentStatus) {
      case "approved":
        return "Aprobado"
      case "rejected":
        return "Rechazado"
      case "expelled":
        return "Expulsado"
      default:
        return "Pendiente"
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`text-xs ${getButtonStyle()}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <ShieldAlert className="h-3 w-3 mr-1" />
        {getButtonText()}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Cambiar Estado del Equipo</DialogTitle>
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

            <div>
              <Label htmlFor="team-status" className="text-gray-300">
                Estado del Equipo
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="team-status" className="bg-black/50 border-gray-700 focus:ring-jade-500/30">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-800">
                  <SelectItem value="approved" className="focus:bg-jade-900/50 focus:text-jade-100">
                    Aprobado
                  </SelectItem>
                  <SelectItem value="rejected" className="focus:bg-red-900/50 focus:text-red-100">
                    Rechazado
                  </SelectItem>
                  <SelectItem value="expelled" className="focus:bg-amber-900/50 focus:text-amber-100">
                    Expulsado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedStatus === "rejected" || selectedStatus === "expelled") && (
              <div>
                <Label htmlFor="reason" className="text-gray-300">
                  Motivo
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    selectedStatus === "rejected" ? "Indica el motivo del rechazo" : "Indica el motivo de la expulsión"
                  }
                  className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-jade-600 hover:bg-jade-500 text-white"
              onClick={handleStatusChange}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
