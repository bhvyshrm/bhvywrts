"use client"

import { useEffect, useState, useRef } from "react"

export function GalaxyBackground() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const mediaListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", mediaListener)

    const onScroll = () => {
      if (media.matches) return
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafRef.current = null
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      media.removeEventListener("change", mediaListener)
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Subtle restrained parallax shift: 0 to 45px over the entire scroll height
  const parallaxOffset = reducedMotion ? 0 : Math.min(60, scrollY * 0.05)

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#091825]"
      aria-hidden="true"
    >
      {/* LAYER 1: The Supplied Coastal Road & Ocean Wallpaper */}
      <div
        className="absolute -inset-[2%] w-[104%] h-[106%] transform-gpu will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, -${parallaxOffset}px, 0)`,
        }}
      >
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/images/coastal-wallpaper-mobile.webp"
            type="image/webp"
          />
          <source
            srcSet="/images/coastal-wallpaper.webp"
            type="image/webp"
          />
          <img
            src="/images/coastal-wallpaper.jpg"
            alt=""
            role="presentation"
            fetchPriority="high"
            className="w-full h-full object-cover object-[center_60%] sm:object-[center_65%] md:object-[center_70%]"
          />
        </picture>
      </div>

      {/* LAYER 2: Sun & Sky Caustic Highlight (Soft Top Glow) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(140, 205, 242, 0.12) 0%, rgba(255, 255, 255, 0.04) 25%, transparent 60%)",
        }}
      />

      {/* LAYER 3: Translucent Coastal Glass Tint for Supreme Text Contrast */}
      {/* Keeps ocean blue and sky visible while ensuring white typography and cards pop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9, 24, 37, 0.22) 0%, rgba(18, 61, 90, 0.28) 35%, rgba(9, 24, 37, 0.55) 75%, rgba(5, 15, 24, 0.78) 100%)",
        }}
      />

      {/* LAYER 4: Soft Edge Vignette for Reading Focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 35%, transparent 45%, rgba(9, 24, 37, 0.65) 100%)",
        }}
      />

      {/* LAYER 5: Organic Tactile Micro-Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
