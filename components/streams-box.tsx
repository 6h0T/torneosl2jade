"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, X, ExternalLink, ChevronUp, Play } from "lucide-react"
import Image from "next/image"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

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

export default function StreamsBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [streams, setStreams] = useState<Stream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [showIframe, setShowIframe] = useState(false)

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("streams")
          .select("*")
          .eq("is_live", true)
          .order("created_at", { ascending: false })

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

    fetchStreams()

    // Configurar actualización en tiempo real para las transmisiones
    const supabase = createClientComponentClient()
    const streamsSubscription = supabase
      .channel("streams-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "streams",
        },
        () => {
          // Cuando hay cambios, actualizar los datos
          fetchStreams()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(streamsSubscription)
    }
  }, [])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    // Cerrar el iframe si se cierra el panel
    if (isOpen) {
      setShowIframe(false)
      setSelectedStream(null)
    }
  }

  const handleStreamClick = (stream: Stream) => {
    if (stream.is_live) {
      setSelectedStream(stream)
      setShowIframe(true)
    } else {
      // Si no está en vivo, abrir en una nueva pestaña
      window.open(stream.url, "_blank")
    }
  }

  const closeIframe = () => {
    setShowIframe(false)
    setSelectedStream(null)
  }

  // Obtener la miniatura según la plataforma
  const getThumbnailUrl = (stream: Stream) => {
    if (stream.thumbnail_url) {
      return stream.thumbnail_url
    }

    // Si no hay miniatura personalizada, usar una predeterminada según la plataforma
    if (stream.platform === "twitch") {
      // Extraer el nombre de usuario de la URL de Twitch
      const twitchRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/
      const match = stream.url.match(twitchRegex)
      if (match && match[1]) {
        const username = match[1]
        return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${username.toLowerCase()}-320x180.jpg?${Date.now()}`
      }
    }

    // Para otras plataformas o si no se pudo extraer el nombre de usuario
    return "/placeholder.svg?height=180&width=320"
  }

  // Obtener el icono de la plataforma
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitch":
        return "/placeholder.svg?height=16&width=16&text=Twitch"
      case "youtube":
        return "/placeholder.svg?height=16&width=16&text=YT"
      case "facebook":
        return "/placeholder.svg?height=16&width=16&text=FB"
      case "kick":
        return "/placeholder.svg?height=16&width=16&text=Kick"
      default:
        return "/placeholder.svg?height=16&width=16"
    }
  }

  // Contar transmisiones en vivo
  const liveStreamsCount = streams.filter((stream) => stream.is_live).length

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Botón para abrir/cerrar */}
      <Button
        onClick={toggleOpen}
        className={`flex items-center space-x-2 shadow-lg ${
          isOpen
            ? "bg-black border border-jade-600 text-jade-400 hover:bg-black/90"
            : "bg-jade-600 hover:bg-jade-500 text-white"
        }`}
        size="sm"
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </>
        ) : (
          <>
            <Tv className="h-4 w-4" />
            <span className="hidden sm:inline">Streams</span>
            {liveStreamsCount > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{liveStreamsCount}</span>
            )}
          </>
        )}
      </Button>

      {/* Panel expandible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, width: 0 }}
            animate={{ opacity: 1, height: "auto", width: "320px" }}
            exit={{ opacity: 0, height: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm border border-jade-800/50 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-3 border-b border-jade-800/30 flex justify-between items-center">
              <h3 className="text-jade-400 font-medium text-sm">Transmisiones en vivo</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-black/50"
                onClick={toggleOpen}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            {/* Iframe para ver la transmisión */}
            {showIframe && selectedStream && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/70 text-white hover:bg-black z-10"
                  onClick={closeIframe}
                >
                  <X className="h-4 w-4" />
                </Button>
                <iframe
                  src={selectedStream.embed_url}
                  height="180"
                  width="320"
                  allowFullScreen={true}
                  className="w-full"
                ></iframe>
              </div>
            )}

            <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-jade-400 border-r-transparent"></div>
                  <p className="mt-2 text-xs text-gray-400">Cargando transmisiones...</p>
                </div>
              ) : streams.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">No hay transmisiones en vivo</div>
              ) : (
                <ul className="divide-y divide-jade-800/20">
                  {streams.map((stream) => (
                    <li key={stream.id} className="p-2 hover:bg-jade-900/20">
                      <div onClick={() => handleStreamClick(stream)} className="cursor-pointer">
                        {/* Miniatura para transmisiones en vivo */}
                        {stream.is_live && (
                          <div className="relative mb-2 rounded-md overflow-hidden">
                            <Image
                              src={getThumbnailUrl(stream) || "/placeholder.svg"}
                              alt={`${stream.title} thumbnail`}
                              width={320}
                              height={180}
                              className="w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                              EN VIVO
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                              <Image
                                src={getPlatformIcon(stream.platform) || "/placeholder.svg"}
                                alt={stream.platform}
                                width={16}
                                height={16}
                                className="mr-1"
                              />
                              {stream.platform.charAt(0).toUpperCase() + stream.platform.slice(1)}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 p-1">
                          <div className="relative h-8 w-8 flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-jade-900/50 flex items-center justify-center">
                              <Tv className="h-4 w-4 text-jade-400" />
                            </div>
                            {stream.is_live && (
                              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border border-black"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{stream.title}</p>
                            <p className="text-xs text-gray-400 truncate">{stream.platform}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-jade-400 flex-shrink-0" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-2 border-t border-jade-800/30 text-center">
              <p className="text-xs text-gray-500">Transmisiones oficiales del torneo Lineage 2</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
