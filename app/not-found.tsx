"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useLanguage } from "@/contexts/language-context"

function NotFoundContent() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-jade-400 mb-6">404</h1>
      <h2 className="text-2xl font-medium text-white mb-4">{t("pageNotFound")}</h2>
      <p className="text-gray-300 mb-8">{t("pageNotFoundDesc")}</p>
      <Link
        href="/"
        className="inline-block bg-jade-600 hover:bg-jade-500 text-white py-2 px-6 rounded-md transition-colors"
      >
        {t("backToHome")}
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold text-jade-400 mb-6">404</h1>
          <p className="text-gray-300 mb-8">Página no encontrada</p>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  )
}
