"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, UserMinus } from "lucide-react"
import { deleteExpelledTeams } from "@/lib/supabase/admin-actions"

interface DeleteExpelledTeamsButtonProps {
  tournamentId?: number
  className?: string
}

export default function DeleteExpelledTeamsButton({ tournamentId, className }: DeleteExpelledTeamsButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleDeleteExpelledTeams = async () => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await deleteExpelledTeams(tournamentId)

      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success) {
        setTimeout(() => {
          // Usar una URL con parámetros para forzar recarga completa evitando caché
          const timestamp = new Date().getTime()
          const refreshUrl = tournamentId 
            ? `/admin/torneos/${tournamentId}?t=${timestamp}&refresh=true` 
            : `/admin?t=${timestamp}&refresh=true`
            
          // Usar window.location.href para una recarga completa de la página
          window.location.href = refreshUrl
        }, 1500)
      }
    } catch (error) {
      console.error("Error al eliminar equipos expulsados:", error)
      setMessage({
        type: "error",
        text: "Error inesperado al eliminar equipos expulsados.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className={`${className || ""}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <UserMinus className="h-4 w-4 mr-2" />
        Eliminar Equipos Expulsados
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-red-800/30">
          <DialogHeader>
            <DialogTitle className="text-red-400">Eliminar Equipos Expulsados</DialogTitle>
            <DialogDescription className="text-gray-300">
              Esta acción eliminará permanentemente todos los equipos expulsados 
              {tournamentId ? " de este torneo" : ""}. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-900/50 border border-green-600"
                    : "bg-red-900/30 border border-red-800"
                }`}
              >
                <div className="flex items-start">
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                  )}
                  <p className={`text-sm ${message.type === "success" ? "text-green-200" : "text-red-200"}`}>
                    {message.text}
                  </p>
                </div>
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
              variant="destructive"
              onClick={handleDeleteExpelledTeams}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Eliminando..." : "Eliminar Equipos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 