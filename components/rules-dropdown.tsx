"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

interface RulesDropdownProps {
  title?: string
  children: React.ReactNode
  initialOpen?: boolean
  icon?: React.ReactNode
}

export default function RulesDropdown({
  title,
  children,
  initialOpen = false,
  icon = <Shield className="h-4 w-4 text-forest-400" />,
}: RulesDropdownProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const { t } = useLanguage()

  const dropdownTitle = title || t("rules")

  return (
    <div className="border border-forest-800/30 rounded-md overflow-hidden">
      <div
        className={`flex justify-between items-center p-3 cursor-pointer ${
          isOpen ? "bg-forest-900/30" : "bg-black/50"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium text-forest-300 flex items-center">
          {icon}
          <span className="ml-2">{dropdownTitle}</span>
        </h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-forest-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-forest-400" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 bg-black/30 border-t border-forest-800/20">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
