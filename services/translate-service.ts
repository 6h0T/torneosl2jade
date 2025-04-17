"use client"

import type { Locale } from "@/i18n/translations"

// Diccionario de traducciones para contenido dinámico
// Esto simula una base de datos de traducciones o un servicio de traducción
const dynamicTranslations: Record<string, Record<Locale, string>> = {
  // Traducciones para títulos de torneos
  "GRAN TORNEO 3V3 OTOÑO": {
    es: "GRAN TORNEO 3V3 OTOÑO",
    en: "GREAT 3V3 AUTUMN TOURNAMENT",
    pt: "GRANDE TORNEIO 3V3 OUTONO",
  },
  "Torneo Mensual": {
    es: "Torneo Mensual",
    en: "Monthly Tournament",
    pt: "Torneio Mensal",
  },
  "Copa Lineage": {
    es: "Copa Lineage",
    en: "Lineage Cup",
    pt: "Copa Lineage",
  },

  // Traducciones para descripciones de torneos
  "El torneo más esperado de la temporada. ¡Inscríbete ahora y demuestra tu valía en el campo de batalla! Inscripciones hasta el 30 de abril":
    {
      es: "El torneo más esperado de la temporada. ¡Inscríbete ahora y demuestra tu valía en el campo de batalla! Inscripciones hasta el 30 de abril",
      en: "The most anticipated tournament of the season. Register now and prove your worth on the battlefield! Registrations until April 30",
      pt: "O torneio mais esperado da temporada. Inscreva-se agora e prove seu valor no campo de batalha! Inscrições até 30 de abril",
    },
  "El torneo más esperado de la temporada. ¡Inscríbete ahora y demuestra tu valía en el campo de batalla!": {
    es: "El torneo más esperado de la temporada. ¡Inscríbete ahora y demuestra tu valía en el campo de batalla!",
    en: "The most anticipated tournament of the season. Register now and prove your worth on the battlefield!",
    pt: "O torneio mais esperado da temporada. Inscreva-se agora e prove seu valor no campo de batalha!",
  },
  "EL TORNEO MÁS ESPERADO DE LA TEMPORADA": {
    es: "EL TORNEO MÁS ESPERADO DE LA TEMPORADA",
    en: "THE MOST ANTICIPATED TOURNAMENT OF THE SEASON",
    pt: "O TORNEIO MAIS ESPERADO DA TEMPORADA",
  },
  "¡INSCRÍBETE AHORA Y DEMUESTRA TU VALÍA EN EL CAMPO DE BATALLA!": {
    es: "¡INSCRÍBETE AHORA Y DEMUESTRA TU VALÍA EN EL CAMPO DE BATALLA!",
    en: "REGISTER NOW AND PROVE YOUR WORTH ON THE BATTLEFIELD!",
    pt: "INSCREVA-SE AGORA E PROVE SEU VALOR NO CAMPO DE BATALHA!",
  },
  "Compite contra los mejores equipos": {
    es: "Compite contra los mejores equipos",
    en: "Compete against the best teams",
    pt: "Compita contra as melhores equipes",
  },
  "Demuestra tu habilidad en combate": {
    es: "Demuestra tu habilidad en combate",
    en: "Demonstrate your combat skill",
    pt: "Demonstre sua habilidade em combate",
  },

  // Modos de torneo
  PvP: {
    es: "PvP",
    en: "PvP",
    pt: "PvP",
  },
  "Clan vs Clan": {
    es: "Clan vs Clan",
    en: "Clan vs Clan",
    pt: "Clan vs Clan",
  },
  Conquest: {
    es: "Conquest",
    en: "Conquest",
    pt: "Conquista",
  },

  // Formatos
  "3v3": {
    es: "3v3",
    en: "3v3",
    pt: "3v3",
  },
  "5v5": {
    es: "5v5",
    en: "5v5",
    pt: "5v5",
  },
  "1v1": {
    es: "1v1",
    en: "1v1",
    pt: "1v1",
  },
  "Eliminación simple": {
    es: "Eliminación simple",
    en: "Single elimination",
    pt: "Eliminação simples",
  },
  "Eliminación doble": {
    es: "Eliminación doble",
    en: "Double elimination",
    pt: "Eliminação dupla",
  },
  "Round Robin": {
    es: "Round Robin",
    en: "Round Robin",
    pt: "Round Robin",
  },
  "Suizo + Eliminación": {
    es: "Suizo + Eliminación",
    en: "Swiss + Elimination",
    pt: "Suíço + Eliminação",
  },
  "Suizo + Eliminación Directa": {
    es: "Suizo + Eliminación Directa",
    en: "Swiss + Direct Elimination",
    pt: "Suíço + Eliminação Direta",
  },
  "Formato combinado de Fase Suiza seguida de Eliminación Directa.": {
    es: "Formato combinado de Fase Suiza seguida de Eliminación Directa.",
    en: "Combined format of Swiss Phase followed by Direct Elimination.",
    pt: "Formato combinado de Fase Suíça seguida de Eliminação Direta.",
  },

  // Premios
  "1er Lugar": {
    es: "1er Lugar",
    en: "1st Place",
    pt: "1º Lugar",
  },
  "2do Lugar": {
    es: "2do Lugar",
    en: "2nd Place",
    pt: "2º Lugar",
  },
  "3er Lugar": {
    es: "3er Lugar",
    en: "3rd Place",
    pt: "3º Lugar",
  },
  "500 USD": {
    es: "500 USD",
    en: "500 USD",
    pt: "500 USD",
  },
  "300 USD": {
    es: "300 USD",
    en: "300 USD",
    pt: "300 USD",
  },
  "200 USD": {
    es: "200 USD",
    en: "200 USD",
    pt: "200 USD",
  },
  "10,000 Adena + Arma de Grado S": {
    es: "10,000 Adena + Arma de Grado S",
    en: "10,000 Adena + S-Grade Weapon",
    pt: "10.000 Adena + Arma de Grau S",
  },
  "5,000 Adena + Armadura de Grado A": {
    es: "5,000 Adena + Armadura de Grado A",
    en: "5,000 Adena + A-Grade Armor",
    pt: "5.000 Adena + Armadura de Grau A",
  },
  "2,500 Adena + Accesorios de Grado B": {
    es: "2,500 Adena + Accesorios de Grado B",
    en: "2,500 Adena + B-Grade Accessories",
    pt: "2.500 Adena + Acessórios de Grau B",
  },

  // Reglas específicas del torneo
  "Full Grado S +6": {
    es: "Full Grado S +6",
    en: "Full S Grade +6",
    pt: "Full Grau S +6",
  },
  "Sin tatto / Spirit": {
    es: "Sin tatto / Spirit",
    en: "No tattoo / Spirit",
    pt: "Sem tattoo / Spirit",
  },
  "Quedan deshabilitadas Skills con enchant, así como skills de evolución, de héroe y de clan": {
    es: "Quedan deshabilitadas Skills con enchant, así como skills de evolución, de héroe y de clan",
    en: "Skills with enchant are disabled, as well as evolution, hero and clan skills",
    pt: "Habilidades com encantamento estão desativadas, assim como habilidades de evolução, de herói e de clã",
  },
  "Sin corpiño": {
    es: "Sin corpiño",
    en: "No bodice",
    pt: "Sem corpete",
  },
  "Sin argumentos": {
    es: "Sin argumentos",
    en: "No arguments",
    pt: "Sem argumentos",
  },
  "Sin épicas – Solo se permiten joyas grado S (Tateossian)": {
    es: "Sin épicas – Solo se permiten joyas grado S (Tateossian)",
    en: "No epics – Only S grade jewels allowed (Tateossian)",
    pt: "Sem épicas – Apenas joias de grau S permitidas (Tateossian)",
  },
  "No se permiten 2 jugadores con clase Heal en el mismo equipo.": {
    es: "No se permiten 2 jugadores con clase Heal en el mismo equipo.",
    en: "2 players with Heal class are not allowed in the same team.",
    pt: "Não são permitidos 2 jogadores com classe Heal na mesma equipe.",
  },
  "No se permiten 3 magos en el mismo equipo.": {
    es: "No se permiten 3 magos en el mismo equipo.",
    en: "3 mages are not allowed in the same team.",
    pt: "Não são permitidos 3 magos na mesma equipe.",
  },
  "No se permiten 3 warriors en el mismo equipo.": {
    es: "No se permiten 3 warriors en el mismo equipo.",
    en: "3 warriors are not allowed in the same team.",
    pt: "Não são permitidos 3 guerreiros na mesma equipe.",
  },

  // Reglas generales
  "Cada equipo está compuesto por 3 jugadores.": {
    es: "Cada equipo está compuesto por 3 jugadores.",
    en: "Each team consists of 3 players.",
    pt: "Cada equipe é composta por 3 jogadores.",
  },
  "Eliminación directa en todas las fases.": {
    es: "Eliminación directa en todas las fases.",
    en: "Direct elimination in all phases.",
    pt: "Eliminação direta em todas as fases.",
  },
  "Combates al mejor de 3 rondas.": {
    es: "Combates al mejor de 3 rondas.",
    en: "Best of 3 rounds matches.",
    pt: "Partidas ao melhor de 3 rodadas.",
  },
  "Fase 1: Sistema Suizo (Swiss) - 4 rondas": {
    es: "Fase 1: Sistema Suizo (Swiss) - 4 rondas",
    en: "Phase 1: Swiss System - 4 rounds",
    pt: "Fase 1: Sistema Suíço - 4 rodadas",
  },
  "Cada equipo juega 4 combates contra diferentes equipos": {
    es: "Cada equipo juega 4 combates contra diferentes equipos",
    en: "Each team plays 4 matches against different teams",
    pt: "Cada equipe joga 4 partidas contra equipes diferentes",
  },
  "Los emparejamientos se hacen entre equipos con puntajes similares": {
    es: "Los emparejamientos se hacen entre equipos con puntajes similares",
    en: "Pairings are made between teams with similar scores",
    pt: "Os emparelhamentos são feitos entre equipes com pontuações semelhantes",
  },
  "No hay eliminación en esta fase": {
    es: "No hay eliminación en esta fase",
    en: "There is no elimination in this phase",
    pt: "Não há eliminação nesta fase",
  },
  "Los 16 mejores equipos pasan a la siguiente fase según total de victorias": {
    es: "Los 16 mejores equipos pasan a la siguiente fase según total de victorias",
    en: "The top 16 teams advance to the next phase based on total victories",
    pt: "As 16 melhores equipes avançam para a próxima fase com base no total de vitórias",
  },
  "Fase 2: Eliminación Directa (Octavos, Cuartos, Semifinal y Final)": {
    es: "Fase 2: Eliminación Directa (Octavos, Cuartos, Semifinal y Final)",
    en: "Phase 2: Direct Elimination (Round of 16, Quarter-finals, Semi-finals and Final)",
    pt: "Fase 2: Eliminação Direta (Oitavas, Quartas, Semifinal e Final)",
  },
  "Combates al mejor de 3 o 5 rondas": {
    es: "Combates al mejor de 3 o 5 rondas",
    en: "Best of 3 or 5 rounds matches",
    pt: "Partidas ao melhor de 3 ou 5 rodadas",
  },

  // Fechas (ejemplos)
  "15-30 Abril 2025": {
    es: "15-30 Abril 2025",
    en: "April 15-30, 2025",
    pt: "15-30 de Abril de 2025",
  },
  "1-15 Mayo 2025": {
    es: "1-15 Mayo 2025",
    en: "May 1-15, 2025",
    pt: "1-15 de Maio de 2025",
  },
  "Inscripciones hasta el 30 de abril": {
    es: "Inscripciones hasta el 30 de abril",
    en: "Registrations until April 30",
    pt: "Inscrições até 30 de abril",
  },

  // Traducciones para reglas HTML
  "Reglas del Torneo": {
    es: "Reglas del Torneo",
    en: "Tournament Rules",
    pt: "Regras do Torneio",
  },
  "Bienvenido al torneo de Lineage 2. A continuación se detallan las reglas que todos los participantes deben seguir:":
    {
      es: "Bienvenido al torneo de Lineage 2. A continuación se detallan las reglas que todos los participantes deben seguir:",
      en: "Welcome to the Lineage 2 tournament. Below are the rules that all participants must follow:",
      pt: "Bem-vindo ao torneio de Lineage 2. Abaixo estão as regras que todos os participantes devem seguir:",
    },
  "Restricciones de Equipo": {
    es: "Restricciones de Equipo",
    en: "Equipment Restrictions",
    pt: "Restrições de Equipamento",
  },
  "Solo se podrá utilizar equipo de grado S +3.": {
    es: "Solo se podrá utilizar equipo de grado S +3.",
    en: "Only S-grade +3 equipment can be used.",
    pt: "Apenas equipamento de grau S +3 pode ser usado.",
  },
  "No se permite el uso de joyería épica.": {
    es: "No se permite el uso de joyería épica.",
    en: "Epic jewelry is not allowed.",
    pt: "Joias épicas não são permitidas.",
  },
  "No se puede usar argumento.": {
    es: "No se puede usar argumento.",
    en: "Arguments cannot be used.",
    pt: "Argumentos não podem ser usados.",
  },
  "Tattoos, Spirit y Corpiños están prohibidos.": {
    es: "Tattoos, Spirit y Corpiños están prohibidos.",
    en: "Tattoos, Spirit and Bodices are prohibited.",
    pt: "Tatuagens, Spirit e Corpetes são proibidos.",
  },
  "Composición de Equipos": {
    es: "Composición de Equipos",
    en: "Team Composition",
    pt: "Composição de Equipes",
  },
  "Solo una clase con habilidades curativas por equipo.": {
    es: "Solo una clase con habilidades curativas por equipo.",
    en: "Only one class with healing abilities per team.",
    pt: "Apenas uma classe com habilidades de cura por equipe.",
  },
  "No se permite tener 3 Warriors o 3 Magos en una misma party.": {
    es: "No se permite tener 3 Warriors o 3 Magos en una misma party.",
    en: "Having 3 Warriors or 3 Mages in the same party is not allowed.",
    pt: "Não é permitido ter 3 Warriors ou 3 Magos na mesma party.",
  },
  "Es obligatorio tener al menos un Warrior o un Mago en la composición del equipo.": {
    es: "Es obligatorio tener al menos un Warrior o un Mago en la composición del equipo.",
    en: "It is mandatory to have at least one Warrior or one Mage in the team composition.",
    pt: "É obrigatório ter pelo menos um Warrior ou um Mago na composição da equipe.",
  },
  "Regla de Resurrección": {
    es: "Regla de Resurrección",
    en: "Resurrection Rule",
    pt: "Regra de Ressurreição",
  },
  "Está totalmente prohibido": {
    es: "Está totalmente prohibido",
    en: "It is strictly forbidden",
    pt: "É estritamente proibido",
  },
  "dar resurrección durante el combate. El equipo que realice una resurrección será automáticamente descalificado.": {
    es: "dar resurrección durante el combate. El equipo que realice una resurrección será automáticamente descalificado.",
    en: "to give resurrection during combat. The team that performs a resurrection will be automatically disqualified.",
    pt: "dar ressurreição durante o combate. A equipe que realizar uma ressurreição será automaticamente desqualificada.",
  },
  "Uso de Pociones": {
    es: "Uso de Pociones",
    en: "Potion Usage",
    pt: "Uso de Poções",
  },
  "Se permite el uso ilimitado de pociones de MP y CP.": {
    es: "Se permite el uso ilimitado de pociones de MP y CP.",
    en: "Unlimited use of MP and CP potions is allowed.",
    pt: "É permitido o uso ilimitado de poções de MP e CP.",
  },
  "Las pociones de HP están limitadas a 10 por combate.": {
    es: "Las pociones de HP están limitadas a 10 por combate.",
    en: "HP potions are limited to 10 per combat.",
    pt: "As poções de HP estão limitadas a 10 por combate.",
  },
  "Condiciones del Área de Combate": {
    es: "Condiciones del Área de Combate",
    en: "Combat Area Conditions",
    pt: "Condições da Área de Combate",
  },
  "El área de combate neutraliza los efectos de:": {
    es: "El área de combate neutraliza los efectos de:",
    en: "The combat area neutralizes the effects of:",
    pt: "A área de combate neutraliza os efeitos de:",
  },
  Dolls: {
    es: "Dolls",
    en: "Dolls",
    pt: "Dolls",
  },
  "Skills evolutivos": {
    es: "Skills evolutivos",
    en: "Evolutionary skills",
    pt: "Habilidades evolutivas",
  },
  "Esto garantiza que todos los jugadores estén en igualdad de condiciones.": {
    es: "Esto garantiza que todos los jugadores estén en igualdad de condiciones.",
    en: "This ensures that all players are on equal footing.",
    pt: "Isso garante que todos os jogadores estejam em igualdade de condições.",
  },
  "Ejemplo: Si hay un Bishop, no puede haber un Elder en el mismo equipo.": {
    es: "Ejemplo: Si hay un Bishop, no puede haber un Elder en el mismo equipo.",
    en: "Example: If there is a Bishop, there cannot be an Elder in the same team.",
    pt: "Exemplo: Se houver um Bishop, não pode haver um Elder na mesma equipe.",
  },
  "No se podrá utilizar Skin.": {
    es: "No se podrá utilizar Skin.",
    en: "Skins cannot be used.",
    pt: "Skins não podem ser usadas.",
  },
  "dar resurrección durante el combate.": {
    es: "dar resurrección durante el combate.",
    en: "to give resurrection during combat.",
    pt: "dar ressurreição durante o combate.",
  },
  "El equipo que realice una resurrección será automáticamente descalificado.": {
    es: "El equipo que realice una resurrección será automáticamente descalificado.",
    en: "The team that performs a resurrection will be automatically disqualified.",
    pt: "A equipe que realizar uma ressurreição será automaticamente desqualificada.",
  },
  "Está totalmente prohibido dar resurrección durante el combate. El equipo que realice una resurrección será automáticamente descalificado.":
    {
      es: "Está totalmente prohibido dar resurrección durante el combate. El equipo que realice una resurrección será automáticamente descalificado.",
      en: "It is strictly forbidden to give resurrection during combat. The team that performs a resurrection will be automatically disqualified.",
      pt: "É estritamente proibido dar ressurreição durante o combate. A equipe que realizar uma ressurreição será automaticamente desqualificada.",
    },
}

/**
 * Traduce contenido dinámico según el idioma seleccionado
 * @param text El texto a traducir
 * @param locale El idioma al que traducir
 * @returns El texto traducido o el texto original si no hay traducción
 */
export function translateDynamicContent(text: string, locale: Locale): string {
  // Si el texto no existe o es undefined, devuelve una cadena vacía
  if (!text) return ""

  // Si el idioma es español, devolvemos el texto original
  // ya que es el idioma base de los datos
  if (locale === "es") return text

  // Normalizar el texto para la búsqueda (eliminar espacios extra, etc.)
  const normalizedText = text.trim()

  // Si tenemos una traducción específica para este texto, la usamos
  if (dynamicTranslations[normalizedText] && dynamicTranslations[normalizedText][locale]) {
    return dynamicTranslations[normalizedText][locale]
  }

  // Para fechas podemos usar un formato más específico por idioma
  if (normalizedText.match(/^\d{1,2}-\d{1,2}\s[A-Za-z]+\s\d{4}$/)) {
    // Es un formato de fecha, podríamos aplicar formateo específico del idioma
    // Pero por ahora lo dejamos igual
    return normalizedText
  }

  // Intenta traducir partes del texto
  // Esto es útil para textos largos que pueden contener frases conocidas
  let translatedText = normalizedText

  // Ordenar las claves por longitud (de mayor a menor) para traducir primero las frases más largas
  const sortedKeys = Object.keys(dynamicTranslations).sort((a, b) => b.length - a.length)

  for (const key of sortedKeys) {
    if (normalizedText.includes(key) && dynamicTranslations[key][locale]) {
      translatedText = translatedText.replace(new RegExp(key, "g"), dynamicTranslations[key][locale])
    }
  }

  // Si el texto traducido es diferente del original, hemos traducido algunas partes
  if (translatedText !== normalizedText) {
    return translatedText
  }

  // Si no hay traducción, devolvemos el texto original
  return text
}
