"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, XCircle, AlertCircle, Phone } from "lucide-react"
import type { Team } from "@/lib/types"
import { approveTeam, rejectTeam } from "@/lib/supabase/admin-actions"

interface TeamManagementProps {
  teams: Team[]
  tournamentId: number
}

export default function TeamManagement({ teams, tournamentId }: TeamManagementProps) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Filtrar equipos por estado
  const pendingTeams = teams.filter((team) => team.status === "pending")
  const approvedTeams = teams.filter((team) => team.status === "approved")
  const rejectedTeams = teams.filter((team) => team.status === "rejected")
  const expelledTeams = teams.filter((team) => team.status === "expelled")

  return (
    <div className="space-y-6">
      {/* Mensaje de estado */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-jade-900/50 border border-jade-600" : "bg-red-900/30 border border-red-800"
          }`}
        >
          <div className="flex items-start">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-jade-400 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            )}
            <p className={message.type === "success" ? "text-jade-200" : "text-red-200"}>{message.text}</p>
          </div>
        </div>
      )}

      {/* Equipos pendientes */}
      <div>
        <h3 className="text-lg font-medium text-jade-400 mb-3">Equipos Pendientes ({pendingTeams.length})</h3>
        {pendingTeams.length === 0 ? (
          <p className="text-gray-400">No hay equipos pendientes de aprobación.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="border border-jade-800/30">
              <TableHeader className="bg-black/50">
                <TableRow>
                  <TableHead className="text-jade-300">ID</TableHead>
                  <TableHead className="text-jade-300">Nombre</TableHead>
                  <TableHead className="text-jade-300">Teléfono</TableHead>
                  <TableHead className="text-jade-300">Miembros</TableHead>
                  <TableHead className="text-jade-300">Fecha de registro</TableHead>
                  <TableHead className="text-jade-300">Estado</TableHead>
                  <TableHead className="text-jade-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTeams.map((team) => (
                  <TableRow key={team.id} className="border-b border-jade-800/20">
                    <TableCell>{team.id}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-jade-400 mr-1" />
                        {team.phone || "No disponible"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {team.members && team.members.length > 0
                        ? team.members.map((m) => m.name).join(", ")
                        : "Sin miembros"}
                    </TableCell>
                    <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-600">Pendiente</Badge>
                    </TableCell>
                    <TableCell>
                      <TeamActions team={team} tournamentId={tournamentId} setMessage={setMessage} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Equipos aprobados */}
      <div>
        <h3 className="text-lg font-medium text-jade-400 mb-3">Equipos Aprobados ({approvedTeams.length})</h3>
        {approvedTeams.length === 0 ? (
          <p className="text-gray-400">No hay equipos aprobados.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="border border-jade-800/30">
              <TableHeader className="bg-black/50">
                <TableRow>
                  <TableHead className="text-jade-300">ID</TableHead>
                  <TableHead className="text-jade-300">Nombre</TableHead>
                  <TableHead className="text-jade-300">Teléfono</TableHead>
                  <TableHead className="text-jade-300">Miembros</TableHead>
                  <TableHead className="text-jade-300">Fecha de registro</TableHead>
                  <TableHead className="text-jade-300">Fecha de aprobación</TableHead>
                  <TableHead className="text-jade-300">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedTeams.map((team) => (
                  <TableRow key={team.id} className="border-b border-jade-800/20">
                    <TableCell>{team.id}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-jade-400 mr-1" />
                        {team.phone || "No disponible"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {team.members && team.members.length > 0
                        ? team.members.map((m) => m.name).join(", ")
                        : "Sin miembros"}
                    </TableCell>
                    <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{team.approved_at ? new Date(team.approved_at).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell>
                      <Badge className="bg-jade-600">Aprobado</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Equipos rechazados */}
      {rejectedTeams.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-jade-400 mb-3">Equipos Rechazados ({rejectedTeams.length})</h3>
          <div className="overflow-x-auto">
            <Table className="border border-jade-800/30">
              <TableHeader className="bg-black/50">
                <TableRow>
                  <TableHead className="text-jade-300">ID</TableHead>
                  <TableHead className="text-jade-300">Nombre</TableHead>
                  <TableHead className="text-jade-300">Teléfono</TableHead>
                  <TableHead className="text-jade-300">Fecha de registro</TableHead>
                  <TableHead className="text-jade-300">Fecha de rechazo</TableHead>
                  <TableHead className="text-jade-300">Motivo</TableHead>
                  <TableHead className="text-jade-300">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedTeams.map((team) => (
                  <TableRow key={team.id} className="border-b border-jade-800/20">
                    <TableCell>{team.id}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-jade-400 mr-1" />
                        {team.phone || "No disponible"}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{team.rejected_at ? new Date(team.rejected_at).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">{team.rejection_reason || "No especificado"}</TableCell>
                    <TableCell>
                      <Badge className="bg-red-800">Rechazado</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Equipos expulsados */}
      {expelledTeams.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-jade-400 mb-3">Equipos Expulsados ({expelledTeams.length})</h3>
          <div className="overflow-x-auto">
            <Table className="border border-jade-800/30">
              <TableHeader className="bg-black/50">
                <TableRow>
                  <TableHead className="text-jade-300">ID</TableHead>
                  <TableHead className="text-jade-300">Nombre</TableHead>
                  <TableHead className="text-jade-300">Teléfono</TableHead>
                  <TableHead className="text-jade-300">Fecha de registro</TableHead>
                  <TableHead className="text-jade-300">Fecha de expulsión</TableHead>
                  <TableHead className="text-jade-300">Motivo</TableHead>
                  <TableHead className="text-jade-300">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expelledTeams.map((team) => (
                  <TableRow key={team.id} className="border-b border-jade-800/20">
                    <TableCell>{team.id}</TableCell>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-jade-400 mr-1" />
                        {team.phone || "No disponible"}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(team.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{team.rejected_at ? new Date(team.rejected_at).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {team.rejection_reason ? team.rejection_reason.replace("[Expulsado] ", "") : "No especificado"}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-600">Expulsado</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

interface TeamActionsProps {
  team: Team
  tournamentId: number
  setMessage: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>
}

const TeamActions = ({ team, tournamentId, setMessage }: TeamActionsProps) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApproveClick = () => {
    setIsApproveDialogOpen(true)
  }

  const handleRejectClick = () => {
    setRejectionReason("")
    setIsRejectDialogOpen(true)
  }

  const handleApproveConfirm = async () => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await approveTeam(team.id, tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setIsApproveDialogOpen(false)
        setMessage(null)
      }, 2000)
    }
  }

  const handleRejectConfirm = async () => {
    setIsSubmitting(true)
    setMessage(null)

    const result = await rejectTeam(team.id, rejectionReason, tournamentId)

    setIsSubmitting(false)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })

    if (result.success) {
      setTimeout(() => {
        setIsRejectDialogOpen(false)
        setMessage(null)
      }, 2000)
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="border-jade-600 text-jade-400 hover:bg-jade-900/50"
          onClick={handleApproveClick}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" /> Aprobar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-800 text-red-400 hover:bg-red-900/30"
          onClick={handleRejectClick}
        >
          <XCircle className="h-4 w-4 mr-1" /> Rechazar
        </Button>
      </div>

      {/* Diálogo de confirmación para aprobar equipo */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Aprobar Equipo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              ¿Estás seguro de que deseas aprobar el equipo <span className="font-bold">{team?.name}</span>?
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Al aprobar el equipo, podrá participar en el torneo y aparecerá en el bracket.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsApproveDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-jade-600 hover:bg-jade-500 text-white"
              onClick={handleApproveConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para rechazar equipo */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-red-400">Rechazar Equipo</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-gray-300">
              ¿Estás seguro de que deseas rechazar el equipo <span className="font-bold">{team?.name}</span>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="rejectionReason" className="text-gray-300">
                Motivo del rechazo
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder="Ingresa el motivo del rechazo"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-black/50 border-gray-700 focus:border-red-800 focus:ring-red-900/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-800 hover:bg-red-700 text-white"
              onClick={handleRejectConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
