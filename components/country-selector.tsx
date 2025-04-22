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
}

// Ya no necesitamos la función getFlagEmoji, usaremos las clases CSS de flag-icons

const countries: Country[] = [
  { code: "af", name: "Afganistán", prefix: "+93", example: "701234567" },
  { code: "al", name: "Albania", prefix: "+355", example: "661234567" },
  { code: "dz", name: "Argelia", prefix: "+213", example: "551234567" },
  { code: "ad", name: "Andorra", prefix: "+376", example: "312345" },
  { code: "ao", name: "Angola", prefix: "+244", example: "923456789" },
  { code: "ar", name: "Argentina", prefix: "+54", example: "91123456789" },
  { code: "au", name: "Australia", prefix: "+61", example: "412345678" },
  { code: "at", name: "Austria", prefix: "+43", example: "664123456" },
  { code: "be", name: "Bélgica", prefix: "+32", example: "470123456" },
  { code: "br", name: "Brasil", prefix: "+55", example: "11912345678" },
  { code: "ca", name: "Canadá", prefix: "+1", example: "4161234567" },
  { code: "cl", name: "Chile", prefix: "+56", example: "912345678" },
  { code: "cn", name: "China", prefix: "+86", example: "13123456789" },
  { code: "co", name: "Colombia", prefix: "+57", example: "3101234567" },
  { code: "cr", name: "Costa Rica", prefix: "+506", example: "83123456" },
  { code: "cu", name: "Cuba", prefix: "+53", example: "51234567" },
  { code: "dk", name: "Dinamarca", prefix: "+45", example: "20123456" },
  { code: "ec", name: "Ecuador", prefix: "+593", example: "991234567" },
  { code: "eg", name: "Egipto", prefix: "+20", example: "1001234567" },
  { code: "sv", name: "El Salvador", prefix: "+503", example: "71234567" },
  { code: "es", name: "España", prefix: "+34", example: "612345678" },
  { code: "us", name: "Estados Unidos", prefix: "+1", example: "2025550123" },
  { code: "fr", name: "Francia", prefix: "+33", example: "612345678" },
  { code: "gt", name: "Guatemala", prefix: "+502", example: "51234567" },
  { code: "hn", name: "Honduras", prefix: "+504", example: "91234567" },
  { code: "it", name: "Italia", prefix: "+39", example: "3123456789" },
  { code: "mx", name: "México", prefix: "+52", example: "5512345678" },
  { code: "ni", name: "Nicaragua", prefix: "+505", example: "81234567" },
  { code: "pa", name: "Panamá", prefix: "+507", example: "61234567" },
  { code: "py", name: "Paraguay", prefix: "+595", example: "981234567" },
  { code: "pe", name: "Perú", prefix: "+51", example: "912345678" },
  { code: "pt", name: "Portugal", prefix: "+351", example: "912345678" },
  { code: "gb", name: "Reino Unido", prefix: "+44", example: "7123456789" },
  { code: "ve", name: "Venezuela", prefix: "+58", example: "4121234567" },
]

interface CountrySelectorProps {
  onSelect: (country: Country) => void
  selectedCountry?: Country
}

export function CountrySelector({ onSelect, selectedCountry }: CountrySelectorProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [selectedCode, setSelectedCode] = useState("es") // Código de país por defecto (España)

  useEffect(() => {
    if (selectedCountry) {
      setValue(selectedCountry.prefix)
      setSelectedCode(selectedCountry.code)
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
              <span className={`fi fi-${selectedCode} mr-2`}></span>
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
                    setSelectedCode(country.code)
                    onSelect(country)
                    setOpen(false)
                  }}
                  className={cn(
                    "text-white hover:bg-forest-900/50 focus:bg-forest-900/50 focus:text-forest-100 cursor-pointer",
                    value === country.prefix && "bg-forest-900/70",
                  )}
                >
                  <span className={`fi fi-${country.code} mr-2`}></span>
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
