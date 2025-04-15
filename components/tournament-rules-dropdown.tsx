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
  // Split the text into sections by double newlines or other clear section separators
  const sections = text.split(/\n\s*\n|\r\n\s*\r\n/).filter((section) => section.trim().length > 0)

  const categories: RuleCategory[] = []
  let currentCategory: RuleCategory | null = null

  // If no clear sections, try to process the entire text
  if (sections.length === 0) {
    sections.push(text)
  }

  // Process each section
  sections.forEach((section, sectionIndex) => {
    // Split the section into lines
    const lines = section.split(/\n|\r\n/).filter((line) => line.trim().length > 0)

    // Check if the first line looks like a category header
    const firstLine = lines[0]?.trim()
    const categoryMatch = firstLine?.match(/^(⚔️\s*)?([^:]+):/)

    if (categoryMatch) {
      // Create a new category
      const categoryTitle = categoryMatch[2].trim()
      currentCategory = {
        id: `category-${sectionIndex}`,
        title: categoryTitle,
        rules: [],
      }
      categories.push(currentCategory)

      // Process the rest of the first line if it contains a rule
      const firstRule = firstLine.substring(categoryMatch[0].length).trim()
      if (firstRule) {
        currentCategory.rules.push({
          id: `rule-${sectionIndex}-0`,
          text: firstRule,
        })
      }

      // Process the remaining lines as rules in this category
      lines.slice(1).forEach((line, lineIndex) => {
        if (line.trim()) {
          currentCategory!.rules.push({
            id: `rule-${sectionIndex}-${lineIndex + 1}`,
            text: line.trim(),
          })
        }
      })
    } else {
      // If no category is found in the first line, check if we're continuing a previous category
      if (!currentCategory) {
        // Create a default category if none exists
        currentCategory = {
          id: `category-default`,
          title: "Reglas Generales",
          rules: [],
        }
        categories.push(currentCategory)
      }

      // Add all lines as rules to the current category
      lines.forEach((line, lineIndex) => {
        if (line.trim()) {
          currentCategory!.rules.push({
            id: `rule-${sectionIndex}-${lineIndex}`,
            text: line.trim(),
          })
        }
      })
    }
  })

  // Special handling for the specific format in the example
  // Look for patterns like "Restricciones de Equipo:" within rules text
  if (categories.length === 1 && categories[0].title === "Reglas Generales") {
    const rules = categories[0].rules
    const newCategories: RuleCategory[] = []
    let currentCat: RuleCategory | null = null

    rules.forEach((rule, index) => {
      const catMatch = rule.text.match(/^(⚔️\s*)?([^:]+):/)

      if (catMatch) {
        // This rule is actually a category header
        const catTitle = catMatch[2].trim()
        currentCat = {
          id: `detected-category-${index}`,
          title: catTitle,
          rules: [],
        }
        newCategories.push(currentCat)

        // Check if there's rule text after the category
        const ruleText = rule.text.substring(catMatch[0].length).trim()
        if (ruleText) {
          currentCat.rules.push({
            id: `detected-rule-${index}-0`,
            text: ruleText,
          })
        }
      } else if (currentCat) {
        // Add to current category
        currentCat.rules.push({
          id: `detected-rule-${index}`,
          text: rule.text,
        })
      } else {
        // Create default category if needed
        if (newCategories.length === 0) {
          currentCat = {
            id: "default-category",
            title: "Reglas Generales",
            rules: [],
          }
          newCategories.push(currentCat)
        }

        // Add to first category
        newCategories[0].rules.push({
          id: `detected-rule-${index}`,
          text: rule.text,
        })
      }
    })

    // If we found categories this way, use them instead
    if (newCategories.length > 1 || (newCategories.length === 1 && newCategories[0].rules.length > 0)) {
      return newCategories
    }
  }

  return categories
}
