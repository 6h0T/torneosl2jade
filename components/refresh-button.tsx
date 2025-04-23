"use client"

import { Button } from "@/components/ui/button"

export default function RefreshButton({ className }: { className?: string }) {
  return (
    <Button
      onClick={() => {
        // Añadir un timestamp para evitar caché
        const timestamp = new Date().getTime()
        window.location.href = window.location.pathname + "?t=" + timestamp
      }}
      className={className || "bg-jade-600 hover:bg-jade-500 text-white"}
      size="sm"
    >
      Recargar datos
    </Button>
  )
} 