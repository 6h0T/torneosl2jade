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

// Update the metadata object to change the title and include the new favicons
export const metadata = {
  title: "TORNEOS JADE - VIVI EL COMBATE",
  description: "Plataforma de torneos 3v3 para Lineage 2",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
    generator: 'v0.dev'
}

// Update the RootLayout component to conditionally render StreamsBox
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if Supabase environment variables are available
  const hasSupabaseEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <html lang="es" suppressHydrationWarning className={`${modernAntiqua.variable} ${inter.variable}`}>
      <body className={`${modernAntiqua.className} text-white min-h-screen flex flex-col hide-scrollbar`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <Preloader />
            {children}
            {/* Only render StreamsBox if Supabase environment variables are available */}
            {hasSupabaseEnv && <StreamsBox />}
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'