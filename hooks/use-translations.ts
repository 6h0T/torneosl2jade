"use client"

import { useState, useEffect } from "react"
import { translations, type Locale, type TranslationKey } from "@/i18n/translations"

// Clave para almacenar el idioma en localStorage
const LANGUAGE_KEY = "lineage-tournament-language"

export function useTranslations() {
  // Inicializar con el idioma por defecto
  const [locale, setLocale] = useState<Locale>("es")

  // Efecto para cargar el idioma desde localStorage al montar el componente
  useEffect(() => {
    // Intentar obtener el idioma guardado
    const savedLocale = localStorage.getItem(LANGUAGE_KEY) as Locale | null

    // Si hay un idioma guardado y es válido, usarlo
    if (savedLocale && ["es", "en", "pt"].includes(savedLocale)) {
      setLocale(savedLocale)
    } else {
      // Si no hay idioma guardado, intentar detectar el idioma del navegador
      const browserLocale = navigator.language.split("-")[0]
      if (["es", "en", "pt"].includes(browserLocale)) {
        setLocale(browserLocale as Locale)
        localStorage.setItem(LANGUAGE_KEY, browserLocale)
      }
    }
  }, [])

  // Función para traducir textos
  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations.es[key] || key
  }

  // Función para cambiar el idioma
  const changeLocale = (newLocale: Locale) => {
    if (["es", "en", "pt"].includes(newLocale)) {
      setLocale(newLocale)
      localStorage.setItem(LANGUAGE_KEY, newLocale)
    }
  }

  return {
    t,
    locale,
    changeLocale,
  }
}
