// Tipos para torneos
export interface Tournament {
  id: number
  title: string
  description: string
  date_range: string
  status: "upcoming" | "active" | "completed"
  prize: string
  format: string
  mode: string
  max_participants: number
  featured: boolean
  registration_type?: "free" | "paid"
  created_at: string
  html_rules?: string // Nuevo campo para reglas HTML
}

export interface TournamentRule {
  id: number
  tournament_id: number
  rule: string
  category?: string
}

export interface TournamentPrize {
  id: number
  tournament_id: number
  position: string
  reward: string
  icon: string
  color: string
}

// Tipos para equipos
// Update the Team interface to match the actual database schema
// by making expelled_at and expulsion_reason optional

export interface Team {
  id: number
  name: string
  tournament_id: number
  status: "pending" | "approved" | "rejected" | "expelled"
  created_at: string
  approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  phone?: string // Add the phone field
}

export interface TeamMember {
  id: number
  team_id: number
  name: string
  character_class: string
  created_at: string
}

// Tipos para partidos
export interface Match {
  id: number
  tournament_id: number
  phase: "roundOf16" | "quarterFinals" | "semiFinals" | "final"
  match_order: number
  team1_id?: number
  team2_id?: number
  team1_score?: number
  team2_score?: number
  winner_id?: number
  match_date?: string
  match_time?: string
  status: "pending" | "in_progress" | "completed"
  created_at: string
  updated_at: string
  team1?: Team
  team2?: Team
  winner?: Team
}

// Add a new interface for team rankings
export interface TeamRanking {
  id: number
  team_id: number
  points: number
  wins: number
  losses: number
  tournaments_played: number
  last_updated: string
  team?: Team
}
