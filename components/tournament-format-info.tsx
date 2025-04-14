"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { tournamentFormats } from "@/lib/tournament-formats"

interface TournamentFormatInfoProps {
  format: string
}

export default function TournamentFormatInfo({ format }: TournamentFormatInfoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t, translateContent } = useLanguage()

  // Normalizar el formato para buscar en el objeto tournamentFormats
  const normalizedFormat = format.toLowerCase().trim()

  // Función para obtener la información del formato
  const getFormatInfo = () => {
    // Verificar si tournamentFormats es un objeto
    if (!tournamentFormats || typeof tournamentFormats !== "object") {
      return null
    }

    // Buscar coincidencia directa
    for (const key in tournamentFormats) {
      if (key.toLowerCase() === normalizedFormat) {
        return tournamentFormats[key]
      }
    }

    // Buscar coincidencia parcial
    for (const key in tournamentFormats) {
      if (normalizedFormat.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedFormat)) {
        return tournamentFormats[key]
      }
    }

    return null
  }

  const formatInfo = getFormatInfo()

  // Si no hay información para este formato, no mostrar el componente
  if (!formatInfo) return null

  return (
    <div className="mt-1 mb-2">
      <div className="flex items-center justify-between cursor-pointer text-xs" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          <Info className="mr-1 h-3 w-3 text-amber-400" />
          <span className="text-amber-300 capitalize">{translateContent(formatInfo.title)}</span>
        </div>
        {isOpen ? <ChevronUp className="h-3 w-3 text-amber-400" /> : <ChevronDown className="h-3 w-3 text-amber-400" />}
      </div>

      {isOpen && (
        <div className="mt-2 pl-4 text-sm text-gray-400 leading-relaxed">
          <p>{translateContent(formatInfo.description)}</p>
          {formatInfo.rules && (
            <ul className="mt-2 list-disc pl-4 space-y-1">
              {formatInfo.rules.map((rule: string, index: number) => (
                <li key={index}>{translateContent(rule)}</li>
              ))}
            </ul>
          )}
          {formatInfo.scoring && (
            <>
              <p className="mt-1 font-medium">{translateContent("Sistema de puntuación:")}</p>
              <ul className="list-disc pl-4">
                {formatInfo.scoring.map((item: string, index: number) => (
                  <li key={`scoring-${index}`}>{translateContent(item)}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
