"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface BracketConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The inputs to connect from
   */
  inputs?: string[]
  /**
   * The outputs to connect to
   */
  outputs?: string[]
  /**
   * The className to apply to the container
   */
  className?: string
  /**
   * Whether the connector is completed (changes color)
   */
  isCompleted?: boolean
}

export function BracketConnector({
  inputs = [],
  outputs = [],
  className,
  isCompleted = false,
  ...props
}: BracketConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || inputs.length === 0 || outputs.length === 0) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Get element positions
    const getElementCenter = (selector: string) => {
      const element = document.getElementById(selector)
      if (!element) return null

      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      }
    }

    // Draw connections with right angle paths
    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set color based on completion status
      ctx.strokeStyle = isCompleted ? "#4B5563" : "#00b377"
      ctx.lineWidth = 1.5

      // Group inputs by their corresponding output
      const inputGroups: { [outputId: string]: string[] } = {}

      // Distribute inputs evenly among outputs
      const inputsPerOutput = Math.ceil(inputs.length / outputs.length)

      for (let i = 0; i < outputs.length; i++) {
        const startIdx = i * inputsPerOutput
        const endIdx = Math.min(startIdx + inputsPerOutput, inputs.length)
        inputGroups[outputs[i]] = inputs.slice(startIdx, endIdx)
      }

      // Draw connections for each output and its corresponding inputs
      for (const outputId of outputs) {
        const outputPos = getElementCenter(outputId)
        if (!outputPos) continue

        const relatedInputs = inputGroups[outputId] || []

        for (const inputId of relatedInputs) {
          const inputPos = getElementCenter(inputId)
          if (!inputPos) continue

          // Create path with right angles
          const path = createRightAnglePath(inputPos, outputPos)

          // Draw path
          ctx.beginPath()
          ctx.moveTo(path[0].x, path[0].y)

          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y)
          }

          ctx.stroke()
        }
      }
    }

    // Create a path with right angles
    function createRightAnglePath(
      start: { x: number; y: number },
      end: { x: number; y: number },
    ): { x: number; y: number }[] {
      // Calculate midpoint for the bend
      const midX = start.x + (end.x - start.x) / 2

      // Create a path with two 90-degree bends
      return [
        { x: start.x, y: start.y },
        { x: midX, y: start.y },
        { x: midX, y: end.y },
        { x: end.x, y: end.y },
      ]
    }

    // Initial draw
    drawConnections()

    // Redraw on resize
    window.addEventListener("resize", drawConnections)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      window.removeEventListener("resize", drawConnections)
    }
  }, [inputs, outputs, isCompleted])

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)} {...props}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
