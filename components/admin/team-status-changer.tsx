"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changeTeamStatus } from "@/lib/supabase/actions"
import { useRouter } from "next/navigation"

interface TeamStatusChangerProps {
  team: {
    id: number
    name: string
    status: string
  }
  tournamentId: number
  currentStatus: "pending" | "approved" | "rejected" | "expelled"
}

export default function TeamStatusChanger({ team, tournamentId, currentStatus }: TeamStatusChangerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState<string>("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    // Si el estado es el mismo, no hacer nada
    if (newStatus === currentStatus) return

    // Si el nuevo estado es rechazado o expulsado, mostrar diálogo para razón
    if (newStatus === "rejected" || newStatus === "expelled") {
      setTargetStatus(newStatus)
      setIsDialogOpen(true)
      return
    }

    // Para otros estados, cambiar directamente
    await updateTeamStatus(newStatus)
  }

  const updateTeamStatus = async (newStatus: string, rejectionReason = "") => {
    setIsLoading(true)
    setError(null)

    try {
      console.log(`Updating team ${team.id} status from ${currentStatus} to ${newStatus}`)

      const result = await changeTeamStatus(team.id, newStatus, rejectionReason, tournamentId)

      console.log("Status change result:", result)

      if (result.success) {
        // Forzar una recarga completa de la página con un timestamp para evitar caché
        const timestamp = new Date().getTime()
        router.push(`/admin/torneos/${tournamentId}?t=${timestamp}`)
        // También podemos forzar un refresh completo
        window.location.href = `/admin/torneos/${tournamentId}?t=${timestamp}`
      } else {
        setError(result.message || "Error al cambiar el estado del equipo")
        console.error("Error changing team status:", result)
      }
    } catch (err) {
      console.error("Error in updateTeamStatus:", err)
      setError("Error inesperado al cambiar el estado del equipo")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDialogConfirm = () => {
    updateTeamStatus(targetStatus, reason)
  }

  // Determinar el color del badge según el estado
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600"
      case "approved":
        return "bg-jade-600"
      case "rejected":
        return "bg-red-600"
      case "expelled":
        return "bg-amber-600"
      default:
        return "bg-gray-600"
    }
  }

  // Traducir el estado para mostrar
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "approved":
        return "Aprobado"
      case "rejected":
        return "Rechazado"
      case "expelled":
        return "Expulsado"
      default:
        return status
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`${getBadgeColor(currentStatus)} text-white`}>
            {getStatusText(currentStatus)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== "pending" && (
            <DropdownMenuItem onClick={() => handleStatusChange("pending")}>Marcar como Pendiente</DropdownMenuItem>
          )}
          {currentStatus !== "approved" && (
            <DropdownMenuItem onClick={() => handleStatusChange("approved")}>Aprobar Equipo</DropdownMenuItem>
          )}
          {currentStatus !== "rejected" && (
            <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>Rechazar Equipo</DropdownMenuItem>
          )}
          {currentStatus !== "expelled" && (
            <DropdownMenuItem onClick={() => handleStatusChange("expelled")}>Expulsar Equipo</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">
              {targetStatus === "rejected" ? "Rechazar Equipo" : "Expulsar Equipo"}
            </DialogTitle>
            <DialogDescription>
              {targetStatus === "rejected"
                ? "Proporciona un motivo para el rechazo del equipo."
                : "Proporciona un motivo para la expulsión del equipo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3 bg-black/60 border-jade-800/50"
                placeholder="Ingresa el motivo..."
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-jade-800/50"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDialogConfirm}
              disabled={isLoading}
              className="bg-jade-600 hover:bg-jade-700"
            >
              {isLoading ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
