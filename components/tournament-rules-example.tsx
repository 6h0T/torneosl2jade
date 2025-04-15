"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

interface RuleCategory {
  title: string
  rules: string[]
}

export default function TournamentRulesExample() {
  const { t } = useLanguage()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Parse the example text into categories and rules
  const rulesText = `⚔️ Reglas del Encuentro 3vs3 
Restricciones de Equipo: Solo se podrá utilizar equipo de grado S +3. No se permite el uso de joyería épica. No se puede usar argumento. Tattoos, Spirit y Corpiños están prohibidos. No se podrá utilizar Skin. 
Condiciones del Área de Combate: El área de combate neutraliza los efectos de: Dolls Skills evolutivos Esto garantiza que todos los jugadores estén en igualdad de condiciones. 
Composición de Equipos: Solo una clase con habilidades curativas por equipo. Ejemplo: Si hay un Bishop, no puede haber un Elder en el mismo equipo. No se permite tener 3 Warriors o 3 Magos en una misma party. Es obligatorio tener al menos un Warrior o un Mago en la composición del equipo. 
Regla de Resurrección: Está totalmente prohibido dar resurrección durante el combate. El equipo que realice una resurrección será automáticamente descalificado. 
Uso de Pociones: Se permite el uso ilimitado de pociones de MP y CP.`

  // Process the rules text
  const categories: RuleCategory[] = []
  let currentCategory: RuleCategory | null = null

  // Split by lines and process
  const lines = rulesText.split(/\n/).filter((line) => line.trim().length > 0)

  lines.forEach((line) => {
    // Check if this line contains a category
    const categoryMatch = line.match(/([^:]+):/g)

    if (categoryMatch && categoryMatch.length > 0) {
      // This line contains one or more categories
      let remainingLine = line

      categoryMatch.forEach((match) => {
        const categoryTitle = match.substring(0, match.length - 1).trim()
        const startIndex = remainingLine.indexOf(match)
        const endIndex = startIndex + match.length

        // Get text before this category (if any) and add to previous category
        if (startIndex > 0 && currentCategory) {
          const beforeText = remainingLine.substring(0, startIndex).trim()
          if (beforeText) {
            currentCategory.rules.push(beforeText)
          }
        }

        // Create new category
        currentCategory = {
          title: categoryTitle,
          rules: [],
        }
        categories.push(currentCategory)

        // Update remaining line to process
        remainingLine = remainingLine.substring(endIndex)
      })

      // Add any remaining text as a rule in the current category
      if (remainingLine.trim() && currentCategory) {
        currentCategory.rules.push(remainingLine.trim())
      }
    } else if (currentCategory) {
      // Add to current category
      currentCategory.rules.push(line.trim())
    } else {
      // Create default category
      currentCategory = {
        title: "Reglas Generales",
        rules: [line.trim()],
      }
      categories.push(currentCategory)
    }
  })

  // Process the rules to split sentences
  categories.forEach((category) => {
    const expandedRules: string[] = []

    category.rules.forEach((rule) => {
      // Split by periods that are followed by a space or end of string
      const sentences = rule.split(/\.(?=\s|$)/).filter((s) => s.trim().length > 0)
      expandedRules.push(...sentences.map((s) => s.trim()))
    })

    category.rules = expandedRules
  })

  return (
    <div className="pt-4 border-t border-forest-800/30">
      <h3 className="text-sm font-medium mb-3 text-forest-400 flex items-center">
        <Shield className="mr-2 h-4 w-4 text-forest-400" />
        {t("rules")}
      </h3>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={index} className="border border-forest-800/30 rounded-md overflow-hidden">
            <div
              className={`flex justify-between items-center p-3 cursor-pointer ${
                expandedCategory === category.title ? "bg-forest-900/30" : "bg-black/50"
              }`}
              onClick={() => setExpandedCategory(expandedCategory === category.title ? null : category.title)}
            >
              <h4 className="text-sm font-medium text-forest-300">{category.title}</h4>
              {expandedCategory === category.title ? (
                <ChevronUp className="h-4 w-4 text-forest-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-forest-400" />
              )}
            </div>

            <AnimatePresence>
              {expandedCategory === category.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 bg-black/30 border-t border-forest-800/20">
                    <ul className="space-y-2 text-sm text-gray-300 pl-4 list-disc">
                      {category.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
