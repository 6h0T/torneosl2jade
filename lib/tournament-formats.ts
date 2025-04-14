// Descripción detallada de los formatos de torneo disponibles

export const tournamentFormats = {
  "3v3": {
    title: "3v3",
    description: "Formato clásico de combate entre equipos de 3 jugadores.",
    rules: [
      "Cada equipo está compuesto por 3 jugadores.",
      "Eliminación directa en todas las fases.",
      "Combates al mejor de 3 rondas.",
    ],
  },
  "5v5": {
    title: "5v5",
    description: "Formato de combate entre equipos de 5 jugadores.",
    rules: [
      "Cada equipo está compuesto por 5 jugadores.",
      "Eliminación directa en todas las fases.",
      "Combates al mejor de 3 rondas.",
    ],
  },
  "1v1": {
    title: "1v1",
    description: "Formato de duelo individual.",
    rules: ["Combates individuales.", "Eliminación directa en todas las fases.", "Combates al mejor de 3 rondas."],
  },
  "Suizo + Eliminación": {
    title: "Suizo + Eliminación Directa",
    description: "Formato combinado de Fase Suiza seguida de Eliminación Directa.",
    rules: [
      "Fase 1: Sistema Suizo (Swiss) - 4 rondas",
      "Cada equipo juega 4 combates contra diferentes equipos",
      "Los emparejamientos se hacen entre equipos con puntajes similares",
      "No hay eliminación en esta fase",
      "Los 16 mejores equipos pasan a la siguiente fase según total de victorias",
      "Fase 2: Eliminación Directa (Octavos, Cuartos, Semifinal y Final)",
      "Combates al mejor de 3 o 5 rondas",
    ],
    scoring: [
      "Ganar combate: 1 punto",
      "Perder: 0 puntos",
      "Se lleva registro de rondas ganadas/perdidas, oponentes enfrentados y tiempo total",
    ],
  },
}
