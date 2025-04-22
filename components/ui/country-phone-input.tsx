"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, Phone } from "lucide-react"
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

// Lista de países con códigos de país y códigos de marcación
const countries = [
  { name: "España", code: "es", dial: "+34" },
  { name: "Estados Unidos", code: "us", dial: "+1" },
  { name: "México", code: "mx", dial: "+52" },
  { name: "Argentina", code: "ar", dial: "+54" },
  { name: "Colombia", code: "co", dial: "+57" },
  { name: "Chile", code: "cl", dial: "+56" },
  { name: "Perú", code: "pe", dial: "+51" },
  { name: "Venezuela", code: "ve", dial: "+58" },
  { name: "Ecuador", code: "ec", dial: "+593" },
  { name: "Bolivia", code: "bo", dial: "+591" },
  { name: "Paraguay", code: "py", dial: "+595" },
  { name: "Uruguay", code: "uy", dial: "+598" },
  { name: "Brasil", code: "br", dial: "+55" },
  { name: "Francia", code: "fr", dial: "+33" },
  { name: "Alemania", code: "de", dial: "+49" },
  { name: "Italia", code: "it", dial: "+39" },
  { name: "Reino Unido", code: "gb", dial: "+44" },
  { name: "Portugal", code: "pt", dial: "+351" },
  { name: "Canadá", code: "ca", dial: "+1" },
].sort((a, b) => a.name.localeCompare(b.name));

interface CountryPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CountryPhoneInput({ value = "", onChange, className }: CountryPhoneInputProps) {
  // Dividir el valor en código de país y número
  const [countryCode, setCountryCode] = useState(() => {
    // Si el valor tiene un formato como "+34 123456789"
    if (value && value.includes(" ")) {
      const code = value.split(" ")[0];
      const country = countries.find(c => c.dial === code);
      return country ? country.code : "es"; // Default a España si no se encuentra
    }
    return "es"; // Default a España
  });
  
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (value && value.includes(" ")) {
      return value.split(" ")[1];
    }
    return value;
  });

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  const handleCountrySelect = (country: { code: string, dial: string }) => {
    setCountryCode(country.code);
    // Actualizar el valor completo cuando cambia el país
    onChange(`${country.dial} ${phoneNumber}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    // Actualizar el valor completo cuando cambia el número
    onChange(`${selectedCountry.dial} ${newPhone}`);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="phone" className="text-gray-300 flex items-center">
        <Phone className="h-4 w-4 mr-2" />
        Número de Teléfono
      </Label>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-auto lg:w-[120px] justify-between bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
            >
              <span className={`fi fi-${countryCode} mr-2`}></span>
              <span className="hidden lg:inline">{selectedCountry.dial}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-black border-gray-800">
            <Command>
              <CommandInput placeholder="Buscar país..." />
              <CommandEmpty>No se encontró ningún país.</CommandEmpty>
              <CommandList>
                <ScrollArea className="h-[200px]">
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => handleCountrySelect(country)}
                      >
                        <span className={`fi fi-${country.code} mr-2`}></span>
                        <span>{country.name}</span>
                        <span className="ml-2 text-gray-400">{country.dial}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            countryCode === country.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Ej: 123456789"
          className="flex-1 bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
        />
      </div>
    </div>
  );
} 