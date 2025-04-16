"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

interface Rule {
  id: string | number
  text: string
}

interface RuleCategory {
  id: string | number
  title: string
  rules: Rule[]
}

interface TournamentRulesDropdownProps {
  rules: {
    id: number
    rule: string
    category?: string
  }[]
  rawText?: string
}

export default function TournamentRulesDropdown({ rules, rawText }: TournamentRulesDropdownProps) {
  const { t, translateContent } = useLanguage()
  const [expandedCategory, setExpandedCategory] = useState<string | number | null>(null)
  const [categories, setCategories] = useState<RuleCategory[]>(() => {
    // Procesar las reglas para agruparlas por categoría
    if (rules && rules.length > 0) {
      const categoriesMap = new Map<string, RuleCategory>()

      rules.forEach((rule) => {
        const category = rule.category || "Reglas Generales"

        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, {
            id: category,
            title: category,
            rules: [],
          })
        }

        categoriesMap.get(category)!.rules.push({
          id: rule.id,
          text: rule.rule,
        })
      })

      return Array.from(categoriesMap.values())
    }

    return []
  })

  const toggleCategory = (categoryId: string | number) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center text-sm">
        <Shield className="mr-2 h-4 w-4 text-jade-400" />
        <span className="text-amber-400 text-sm italic">{t("noRules")}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center justify-between cursor-pointer text-sm py-1"
        onClick={() => toggleCategory(categories[0].id)}
      >
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-jade-400" />
          <span className="text-jade-400">{t("rules")}</span>
        </div>
        {expandedCategory === categories[0].id ? (
          <ChevronUp className="h-4 w-4 text-amber-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-amber-400" />
        )}
      </div>

      <AnimatePresence>
        {expandedCategory === categories[0].id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-6 text-sm">
              <ul className="space-y-1 text-xs text-gray-300">
                {categories[0].rules.map((rule) => (
                  <li key={rule.id}>{translateContent(rule.text)}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
