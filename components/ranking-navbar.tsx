"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

export default function RankingNavbar() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="border-b border-jade-800/30 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 relative">
              <Image
                src="/images/lineage-logo.png"
                alt="Lineage II"
                width={150}
                height={40}
                className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </div>
            <span className="text-xs text-jade-400 tracking-widest font-medium font-decorative uppercase-text">
              {t("ranking")}
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/">
              <Button
                variant="outline"
                className="border-jade-600 text-jade-400 hover:bg-jade-900/50 hover:text-jade-100 hover:border-jade-400 shadow-[0_0_10px_rgba(0,255,170,0.1)] whitespace-nowrap"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
