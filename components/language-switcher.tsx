"use client"

import { useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import type { Locale } from "@/i18n/translations"

export default function LanguageSwitcher() {
  const { locale, changeLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)

  const languages = [
    { code: "es", name: t("languageES") },
    { code: "en", name: t("languageEN") },
    { code: "pt", name: t("languagePT") },
  ]

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    if (["es", "en", "pt"].includes(languageCode)) {
      changeLocale(languageCode as Locale)
    }
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`text-xs ${locale === "es" ? "bg-forest-900/30 text-forest-400" : "bg-black/50 text-forest-200"} border-forest-800/50 hover:bg-forest-900/30 hover:text-forest-100`}
        >
          <Globe className="mr-1 h-3.5 w-3.5" />
          <span className="mr-1">{currentLanguage.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-jade-800/50">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center ${locale === language.code ? "text-forest-400" : "text-gray-300"} hover:text-forest-200 cursor-pointer`}
            onClick={() => handleLanguageChange(language.code)}
          >
            {locale === language.code && <Check className="mr-2 h-4 w-4" />}
            <span className={locale === language.code ? "ml-0" : "ml-6"}>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
