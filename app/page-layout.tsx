"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className="min-h-screen flex flex-col hide-scrollbar overflow-hidden"
      style={{
        backgroundImage: "url(/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}
