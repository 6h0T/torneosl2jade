"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"

interface TournamentHtmlRulesProps {
  htmlContent: string
}

export default function TournamentHtmlRules({ htmlContent }: TournamentHtmlRulesProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (!htmlContent) {
    return (
      <div className="pt-4 border-t border-forest-800/30">
        <h3 className="text-sm font-medium mb-3 text-forest-400 flex items-center">
          <Shield className="mr-2 h-4 w-4 text-forest-400" />
          {t("rules")}
        </h3>
        <p className="text-amber-400 text-sm italic">{t("noRules")}</p>
      </div>
    )
  }

  return (
    <div className="pt-4 border-t border-forest-800/30">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-sm font-medium text-forest-400 flex items-center">
          <Shield className="mr-2 h-4 w-4 text-forest-400" />
          {t("rules")}
        </h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-forest-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-forest-400" />
        )}
      </div>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 bg-black/30 border border-forest-800/20 rounded-md p-4"
        >
          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </motion.div>
      )}
    </div>
  )
}
