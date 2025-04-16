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
  title: "Comunidad Jade - Torneos",
  description: "Plataforma de torneos de la Comunidad Jade",
  icons: {
    icon: [
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon.ico', sizes: '48x48' }
    ],
    apple: '/images/apple-touch-icon.png',
    shortcut: '/images/favicon.ico'
  },
  manifest: '/images/site.webmanifest',
  generator: 'Comunidad Jade',
  viewport: {
    width: 'device-width',
    initialScale: 1
  },
  themeColor: '#10B981'
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