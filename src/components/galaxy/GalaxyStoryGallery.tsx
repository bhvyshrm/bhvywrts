"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight, Compass } from "lucide-react"
import { GalaxyStoryCard } from "./GalaxyStoryCard"
import { GALAXY_EASING } from "./motion"
import type { GalaxyStoryItem } from "./types"

interface GalaxyStoryGalleryProps {
  stories: GalaxyStoryItem[]
  loading?: boolean
}

// Deterministic, aesthetically balanced perspective and vertical stagger values
const PERSPECTIVE_PRESETS = [
  { rotate: "-2.2deg", y: 12, scale: 0.98 },
  { rotate: "1.8deg", y: -10, scale: 1 },
  { rotate: "-1.5deg", y: 14, scale: 0.99 },
  { rotate: "2.5deg", y: -8, scale: 0.98 },
  { rotate: "-2.0deg", y: 8, scale: 1 },
  { rotate: "1.4deg", y: -12, scale: 0.99 },
] as const

export function GalaxyStoryGallery({ stories, loading = false }: GalaxyStoryGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  if (loading) {
    return (
      <section className="relative z-10 galaxy-container py-16">
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[300px] sm:w-[340px] md:w-[380px] h-[460px] sm:h-[500px] rounded-[28px] skeleton shrink-0"
            />
          ))}
        </div>
      </section>
    )
  }

  if (!stories.length) {
    return null
  }

  return (
    <section
      id="story-gallery"
      ref={containerRef}
      className="relative z-10 w-full pt-4 pb-16"
      aria-label="Story Gallery"
    >
      {/* Section Header */}
      <div className="galaxy-container mb-8 md:mb-12 flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)] bg-white/5 border border-white/10 mb-2">
            <Compass className="w-3 h-3 text-[var(--cyan-muted)]" />
            <span>Story Gallery</span>
          </div>
          <h2 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3.5xl md:text-4xl text-foreground font-normal tracking-tight">
            Suspended in Thought
          </h2>
        </div>
      </div>

      {/* Horizontal Story Track with Controlled Perspective */}
      <div className="w-full overflow-hidden" style={{ perspective: "1200px" }}>
        <div className="flex gap-6 md:gap-8 px-4 sm:px-8 md:px-12 overflow-x-auto pb-8 pt-4 scrollbar-none items-center">
          {stories.map((story, index) => {
            const preset = PERSPECTIVE_PRESETS[index % PERSPECTIVE_PRESETS.length]
            const cardStyle: React.CSSProperties = reducedMotion
              ? {}
              : {
                  transform: `rotate(${preset.rotate}) translateY(${preset.y}px) scale(${preset.scale})`,
                  transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }

            return (
              <div
                key={story.id}
                className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] h-[440px] sm:h-[480px] md:h-[520px] transition-transform duration-500 hover:!rotate-0 hover:!scale-105 hover:z-20"
                style={cardStyle}
              >
                <GalaxyStoryCard
                  story={story}
                  index={index}
                  priority={index < 3}
                  isActive={index === activeCardIndex}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
