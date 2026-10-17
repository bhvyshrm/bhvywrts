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

        {/* LAYER 3: Subtle Aqua Flow Reflections (#1B6870 / #4FAEB5) */}
        {/* Soft Aqua Caustic Glow behind Gallery composition */}
        <div
          className={`absolute top-[18%] left-[18%] w-[52vw] max-w-[780px] h-[40vh] max-h-[520px] rounded-full blur-[100px] sm:blur-[135px] opacity-45 will-change-transform ${
            reducedMotion ? "" : "animate-aqua-refraction"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(27, 104, 112, 0.32) 0%, rgba(79, 174, 181, 0.12) 35%, transparent 68%)",
          }}
        />

        {/* Lower Deep Ocean Tone anchoring the viewport bottom */}
        <div
          className={`absolute -bottom-[20%] left-[10%] w-[75vw] max-w-[1100px] h-[55vh] max-h-[750px] rounded-full blur-[110px] sm:blur-[150px] opacity-50 will-change-transform ${
            reducedMotion ? "" : "animate-aurora-3"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10, 57, 64, 0.35) 0%, rgba(8, 26, 32, 0.2) 45%, transparent 75%)",
          }}
        />
      </div>

      {/* LAYER 4: Restrained Distant Star Field (Static, lightweight CSS stars) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 100px 150px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 240px 90px, rgba(165,243,252,0.8), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 380px 280px, rgba(255,255,255,0.5), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 520px 180px, rgba(192,132,252,0.6), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 660px 390px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 800px 120px, rgba(255,255,255,0.4), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 940px 450px, rgba(165,243,252,0.7), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 1100px 220px, rgba(255,255,255,0.5), rgba(0,0,0,0))`,
          backgroundSize: "1200px 600px",
        }}
      />

      {/* LAYER 5: Cosmic Depth Vignette & Noise Texture for Organic Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(3, 3, 6, 0.75) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
