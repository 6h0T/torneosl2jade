import type React from "react"
import { Inter } from "next/font/google"
import { Modern_Antiqua } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Preloader from "@/components/preloader"
import StreamsBox from "@/components/streams-box"
import { LanguageProvider } from "@/contexts/language-context"
import { Analytics } from "./analytics"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const modernAntiqua = Modern_Antiqua({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-modern-antiqua",
})

export const metadata = {
  title: "Lineage 2 - Torneos 3v3",
  description: "Plataforma de torneos 3v3 para Lineage 2",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${modernAntiqua.variable} ${inter.variable}`}>
      <body className={`${modernAntiqua.className} text-white min-h-screen flex flex-col hide-scrollbar`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <Preloader />
            {children}
            <StreamsBox />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
