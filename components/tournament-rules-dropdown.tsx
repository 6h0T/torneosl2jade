"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Rule {
  id: string
  text: string
}

interface RuleCategory {
  id: string
  title: string
  rules: Rule[]
}

interface TournamentRulesDropdownProps {
  rules: {
    id: number
    rule: string
  }[]
  rawText?: string
}

export default function TournamentRulesDropdown({ rules, rawText }: TournamentRulesDropdownProps) {
  const { t, translateContent } = useLanguage()
  const [categories, setCategories] = useState<RuleCategory[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (rawText) {
      // Procesar el texto crudo para extraer categorías y reglas
      const processedCategories = processRulesText(rawText)
      setCategories(processedCategories)
    } else if (rules && rules.length > 0) {
      // Si no hay texto crudo pero hay reglas en formato de base de datos
      // Convertir las reglas de la base de datos a nuestro formato de categorías
      const defaultCategory: RuleCategory = {
        id: "general",
        title: "Reglas Generales",
        rules: rules.map((rule) => ({
          id: `rule-${rule.id}`,
          text: rule.rule,
        })),
      }
      setCategories([defaultCategory])
    }
  }, [rules, rawText])

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="pt-4 border-t border-forest-800/30">
        <h3 className="text-sm font-medium mb-3 text-forest-400">{t("rules")}</h3>
        <p className="text-amber-400 text-sm italic">{t("noRules")}</p>
      </div>
    )
  }

  return (
    <div className="pt-4 border-t border-forest-800/30">
      <h3 className="text-sm font-medium mb-3 text-forest-400 flex items-center">
        <Shield className="mr-2 h-4 w-4 text-forest-400" />
        {t("rules")}
      </h3>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="border border-forest-800/30 rounded-md overflow-hidden">
            <div
              className={`flex justify-between items-center p-3 cursor-pointer ${
                expandedCategory === category.id ? "bg-forest-900/30" : "bg-black/50"
              }`}
              onClick={() => toggleCategory(category.id)}
            >
              <h4 className="text-sm font-medium text-forest-300">{translateContent(category.title)}</h4>
              {expandedCategory === category.id ? (
                <ChevronUp className="h-4 w-4 text-forest-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-forest-400" />
              )}
            </div>

            {expandedCategory === category.id && (
              <div className="p-3 bg-black/30 border-t border-forest-800/20">
                <ul className="space-y-2 text-sm text-gray-300 pl-4 list-disc">
                  {category.rules.map((rule) => (
                    <li key={rule.id}>{translateContent(rule.text)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Función para procesar el texto de reglas y extraer categorías y reglas
function processRulesText(text: string): RuleCategory[] {
  // Dividir el texto por líneas o por puntos específicos
  const lines = text.split(/\n|(?<=\.)\s+/g).filter((line) => line.trim().length > 0)

  const categories: RuleCategory[] = []
  let currentCategory: RuleCategory | null = null

  // Expresiones regulares para detectar categorías
  const categoryRegex = /^(⚔️\s*)?([^:]+):/

  lines.forEach((line, index) => {
    line = line.trim()

    // Verificar si la línea es un título de categoría
    const categoryMatch = line.match(categoryRegex)

    if (categoryMatch) {
      // Es un título de categoría
      const categoryTitle = categoryMatch[2].trim()
      currentCategory = {
        id: `category-${index}`,
        title: categoryTitle,
        rules: [],
      }
      categories.push(currentCategory)

      // Extraer la primera regla si hay contenido después de los dos puntos
      const firstRule = line.substring(categoryMatch[0].length).trim()
      if (firstRule) {
        currentCategory.rules.push({
          id: `rule-${index}-0`,
          text: firstRule,
        })
      }
    } else if (currentCategory) {
      // Es una regla dentro de la categoría actual
      currentCategory.rules.push({
        id: `rule-${index}`,
        text: line,
      })
    } else {
      // Si no hay categoría actual, crear una categoría general
      currentCategory = {
        id: "general",
        title: "Reglas Generales",
        rules: [
          {
            id: `rule-${index}`,
            text: line,
          },
        ],
      }
      categories.push(currentCategory)
    }
  })

  return categories
}
