"use client"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"

export default function SimpleLanguageSwitcher() {
  const { locale, t } = useTranslations()

  // Función simple para cambiar el idioma usando window.location
  const handleLanguageChange = (newLocale: string) => {
    // Solo proceder si el idioma es diferente al actual
    if (newLocale !== locale) {
      // Obtener la ruta actual sin el idioma
      const path = window.location.pathname

      // Construir la nueva URL con el nuevo idioma
      const newPath = `/${newLocale}${path}`

      // Redirigir a la nueva URL
      window.location.href = newPath
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={`h-8 ${locale === "es" ? "bg-jade-900/30 text-jade-400" : "bg-black/50 text-jade-200"} border-jade-800/50 hover:bg-jade-900/30 hover:text-jade-100`}
        onClick={() => handleLanguageChange("es")}
      >
        ES
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`h-8 ${locale === "en" ? "bg-jade-900/30 text-jade-400" : "bg-black/50 text-jade-200"} border-jade-800/50 hover:bg-jade-900/30 hover:text-jade-100`}
        onClick={() => handleLanguageChange("en")}
      >
        EN
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`h-8 ${locale === "pt" ? "bg-jade-900/30 text-jade-400" : "bg-black/50 text-jade-200"} border-jade-800/50 hover:bg-jade-900/30 hover:text-jade-100`}
        onClick={() => handleLanguageChange("pt")}
      >
        PT
      </Button>
    </div>
  )
}
