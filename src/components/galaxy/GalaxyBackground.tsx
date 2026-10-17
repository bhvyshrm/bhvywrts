"use client"

import { useEffect, useState } from "react"

export function GalaxyBackground() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#030306]"
      aria-hidden="true"
    >
      {/* LAYER 1: Deep AMOLED Cosmic Foundation (#030306) */}
      <div className="absolute inset-0 bg-[#030306]" />

      {/* Atmospheric Base Gradient from deep cosmos into secondary tone #070811 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 20%, #070811 0%, #030306 70%, #020204 100%)",
        }}
      />

      {/* LAYER 2: Restrained Deep Blue (#0B1022) & Muted Violet (#17112B) Nebulae */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Upper-Left Cosmic Deep Blue Nebula */}
        <div
          className={`absolute -top-[15%] -left-[10%] w-[68vw] max-w-[1000px] h-[65vh] max-h-[850px] rounded-full blur-[110px] sm:blur-[150px] opacity-70 will-change-transform ${
            reducedMotion ? "" : "animate-aurora-1"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(11, 16, 34, 0.75) 0%, rgba(23, 17, 43, 0.35) 45%, transparent 70%)",
          }}
        />

        {/* Center-Right Muted Violet & Soft Lavender Cosmic Nebula */}
        <div
          className={`absolute top-[25%] -right-[12%] w-[60vw] max-w-[900px] h-[60vh] max-h-[800px] rounded-full blur-[120px] sm:blur-[160px] opacity-60 will-change-transform ${
            reducedMotion ? "" : "animate-aurora-2"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(23, 17, 43, 0.6) 0%, rgba(100, 117, 184, 0.14) 40%, transparent 70%)",
          }}
        />
      </div>
    </div>
  )
}
