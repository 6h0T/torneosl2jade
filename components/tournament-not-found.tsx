"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function TournamentNotFound() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-forest-400 mb-4">{t("tournamentNotFound")}</h1>
      <p className="text-gray-300 mb-6">{t("tournamentNotFoundDesc")}</p>
      <Link href="/" className="text-forest-400 hover:underline">
        {t("backToMain")}
      </Link>
    </div>
  )
}
