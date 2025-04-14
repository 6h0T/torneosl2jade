"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClientComponentClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="border-gray-700 text-gray-300 hover:bg-red-900/20 hover:text-red-300 hover:border-red-800"
    >
      {isLoading ? "Cerrando sesión..." : <LogOut className="h-4 w-4" />}
    </Button>
  )
}
