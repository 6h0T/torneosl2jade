"use client"

import { useLanguage } from "@/contexts/language-context"

interface TournamentRulesInfoProps {
  rules: {
    id: number
    rule: string
  }[]
}

export default function TournamentRulesInfo({ rules }: TournamentRulesInfoProps) {
  const { t, translateContent } = useLanguage()

  return (
    <div className="pt-4 border-t border-jade-800/30">
      <h3 className="text-sm font-medium mb-3 text-jade-400 drop-shadow-[0_0_5px_rgba(0,255,170,0.5)]">{t("rules")}</h3>

      {rules.length > 0 ? (
        <ul className="text-sm text-gray-300 space-y-2 pl-4 list-disc leading-relaxed">
          {rules.map((rule) => (
            <li key={rule.id}>{translateContent(rule.rule)}</li>
          ))}
        </ul>
      ) : (
        <p className="text-amber-400 text-sm italic">{t("noRules")}</p>
      )}
    </div>
  )
}
