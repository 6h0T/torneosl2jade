import type React from "react"
import Link from "next/link"
import { Space_Grotesk } from "next/font/google"
import LogoutButton from "@/components/admin/logout-button"
import CopyrightFooter from "@/components/copyright-footer"

// Importar la fuente Space Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className={`min-h-screen flex flex-col hide-scrollbar ${spaceGrotesk.variable} font-sans`}
      style={{
        backgroundImage: "url(/background-detail.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="border-b border-jade-800/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-jade-400">Comunidad Jade</span>
              <span className="text-xs text-jade-400 tracking-widest font-medium">ADMIN</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-jade-400 transition-colors">
                Ver sitio
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow font-sans">{children}</main>
      <CopyrightFooter />
    </div>
  )
}
