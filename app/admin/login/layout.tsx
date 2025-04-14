import type React from "react"
import { Space_Grotesk } from "next/font/google"
import CopyrightFooter from "@/components/copyright-footer"

// Importar la fuente Space Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})

export default function LoginLayout({
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
      <main className="flex-grow font-sans">{children}</main>
      <CopyrightFooter />
    </div>
  )
}
