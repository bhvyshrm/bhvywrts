"use client"

import { useEffect, useState } from "react"

export function GalaxyBackground() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const mediaListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", mediaListener)

    const onVisibilityChange = () => {
      setTabVisible(!document.hidden)
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      media.removeEventListener("change", mediaListener)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  const shouldAnimate = !reducedMotion && tabVisible

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#000000]"
      aria-hidden="true"
    >
      {/* LAYER 1: Pure AMOLED Black Canvas (#000000) */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Subtle Atmospheric Depth: Pure black with delicate radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 15%, #050505 0%, #000000 65%)",
        }}
      />

      {/* LAYER 2: Restrained Electric Lavender & Soft Violet Atmospheric Lighting */}
      <div className="absolute inset-0 overflow-hidden transform-gpu pointer-events-none" style={{ contain: "paint" }}>
        {/* Upper-Left Subtle Lavender Ambient Radial Glow */}
        <div
          className={`absolute -top-[12%] -left-[8%] w-[60vw] max-w-[850px] h-[55vh] max-h-[750px] rounded-full blur-[90px] sm:blur-[140px] opacity-40 will-change-transform ${
            shouldAnimate ? "animate-aurora-1" : ""
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(182, 107, 255, 0.12) 0%, rgba(142, 91, 206, 0.05) 45%, transparent 70%)",
          }}
        />

        {/* Center-Right Muted Violet Glow */}
        <div
          className={`hidden sm:block absolute top-[28%] -right-[10%] w-[55vw] max-w-[800px] h-[50vh] max-h-[700px] rounded-full blur-[90px] sm:blur-[150px] opacity-35 will-change-transform ${
            shouldAnimate ? "animate-aurora-2" : ""
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(142, 91, 206, 0.10) 0%, rgba(232, 165, 207, 0.03) 40%, transparent 70%)",
          }}
        />

        {/* Soft Lavender Glow Behind Hero Accent */}
        <div
          className={`absolute top-[12%] left-[22%] w-[48vw] max-w-[650px] h-[35vh] max-h-[450px] rounded-full blur-[70px] sm:blur-[120px] opacity-30 will-change-transform ${
            shouldAnimate ? "animate-aqua-refraction" : ""
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(182, 107, 255, 0.10) 0%, rgba(142, 91, 206, 0.04) 35%, transparent 68%)",
          }}
        />

        {/* Lower Atmospheric Anchor */}
        <div
          className={`absolute -bottom-[15%] left-[12%] w-[70vw] max-w-[950px] h-[45vh] max-h-[600px] rounded-full blur-[80px] sm:blur-[130px] opacity-30 will-change-transform ${
            shouldAnimate ? "animate-aurora-3" : ""
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(142, 91, 206, 0.08) 0%, rgba(13, 13, 16, 0.5) 45%, transparent 75%)",
          }}
        />
      </div>

      {/* LAYER 3: Restrained Distant Star Field (Static, lightweight CSS stars) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 100px 150px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 240px 90px, rgba(182,107,255,0.6), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 380px 280px, rgba(255,255,255,0.5), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 520px 180px, rgba(232,165,207,0.5), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 660px 390px, rgba(255,255,255,0.6), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 800px 120px, rgba(255,255,255,0.4), rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 940px 450px, rgba(182,107,255,0.6), rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 1100px 220px, rgba(255,255,255,0.5), rgba(0,0,0,0))`,
          backgroundSize: "1200px 600px",
        }}
      />

      {/* LAYER 4: Cosmic Depth Vignette & Noise Texture for Organic Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
