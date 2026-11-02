"use client"

import { useEffect, useState, useRef } from "react"

export function GalaxyBackground() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mediaListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", mediaListener)

    // Check if mobile or touch device — disable scroll parallax completely on mobile for buttery smooth 120fps
    const isMobileOrTouch =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches

    if (media.matches || isMobileOrTouch) {
      return () => {
        media.removeEventListener("change", mediaListener)
      }
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (bgRef.current) {
            const offset = Math.min(45, window.scrollY * 0.035)
            bgRef.current.style.transform = `translate3d(0, -${offset}px, 0)`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      media.removeEventListener("change", mediaListener)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#091825]"
      aria-hidden="true"
    >
      {/* LAYER 1: The Uploaded Coastal Landscape Wallpaper (Prominent, High-Vibrancy) */}
      <div
        ref={bgRef}
        className="absolute -inset-[1%] w-[102%] h-[104%] transform-gpu will-change-transform"
      >
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/images/bhvy-coastal-background-mobile.webp"
            type="image/webp"
          />
          <source
            srcSet="/images/bhvy-coastal-background.webp"
            type="image/webp"
          />
          <img
            src="/images/bhvy-coastal-background.webp"
            alt=""
            role="presentation"
            fetchPriority="high"
            className="w-full h-full object-cover object-[center_50%] sm:object-[center_55%] md:object-[center_60%]"
          />
        </picture>
      </div>

      {/* LAYER 2: Sun & Sky Caustic Highlight (Soft Top Glow) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(140, 205, 242, 0.08) 0%, rgba(255, 255, 255, 0.02) 20%, transparent 50%)",
        }}
      />

      {/* LAYER 3: Subtle Atmospheric Depth (Restrained tint preserving ocean blue, sky, clouds and road) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9, 24, 37, 0.18) 0%, rgba(9, 24, 37, 0.06) 25%, rgba(9, 24, 37, 0.22) 65%, rgba(9, 24, 37, 0.55) 100%)",
        }}
      />

      {/* LAYER 4: Soft Edge Vignette for Reading Focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 35%, transparent 55%, rgba(9, 24, 37, 0.40) 100%)",
        }}
      />
    </div>
  )
}
