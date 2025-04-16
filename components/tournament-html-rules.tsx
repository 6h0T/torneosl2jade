"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { translateHtmlContent } from "@/utils/html-translator"

interface TournamentHtmlRulesProps {
  htmlContent: string
}

export default function TournamentHtmlRules({ htmlContent }: TournamentHtmlRulesProps) {
  const { t, locale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [translatedContent, setTranslatedContent] = useState(htmlContent)

  // Traducir el contenido HTML cuando cambia el idioma o el contenido
  useEffect(() => {
    if (typeof window !== "undefined" && htmlContent) {
      const translated = translateHtmlContent(htmlContent, locale)
      setTranslatedContent(translated)
    }
  }, [htmlContent, locale])

  if (!htmlContent) {
    return (
      <div className="flex items-center text-sm">
        <Shield className="mr-2 h-4 w-4 text-jade-400" />
        <span className="text-amber-400 text-sm italic">{t("noRules")}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between cursor-pointer text-sm py-1" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-jade-400" />
          <span className="text-jade-400">{t("rules")}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-amber-400" /> : <ChevronDown className="h-4 w-4 text-amber-400" />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-6 text-sm">
              <div
                className="prose prose-invert prose-sm max-w-none prose-headings:text-forest-400 prose-headings:text-sm prose-headings:font-medium prose-headings:my-1 prose-p:text-gray-300 prose-p:my-1 prose-p:text-xs prose-li:text-gray-300 prose-li:text-xs prose-ul:my-1 prose-ol:my-1 prose-strong:text-forest-300"
                dangerouslySetInnerHTML={{ __html: translatedContent }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
