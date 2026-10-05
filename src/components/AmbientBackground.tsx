"use client"

import { useEffect, useState } from "react"

interface AmbientBackgroundProps {
  coverImage?: string | null
}

export function AmbientBackground({ coverImage: _coverImage }: AmbientBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[var(--bg-base)]"
      aria-hidden="true"
    >
      {/* LAYER 1: Deep Aqua-Black Base is on the parent container (var(--bg-base)) */}

      {/* LAYER 2: Flowing Liquid Gradients (Fluid Atmospheric Shapes) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Shape 1: Upper-Left Deep Aqua & Soft Teal Atmosphere */}
        <div
          className={`absolute -top-[18%] -left-[12%] w-[72vw] max-w-[1100px] h-[68vh] max-h-[920px] min-w-[460px] min-h-[460px] rounded-full blur-[100px] sm:blur-[140px] will-change-transform ${
            prefersReducedMotion ? "" : "animate-aqua-flow-1"
          }`}
          style={{ background: "var(--flow-grad-1)" }}
        />

        {/* Shape 2: Upper-Right Cool Blue & Muted Cyan Atmosphere */}
        <div
          className={`absolute -top-[8%] -right-[14%] w-[68vw] max-w-[1050px] h-[64vh] max-h-[880px] min-w-[440px] min-h-[440px] rounded-full blur-[105px] sm:blur-[145px] will-change-transform ${
            prefersReducedMotion ? "" : "animate-aqua-flow-2"
          }`}
          style={{ background: "var(--flow-grad-2)" }}
        />

        {/* Shape 3: Mid-Depth Flow (Soft Aqua with tiny whisper of Lavender) */}
        <div
          className={`hidden sm:block absolute top-[30%] left-[10%] w-[62vw] max-w-[950px] h-[56vh] max-h-[800px] min-w-[400px] min-h-[400px] rounded-full blur-[115px] sm:blur-[155px] will-change-transform ${
            prefersReducedMotion ? "" : "animate-aqua-flow-3"
          }`}
          style={{ background: "var(--flow-grad-3)" }}
        />

        {/* Shape 4: Lower Oceanic Depth (Deep Aqua Ocean Foundation) */}
        <div
          className={`absolute -bottom-[16%] left-[6%] w-[80vw] max-w-[1200px] h-[64vh] max-h-[880px] min-w-[480px] min-h-[480px] rounded-full blur-[105px] sm:blur-[145px] will-change-transform ${
            prefersReducedMotion ? "" : "animate-aqua-flow-4"
          }`}
          style={{ background: "var(--flow-grad-4)" }}
        />

        {/* LAYER 3: Subtle Light Refraction (Translucent Caustic Highlight) */}
        <div
          className={`absolute top-[6%] left-[8%] w-[44vw] max-w-[640px] h-[30vh] max-h-[420px] rounded-full blur-[90px] sm:blur-[120px] will-change-transform ${
            prefersReducedMotion ? "" : "animate-aqua-refraction"
          }`}
          style={{ background: "var(--flow-grad-refraction)" }}
        />
      </div>

      {/* LAYER 4: Monochromatic Micro-Noise Texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: "var(--flow-noise-opacity)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* LAYER 5: Soft Vignette Gradient for Text Legibility & Reading Focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--flow-vignette)" }}
      />
    </div>
  )
}
