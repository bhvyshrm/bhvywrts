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
    </div>
  )
}
