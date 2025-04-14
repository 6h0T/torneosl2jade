import type React from "react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"
// Importar el componente de footer
import CopyrightFooter from "@/components/copyright-footer"

export default function RegistrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Actualizar el return para incluir el footer
  return (
    <div
      className="min-h-screen flex flex-col hide-scrollbar"
      style={{
        backgroundImage: "url(/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar showRegisterButton={false} />
      <main className="flex-grow flex items-center justify-center w-full">
        <PageTransition>{children}</PageTransition>
      </main>
      <CopyrightFooter />
    </div>
  )
}
