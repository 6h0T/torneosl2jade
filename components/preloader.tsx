"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Asegurarnos de que el componente solo se ejecute en el cliente
  useEffect(() => {
    setIsMounted(true)

    // Función para verificar si todas las imágenes están cargadas
    const checkImagesLoaded = () => {
      return new Promise((resolve) => {
        const images = document.querySelectorAll("img")
        let loadedImages = 0
        const totalImages = images.length

        if (totalImages === 0) {
          resolve(true)
          return
        }

        const onImageLoad = () => {
          loadedImages++
          setProgress(Math.min(90, Math.floor((loadedImages / totalImages) * 90)))
          if (loadedImages === totalImages) {
            resolve(true)
          }
        }

        Array.from(images).forEach((img) => {
          if (img.complete) {
            onImageLoad()
          } else {
            img.addEventListener("load", onImageLoad)
            img.addEventListener("error", onImageLoad) // Contar también las imágenes con error
          }
        })

        // Si todas las imágenes ya están cargadas
        if (loadedImages === totalImages) {
          resolve(true)
        }
      })
    }

    // Función para verificar si las fuentes están cargadas
    const checkFontsLoaded = () => {
      return new Promise((resolve) => {
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            setFontsLoaded(true)
            resolve(true)
          })
        } else {
          // Fallback para navegadores que no soportan document.fonts
          setTimeout(() => {
            setFontsLoaded(true)
            resolve(true)
          }, 1000)
        }
      })
    }

    // Simular progreso inicial
    let initialProgress = 0
    const progressInterval = setInterval(() => {
      initialProgress += Math.random() * 5
      setProgress(Math.min(50, Math.floor(initialProgress)))
      if (initialProgress >= 50) {
        clearInterval(progressInterval)
      }
    }, 200)

    // Verificar recursos cuando el documento esté listo
    if (document.readyState === "complete") {
      Promise.all([checkImagesLoaded(), checkFontsLoaded()]).then(() => {
        setAssetsLoaded(true)
        setProgress(100)
        clearInterval(progressInterval)

        // Dar tiempo para mostrar el 100% antes de ocultar
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
    } else {
      window.addEventListener("load", () => {
        Promise.all([checkImagesLoaded(), checkFontsLoaded()]).then(() => {
          setAssetsLoaded(true)
          setProgress(100)
          clearInterval(progressInterval)

          // Dar tiempo para mostrar el 100% antes de ocultar
          setTimeout(() => {
            setLoading(false)
          }, 500)
        })
      })
    }

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!isMounted) return null

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center max-w-md px-4">
            {/* Logo con animación circular */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              {/* Círculos animados */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(77,158,115,0.2) 0%, rgba(0,0,0,0) 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Círculo exterior rotativo */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3c7d5c" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#78bd95" stopOpacity="1" />
                      <stop offset="100%" stopColor="#3c7d5c" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="1"
                    strokeDasharray="1, 10"
                  />
                </svg>
              </motion.div>

              {/* Círculo interior rotativo (dirección opuesta) */}
              <motion.div
                className="absolute inset-4"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#3c7d5c" strokeWidth="1" strokeDasharray="5, 5" />
                </svg>
              </motion.div>

              {/* Puntos orbitando */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-forest-400 rounded-full" />
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-2 h-2 bg-forest-400 rounded-full" />
                </div>
              </motion.div>

              {/* Logo central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-black/50 p-3 rounded-lg backdrop-blur-sm"
                >
                  <Image
                    src="/images/lineage-logo.png"
                    alt="Lineage 2"
                    width={150}
                    height={60}
                    className="object-contain"
                    priority
                    onLoad={() => setLogoLoaded(true)}
                  />
                </motion.div>
              </div>
            </div>

            <motion.h2
              className="text-2xl font-bold text-forest-400 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              LINEAGE 2
            </motion.h2>

            <motion.p
              className="text-forest-300 text-sm tracking-widest mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              CARGANDO TORNEOS
            </motion.p>

            {/* Barra de progreso */}
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-forest-600 to-forest-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Porcentaje */}
            <motion.div
              className="mt-2 text-xs text-forest-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {progress}%
            </motion.div>

            {/* Mensajes de estado */}
            <div className="h-6 mt-4">
              <AnimatePresence mode="wait">
                {progress < 30 && (
                  <motion.p
                    key="loading-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-gray-400"
                  >
                    Inicializando...
                  </motion.p>
                )}
                {progress >= 30 && progress < 60 && (
                  <motion.p
                    key="loading-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-gray-400"
                  >
                    Cargando imágenes...
                  </motion.p>
                )}
                {progress >= 60 && progress < 90 && (
                  <motion.p
                    key="loading-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-gray-400"
                  >
                    Preparando interfaz...
                  </motion.p>
                )}
                {progress >= 90 && (
                  <motion.p
                    key="loading-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-gray-400"
                  >
                    ¡Listo para comenzar!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
