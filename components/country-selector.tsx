"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export interface Country {
  code: string
  name: string
  prefix: string
  example: string
  flag: string // Emoji flag
}

// Convert country code to emoji flag
function getFlagEmoji(countryCode: string): string {
  // For country codes, get the corresponding regional indicator symbols
  // Each letter is represented by a regional indicator symbol (🇦-🇿)
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
}

const countries: Country[] = [
  { code: "af", name: "Afganistán", prefix: "+93", example: "701234567", flag: getFlagEmoji("af") },
  { code: "al", name: "Albania", prefix: "+355", example: "661234567", flag: getFlagEmoji("al") },
  { code: "dz", name: "Argelia", prefix: "+213", example: "551234567", flag: getFlagEmoji("dz") },
  { code: "ad", name: "Andorra", prefix: "+376", example: "312345", flag: getFlagEmoji("ad") },
  { code: "ao", name: "Angola", prefix: "+244", example: "923456789", flag: getFlagEmoji("ao") },
  { code: "ar", name: "Argentina", prefix: "+54", example: "91123456789", flag: getFlagEmoji("ar") },
  { code: "au", name: "Australia", prefix: "+61", example: "412345678", flag: getFlagEmoji("au") },
  { code: "at", name: "Austria", prefix: "+43", example: "664123456", flag: getFlagEmoji("at") },
  { code: "be", name: "Bélgica", prefix: "+32", example: "470123456", flag: getFlagEmoji("be") },
  { code: "br", name: "Brasil", prefix: "+55", example: "11912345678", flag: getFlagEmoji("br") },
  { code: "ca", name: "Canadá", prefix: "+1", example: "4161234567", flag: getFlagEmoji("ca") },
  { code: "cl", name: "Chile", prefix: "+56", example: "912345678", flag: getFlagEmoji("cl") },
  { code: "cn", name: "China", prefix: "+86", example: "13123456789", flag: getFlagEmoji("cn") },
  { code: "co", name: "Colombia", prefix: "+57", example: "3101234567", flag: getFlagEmoji("co") },
  { code: "cr", name: "Costa Rica", prefix: "+506", example: "83123456", flag: getFlagEmoji("cr") },
  { code: "cu", name: "Cuba", prefix: "+53", example: "51234567", flag: getFlagEmoji("cu") },
  { code: "dk", name: "Dinamarca", prefix: "+45", example: "20123456", flag: getFlagEmoji("dk") },
  { code: "ec", name: "Ecuador", prefix: "+593", example: "991234567", flag: getFlagEmoji("ec") },
  { code: "eg", name: "Egipto", prefix: "+20", example: "1001234567", flag: getFlagEmoji("eg") },
  { code: "sv", name: "El Salvador", prefix: "+503", example: "71234567", flag: getFlagEmoji("sv") },
  { code: "es", name: "España", prefix: "+34", example: "612345678", flag: getFlagEmoji("es") },
  { code: "us", name: "Estados Unidos", prefix: "+1", example: "2025550123", flag: getFlagEmoji("us") },
  { code: "fr", name: "Francia", prefix: "+33", example: "612345678", flag: getFlagEmoji("fr") },
  { code: "gt", name: "Guatemala", prefix: "+502", example: "51234567", flag: getFlagEmoji("gt") },
  { code: "hn", name: "Honduras", prefix: "+504", example: "91234567", flag: getFlagEmoji("hn") },
  { code: "it", name: "Italia", prefix: "+39", example: "3123456789", flag: getFlagEmoji("it") },
  { code: "mx", name: "México", prefix: "+52", example: "5512345678", flag: getFlagEmoji("mx") },
  { code: "ni", name: "Nicaragua", prefix: "+505", example: "81234567", flag: getFlagEmoji("ni") },
  { code: "pa", name: "Panamá", prefix: "+507", example: "61234567", flag: getFlagEmoji("pa") },
  { code: "py", name: "Paraguay", prefix: "+595", example: "981234567", flag: getFlagEmoji("py") },
  { code: "pe", name: "Perú", prefix: "+51", example: "912345678", flag: getFlagEmoji("pe") },
  { code: "pt", name: "Portugal", prefix: "+351", example: "912345678", flag: getFlagEmoji("pt") },
  { code: "gb", name: "Reino Unido", prefix: "+44", example: "7123456789", flag: getFlagEmoji("gb") },
  { code: "ve", name: "Venezuela", prefix: "+58", example: "4121234567", flag: getFlagEmoji("ve") },
]

interface CountrySelectorProps {
  onSelect: (country: Country) => void
  selectedCountry?: Country
}

export function CountrySelector({ onSelect, selectedCountry }: CountrySelectorProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [selectedFlag, setSelectedFlag] = useState("")

  useEffect(() => {
    if (selectedCountry) {
      setValue(selectedCountry.prefix)
      setSelectedFlag(selectedCountry.flag)
    }
  }, [selectedCountry])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-black/50 border-forest-800/50 hover:bg-black/70 hover:border-forest-400 text-white"
        >
          {value ? (
            <div className="flex items-center">
              <span className="mr-2 text-base">{selectedFlag}</span>
              {value}
            </div>
          ) : (
            t("selectCountry")
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-black/90 border-forest-800/50">
        <Command className="bg-transparent">
          <CommandInput placeholder={t("searchCountry")} className="text-white" />
          <CommandList>
            <CommandEmpty className="text-white">{t("noCountryFound")}</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.prefix}`}
                  onSelect={() => {
                    setValue(country.prefix)
                    setSelectedFlag(country.flag)
                    onSelect(country)
                    setOpen(false)
                  }}
                  className={cn(
                    "text-white hover:bg-forest-900/50 focus:bg-forest-900/50 focus:text-forest-100 cursor-pointer",
                    value === country.prefix && "bg-forest-900/70",
                  )}
                >
                  <span className="mr-2 text-base">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-forest-400">{country.prefix}</span>
                  {value === country.prefix && <Check className="ml-2 h-4 w-4 text-forest-400" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { countries }
