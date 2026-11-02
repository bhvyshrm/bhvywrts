"use client"

import { useEffect, useState } from "react"

export function GalaxyBackground() {
  const [_reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mediaListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", mediaListener)

    // Responsive breakpoint verification — strictly stationary across all screen sizes (<= 768px and desktop)
    const _isMobile = window.matchMedia("(max-width: 768px)").matches

    return () => {
      media.removeEventListener("change", mediaListener)
    }
  }, [])

  return (
    <div
      className="bhvy-coastal-fixed-bg fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Stationary coastal landscape wallpaper (zero movement, covers viewport) */}
      <div className="absolute inset-0 bg-cover bg-no-repeat bg-[center_50%] max-md:bg-[center_40%] bg-[url('/images/bhvy-coastal-background.webp')] max-md:bg-[url('/images/bhvy-coastal-background-mobile.webp')]" />

      {/* 2. Soft top vignette for navbar legibility */}
      <div
        className="absolute top-0 inset-x-0 h-36 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9, 24, 37, 0.40) 0%, rgba(9, 24, 37, 0.12) 60%, transparent 100%)",
        }}
      />

      {/* 3. Soft bottom vignette for footer legibility */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(9, 24, 37, 0.60) 0%, rgba(9, 24, 37, 0.20) 60%, transparent 100%)",
        }}
      />
    </div>
  )
}
