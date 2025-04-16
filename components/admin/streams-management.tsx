"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Tv, AlertCircle, CheckCircle2, Eye, ExternalLink, Info } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Stream {
  id: number
  title: string
  platform: string
  url: string
  embed_url: string
  thumbnail_url?: string
  is_live: boolean
  created_at: string
}

export default function StreamsManagement() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [newStream, setNewStream] = useState({
    title: "",
    platform: "twitch",
    url: "",
    embed_url: "",
    thumbnail_url: "",
    is_live: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchStreams()
  }, [])

  const fetchStreams = async () => {
    try {
      setIsLoading(true)
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .order("is_live", { ascending: false })
        .order("title", { ascending: true })

      if (error) {
        console.error("Error fetching streams:", error)
        return
      }

      setStreams(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClick = () => {
    setNewStream({
      title: "",
      platform: "twitch",
      url: "",
      embed_url: "",
      thumbnail_url: "",
      is_live: false,
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteClick = (stream: Stream) => {
    setSelectedStream(stream)
    setIsDeleteDialogOpen(true)
  }

  const handlePreviewClick = (stream: Stream) => {
    setSelectedStream(stream)
    setIsPreviewDialogOpen(true)
  }

  const handlePlatformChange = (platform: string) => {
    setNewStream({ ...newStream, platform })

    // Limpiar URL y embed_url cuando cambia la plataforma
    setNewStream({
      ...newStream,
      platform,
      url: "",
      embed_url: "",
    })
  }

  const handleUrlChange = (url: string) => {
    let embedUrl = ""

    // Generar automáticamente la URL de embebido según la plataforma
    if (newStream.platform === "twitch") {
      // Extraer el nombre de usuario de Twitch de la URL
      const twitchRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/
      const match = url.match(twitchRegex)
      if (match && match[1]) {
        const username = match[1]
        embedUrl = `https://player.twitch.tv/?channel=${username}&parent=${window.location.hostname}`
      }
    } else if (newStream.platform === "youtube") {
      // Extraer el ID del video de YouTube de la URL
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
      const youtubeShortRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
      const match = url.match(youtubeRegex) || url.match(youtubeShortRegex)
      if (match && match[1]) {
        const videoId = match[1]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }
    } else if (newStream.platform === "facebook") {
      // Para Facebook, usamos la URL directamente en un iframe
      embedUrl = url
    } else if (newStream.platform === "kick") {
      // Extraer el nombre de canal de Kick de la URL
      const kickRegex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]+)/
      const match = url.match(kickRegex)
      if (match && match[1]) {
        const channelName = match[1]
        embedUrl = `https://player.kick.com/${channelName}`
      }
    }

    setNewStream({
      ...newStream,
      url,
      embed_url: embedUrl,
    })
  }

  const handleAddSubmit = async () => {
    if (!newStream.title || !newStream.url || !newStream.embed_url) {
      setMessage({
        type: "error",
        text: "El título, la URL y la URL de embebido son obligatorios.",
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase.from("streams").insert([
        {
          title: newStream.title.trim(),
          platform: newStream.platform,
          url: newStream.url.trim(),
          embed_url: newStream.embed_url.trim(),
          thumbnail_url: newStream.thumbnail_url || null,
          is_live: newStream.is_live,
        },
      ])

      if (error) {
        console.error("Error adding stream:", error)
        setMessage({
          type: "error",
          text: error.message,
        })
        return
      }

      setMessage({
        type: "success",
        text: "Transmisión añadida correctamente.",
      })

      // Recargar la lista de streams
      fetchStreams()

      // Cerrar el diálogo después de un breve retraso
      setTimeout(() => {
        setIsAddDialogOpen(false)
        setMessage(null)
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setMessage({
        type: "error",
        text: "Error inesperado al añadir la transmisión.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStream) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.from("streams").delete().eq("id", selectedStream.id)

      if (error) {
        console.error("Error deleting stream:", error)
        setMessage({
          type: "error",
          text: error.message,
        })
        return
      }

      setMessage({
        type: "success",
        text: "Transmisión eliminada correctamente.",
      })

      // Recargar la lista de streams
      fetchStreams()

      // Cerrar el diálogo después de un breve retraso
      setTimeout(() => {
        setIsDeleteDialogOpen(false)
        setMessage(null)
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setMessage({
        type: "error",
        text: "Error inesperado al eliminar la transmisión.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLiveStatus = async (stream: Stream) => {
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.from("streams").update({ is_live: !stream.is_live }).eq("id", stream.id)

      if (error) {
        console.error("Error updating stream:", error)
        return
      }

      // Actualizar la lista local
      setStreams(streams.map((s) => (s.id === stream.id ? { ...s, is_live: !stream.is_live } : s)))

      // Mostrar mensaje de éxito
      setMessage({
        type: "success",
        text: `La transmisión ${stream.title} ahora está ${!stream.is_live ? "en vivo" : "offline"}.`,
      })

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "twitch":
        return <Badge className="bg-purple-600">Twitch</Badge>
      case "youtube":
        return <Badge className="bg-red-600">YouTube</Badge>
      case "facebook":
        return <Badge className="bg-blue-600">Facebook</Badge>
      case "kick":
        return <Badge className="bg-green-600">Kick</Badge>
      default:
        return <Badge>{platform}</Badge>
    }
  }

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

      {/* Información sobre las transmisiones */}
      <div className="bg-jade-900/20 border border-jade-800/50 rounded-md p-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-jade-400 mr-3 mt-0.5" />
          <div>
            <p className="text-jade-200 text-sm">
              Añade transmisiones de diferentes plataformas como Twitch, YouTube, Facebook y Kick.
            </p>
            <p className="text-jade-300 text-xs mt-1">
              Marca las transmisiones como "en vivo" para mostrarlas en la caja de streams.
            </p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-jade-400">Transmisiones</h3>
        <Button className="bg-jade-600 hover:bg-jade-500 text-white" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" /> Añadir Transmisión
        </Button>
      </div>

      {/* Tabla de transmisiones */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jade-400 border-r-transparent"></div>
            <p className="mt-4 text-jade-300">Cargando transmisiones...</p>
          </div>
        </div>
      ) : streams.length === 0 ? (
        <div className="bg-black/50 border border-jade-800/30 rounded-md p-6 text-center">
          <Tv className="h-12 w-12 text-jade-600 mx-auto mb-4 opacity-50" />
          <p className="text-gray-300 mb-4">No hay transmisiones registradas.</p>
          <p className="text-gray-400 text-sm">
            Haz clic en &quot;Añadir Transmisión&quot; para agregar transmisiones de diferentes plataformas.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="border border-jade-800/30">
            <TableHeader className="bg-black/50">
              <TableRow>
                <TableHead className="text-jade-300">ID</TableHead>
                <TableHead className="text-jade-300">Título</TableHead>
                <TableHead className="text-jade-300">Plataforma</TableHead>
                <TableHead className="text-jade-300">URL</TableHead>
                <TableHead className="text-jade-300">Estado</TableHead>
                <TableHead className="text-jade-300">Fecha de creación</TableHead>
                <TableHead className="text-jade-300">Vista previa</TableHead>
                <TableHead className="text-jade-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((stream) => (
                <TableRow key={stream.id} className="border-b border-jade-800/20">
                  <TableCell>{stream.id}</TableCell>
                  <TableCell className="font-medium">{stream.title}</TableCell>
                  <TableCell>{getPlatformBadge(stream.platform)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a
                      href={stream.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jade-400 hover:underline flex items-center"
                    >
                      <span className="truncate">{stream.url}</span>
                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={stream.is_live || false} onCheckedChange={() => toggleLiveStatus(stream)} />
                      <Badge className={stream.is_live ? "bg-red-600" : "bg-gray-600"}>
                        {stream.is_live ? "En vivo" : "Offline"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(stream.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-jade-600 text-jade-400 hover:bg-jade-900/30"
                      onClick={() => handlePreviewClick(stream)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-800 text-red-400 hover:bg-red-900/30"
                      onClick={() => handleDeleteClick(stream)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Diálogo para añadir transmisión */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Añadir Transmisión</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Ej: Torneo Comunidad Jade - Semifinales"
                value={newStream.title}
                onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-gray-300">
                Plataforma
              </Label>
              <Select value={newStream.platform} onValueChange={handlePlatformChange}>
                <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-jade-500/30">
                  <SelectValue placeholder="Selecciona la plataforma" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  <SelectItem value="twitch" className="focus:bg-jade-900/50 focus:text-jade-100">
                    Twitch
                  </SelectItem>
                  <SelectItem value="youtube" className="focus:bg-jade-900/50 focus:text-jade-100">
                    YouTube
                  </SelectItem>
                  <SelectItem value="facebook" className="focus:bg-jade-900/50 focus:text-jade-100">
                    Facebook
                  </SelectItem>
                  <SelectItem value="kick" className="focus:bg-jade-900/50 focus:text-jade-100">
                    Kick
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-gray-300">
                URL de la transmisión
              </Label>
              <Input
                id="url"
                placeholder={
                  newStream.platform === "twitch"
                    ? "https://twitch.tv/username"
                    : newStream.platform === "youtube"
                      ? "https://youtube.com/watch?v=videoId"
                      : newStream.platform === "facebook"
                        ? "https://facebook.com/user/videos/videoId"
                        : "https://kick.com/username"
                }
                value={newStream.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="embedUrl" className="text-gray-300">
                URL de embebido (generada automáticamente)
              </Label>
              <Input
                id="embedUrl"
                value={newStream.embed_url}
                onChange={(e) => setNewStream({ ...newStream, embed_url: e.target.value })}
                className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl" className="text-gray-300">
                URL de miniatura (opcional)
              </Label>
              <Input
                id="thumbnailUrl"
                placeholder="https://..."
                value={newStream.thumbnail_url}
                onChange={(e) => setNewStream({ ...newStream, thumbnail_url: e.target.value })}
                className="bg-black/50 border-gray-700 focus:border-jade-600 focus:ring-jade-500/30"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isLive"
                checked={newStream.is_live}
                onCheckedChange={(checked) => setNewStream({ ...newStream, is_live: checked })}
              />
              <Label htmlFor="isLive" className="text-gray-300">
                Marcar como "en vivo"
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-jade-600 hover:bg-jade-500 text-white"
              onClick={handleAddSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Añadir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar transmisión */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30">
          <DialogHeader>
            <DialogTitle className="text-red-400">Eliminar Transmisión</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              ¿Estás seguro de que deseas eliminar la transmisión{" "}
              <span className="font-bold">{selectedStream?.title}</span>?
            </p>
            <p className="text-gray-400 text-sm mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-800 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para vista previa de la transmisión */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="bg-black/90 border-jade-800/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-jade-400">Vista previa de {selectedStream?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedStream && (
              <>
                {selectedStream.is_live ? (
                  <div className="space-y-4">
                    {selectedStream.thumbnail_url && (
                      <div className="relative rounded-md overflow-hidden">
                        <Image
                          src={selectedStream.thumbnail_url || "/placeholder.svg"}
                          alt={`${selectedStream.title} thumbnail`}
                          width={320}
                          height={180}
                          className="w-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          EN VIVO
                        </div>
                      </div>
                    )}
                    <iframe
                      src={selectedStream.embed_url}
                      height="180"
                      width="100%"
                      allowFullScreen={true}
                      className="w-full rounded-md"
                    ></iframe>
                    <div className="bg-jade-900/20 border border-jade-800/50 rounded-md p-3">
                      <div className="flex items-start">
                        <Info className="h-4 w-4 text-jade-400 mr-2 mt-0.5" />
                        <p className="text-jade-200 text-xs">
                          Esta transmisión está marcada como "en vivo" y se mostrará en la caja de streams.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/50 border border-jade-800/30 rounded-md p-6 text-center">
                      <Tv className="h-12 w-12 text-jade-600 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-300 mb-4">Esta transmisión está marcada como "offline".</p>
                      <p className="text-gray-400 text-sm">
                        Puedes marcarla como "en vivo" para mostrarla en la caja de streams.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        className="bg-jade-600 hover:bg-jade-500 text-white"
                        onClick={() => {
                          toggleLiveStatus(selectedStream)
                          setIsPreviewDialogOpen(false)
                        }}
                      >
                        <Tv className="h-4 w-4 mr-2" /> Marcar como "en vivo"
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="border-jade-600 text-jade-400 hover:bg-jade-900/30"
                    onClick={() => window.open(selectedStream.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Abrir en {selectedStream.platform}
                  </Button>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setIsPreviewDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
