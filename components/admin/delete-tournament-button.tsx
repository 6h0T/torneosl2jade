"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteTournament } from "@/lib/supabase/admin-actions"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteTournamentButtonProps {
  tournamentId: number
  tournamentTitle: string
}

export default function DeleteTournamentButton({ tournamentId, tournamentTitle }: DeleteTournamentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteTournament(tournamentId)
      if (result.success) {
        router.push("/admin")
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting tournament:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-600 text-red-400 hover:bg-red-900/50 hover:text-red-100 hover:border-red-400"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black/90 border-red-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Esta acción no se puede deshacer. Se borrará permanentemente el torneo "{tournamentTitle}" y todos sus datos
            asociados (equipos, partidos, premios y reglas).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800/50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-500 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Borrando..." : "Borrar Torneo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 