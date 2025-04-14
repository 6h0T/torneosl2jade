"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import EditTeamDialog from "./edit-team-dialog"
import type { Team, TeamMember } from "@/lib/types"

interface TeamEditButtonProps {
  team: Team
  members: TeamMember[]
  tournamentId: number
}

export default function TeamEditButton({ team, members, tournamentId }: TeamEditButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="h-6 w-6 text-amber-500 border-amber-500 hover:bg-amber-900/20"
        onClick={() => setIsDialogOpen(true)}
      >
        <Edit className="h-3 w-3" />
      </Button>

      <EditTeamDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        team={team}
        members={members}
        tournamentId={tournamentId}
      />
    </>
  )
}
