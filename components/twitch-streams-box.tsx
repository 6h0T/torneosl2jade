"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, X, ExternalLink, ChevronUp, Play } from "lucide-react"
import Image from "next/image"
import { createClientComponentClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface TwitchStreamer {
  id: number
  username: string
  display_name: string
  profile_image_url?: string
  is_live?: boolean
  created_at: string
}

export default function TwitchStreamsBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [streamers, setStreamers] = useState<TwitchStreamer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStreamer, setSelectedStreamer] = useState<TwitchStreamer | null>(null)
  const [showIframe, setShowIframe] = useState(false)

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const supabase = createClientComponentClient()

        // If supabase client is null, use example data
        if (!supabase) {
          console.warn("Supabase client could not be initialized. Using example data for streamers.")
          setStreamers([
            {
              id: 1,
              username: "lineage2classic",
              display_name: "Lineage 2 Classic",
              profile_image_url:
                "https://static-cdn.jtvnw.net/jtv_user_pictures/lineage2classic-profile_image-f10d0c7e9e0d7dce-300x300.jpeg",
              is_live: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              username: "l2tournament",
              display_name: "L2 Tournament Official",
              profile_image_url:
                "https://static-cdn.jtvnw.net/jtv_user_pictures/lineage2-profile_image-d3e9d7a5e3b44654-300x300.png",
              is_live: false,
              created_at: new Date().toISOString(),
            },
            {
              id: 3,
              username: "lineage2",
              display_name: "Lineage 2",
              profile_image_url:
                "https://static-cdn.jtvnw.net/jtv_user_pictures/lineage2-profile_image-d3e9d7a5e3b44654-300x300.png",
              is_live: false,
              created_at: new Date().toISOString(),
            },
          ])
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("twitch_streamers")
          .select("*")
          .order("is_live", { ascending: false })
          .order("display_name", { ascending: true })

        if (error) {
          console.error("Error fetching streamers:", error)
          return
        }

        // Si no hay datos en la base de datos, usar datos de ejemplo
        if (!data || data.length === 0) {
          setStreamers([
            {
              id: 1,
              username: "lineage2classic",
              display_name: "Lineage 2 Classic",
              profile_image_url:
                "https://static-cdn.jtvnw.net/jtv_user_pictures/lineage2classic-profile_image-f10d0c7e9e0d7dce-300x300.jpeg",
              is_live: true,
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              username: "l2tournament",
              display_name: "L2 Tournament Official",
              profile_image_url:
                "https://static-cdn.jtvnw.net/jtv_user_pictures/lineage2-profile_image-d3e9d7a5e3b44654-300x300.png",
              is_live: false,
              created_at: new Date().toISOString(),
            },
            {
              id: 3,
              username: "lineage2",
              display_name: "Lineage 2",
              profile_image_url:
                "https://static-cdn.jtvnw.net/jtv_user_pictures/lineage2-profile_image-d3e9d7a5e3b44654-300x300.png",
              is_live: false,
              created_at: new Date().toISOString(),
            },
          ])
        } else {
          setStreamers(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStreamers()

    // Configurar actualización en tiempo real para los streamers
    const supabase = createClientComponentClient()

    // Only set up real-time subscription if supabase client exists
    if (supabase) {
      const streamersSubscription = supabase
        .channel("streamers-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "twitch_streamers",
          },
          () => {
            // Cuando hay cambios, actualizar los datos
            fetchStreamers()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(streamersSubscription)
      }
    }
  }, [])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    // Cerrar el iframe si se cierra el panel
    if (isOpen) {
      setShowIframe(false)
      setSelectedStreamer(null)
    }
  }

  const handleStreamerClick = (streamer: TwitchStreamer) => {
    if (streamer.is_live) {
      setSelectedStreamer(streamer)
      setShowIframe(true)
    } else {
      // Si no está en vivo, abrir en una nueva pestaña
      window.open(`https://twitch.tv/${streamer.username}`, "_blank")
    }
  }

  const closeIframe = () => {
    setShowIframe(false)
    setSelectedStreamer(null)
  }

  // Función para obtener la URL de la miniatura de Twitch
  const getThumbnailUrl = (username: string) => {
    return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${username.toLowerCase()}-320x180.jpg?${Date.now()}`
  }

  // Contar streamers en vivo
  const liveStreamersCount = streamers.filter((streamer) => streamer.is_live).length

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
            {liveStreamersCount > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {liveStreamersCount}
              </span>
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
              <h3 className="text-jade-400 font-medium text-sm">Streams de Twitch</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-black/50"
                onClick={toggleOpen}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            {/* Iframe para ver el stream */}
            {showIframe && selectedStreamer && (
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
                  src={`https://player.twitch.tv/?channel=${selectedStreamer.username}&parent=${window.location.hostname}&muted=true`}
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
                  <p className="mt-2 text-xs text-gray-400">Cargando streamers...</p>
                </div>
              ) : streamers.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">No hay streamers disponibles</div>
              ) : (
                <ul className="divide-y divide-jade-800/20">
                  {streamers.map((streamer) => (
                    <li key={streamer.id} className="p-2 hover:bg-jade-900/20">
                      <div onClick={() => handleStreamerClick(streamer)} className="cursor-pointer">
                        {/* Miniatura para streamers en vivo */}
                        {streamer.is_live && (
                          <div className="relative mb-2 rounded-md overflow-hidden">
                            <Image
                              src={getThumbnailUrl(streamer.username) || "/placeholder.svg"}
                              alt={`${streamer.display_name} stream`}
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
                          </div>
                        )}

                        <div className="flex items-center space-x-3 p-1">
                          <div className="relative h-8 w-8 flex-shrink-0">
                            {streamer.profile_image_url ? (
                              <Image
                                src={streamer.profile_image_url || "/placeholder.svg"}
                                alt={streamer.display_name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-jade-900/50 flex items-center justify-center">
                                <Tv className="h-4 w-4 text-jade-400" />
                              </div>
                            )}
                            {streamer.is_live && (
                              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border border-black"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{streamer.display_name}</p>
                            <p className="text-xs text-gray-400 truncate">@{streamer.username}</p>
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
              <p className="text-xs text-gray-500">Streams oficiales del torneo Lineage 2</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
