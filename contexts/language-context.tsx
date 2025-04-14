"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Locale, type TranslationKey } from "@/i18n/translations"
import { translateDynamicContent } from "@/services/translate-service"

// Define the context type
type LanguageContextType = {
  locale: Locale
  t: (key: TranslationKey) => string
  translateContent: (text: string) => string
  changeLocale: (newLocale: Locale) => void
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  t: (key) => key,
  translateContent: (text) => text,
  changeLocale: () => {},
})

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext)

// Language provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es")
  const [mounted, setMounted] = useState(false)

  // Initialize locale from localStorage when component mounts
  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem("lineage-tournament-language") as Locale | null

    if (savedLocale && ["es", "en", "pt"].includes(savedLocale)) {
      setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLocale = navigator.language.split("-")[0]
      if (["es", "en", "pt"].includes(browserLocale)) {
        setLocale(browserLocale as Locale)
        localStorage.setItem("lineage-tournament-language", browserLocale)
      }
    }
  }, [])

  // Translation function for static text
  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations.es[key] || key
  }

  // Translation function for dynamic content
  const translateContent = (text: string): string => {
    return translateDynamicContent(text, locale)
  }

  // Function to change locale
  const changeLocale = (newLocale: Locale) => {
    if (["es", "en", "pt"].includes(newLocale)) {
      setLocale(newLocale)
      localStorage.setItem("lineage-tournament-language", newLocale)
    }
  }

  // Provide a value object with the current locale, translation functions, and change function
  const value = {
    locale,
    t,
    translateContent,
    changeLocale,
  }

  // Don't render anything on the server
  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
