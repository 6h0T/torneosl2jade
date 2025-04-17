"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface RegistrationSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournamentId: number
}

export default function RegistrationSuccessDialog({
  open,
  onOpenChange,
  tournamentId,
}: RegistrationSuccessDialogProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  // Efecto para el contador de redirección
  useEffect(() => {
    if (open && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (open && redirectCountdown === 0) {
      // Redirigir cuando el contador llegue a cero
      router.push(`/torneos/${tournamentId}?success=true`)
    }
  }, [open, redirectCountdown, router, tournamentId])

  // Función para redirigir inmediatamente
  const handleRedirectNow = () => {
    router.push(`/torneos/${tournamentId}?success=true`)
  }

  // Al inicio del componente RegistrationSuccessDialog
  useEffect(() => {
    console.log("Dialog: Props recibidos:", { open, tournamentId })
  }, [open, tournamentId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-forest-800/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-forest-400 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-forest-400" />
            {t("registrationSuccess")}
          </DialogTitle>
          <DialogDescription className="text-gray-300">{t("registrationSuccessDesc")}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-forest-900/20 border border-forest-800/50 rounded-md p-4 text-center">
            <p className="text-forest-300 mb-2">{t("thanksForParticipating")}</p>
            <p className="text-gray-300">
              {t("pendingApprovalMessage")} <span className="text-forest-400 font-bold">{redirectCountdown}</span>{" "}
              {t("seconds")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleRedirectNow} className="w-full bg-forest-600 hover:bg-forest-500 text-white">
            {t("goToTournamentNow")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
