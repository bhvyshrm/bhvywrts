"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight, Compass } from "lucide-react"
import { GalaxyStoryCard } from "./GalaxyStoryCard"
import { GALAXY_EASING } from "./motion"
import { cn } from "@/lib/utils"
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
  const trackRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  })

  // Gentle horizontal shift tied to viewport scroll progress
  const desktopTrackX = useTransform(smoothProgress, [0.1, 0.9], ["2%", "-20%"])

  useEffect(() => {
    setMounted(true)
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
      className="relative z-10 w-full max-w-full overflow-x-clip pt-4 pb-16"
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

        {/* Gallery Navigation Controls for Keyboard/Mouse Discovery */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (trackRef.current) {
                trackRef.current.scrollBy({ left: -360, behavior: "smooth" })
              }
            }}
            aria-label="Previous stories"
            className="w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--orchid)] active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (trackRef.current) {
                trackRef.current.scrollBy({ left: 360, behavior: "smooth" })
              }
            }}
            aria-label="Next stories"
            className="w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--orchid)] active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. MOBILE STORY TRACK (< 768px): Touch-friendly snap track */}
      <div className="md:hidden w-full overflow-hidden">
        <div
          role="region"
          aria-label="Story cards track"
          tabIndex={0}
          style={{ WebkitOverflowScrolling: "touch", contain: "content" }}
          className="flex gap-3.5 min-[390px]:gap-4 px-3.5 min-[390px]:px-4 overflow-x-auto scrollbar-none snap-x snap-mandatory overscroll-x-contain pb-6 scroll-pl-3.5 min-[390px]:scroll-pl-4 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
        >
          {stories.map((story, index) => (
            <div
              key={`mobile-${story.id}`}
              className="snap-center shrink-0 w-[82vw] max-w-[330px] h-[390px] min-[375px]:h-[420px] min-[430px]:h-[460px]"
            >
              <GalaxyStoryCard
                story={story}
                index={index}
                priority={index < 2}
                isActive={index === activeCardIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. DESKTOP STORY TRACK (>= 768px): Horizontal perspective composition */}
      <div className="hidden md:block w-full overflow-hidden" style={{ perspective: "1200px" }}>
        <motion.div
          ref={trackRef}
          style={{ x: mounted && !reducedMotion ? desktopTrackX : 0 }}
          className="flex gap-6 md:gap-8 px-4 sm:px-8 md:px-12 overflow-x-auto pb-8 pt-4 scrollbar-none items-center will-change-transform"
        >
          {stories.map((story, index) => {
            const preset = PERSPECTIVE_PRESETS[index % PERSPECTIVE_PRESETS.length]
            const isActive = index === activeCardIndex
            const cardStyle: React.CSSProperties = reducedMotion
              ? {}
              : {
                  transform: isActive
                    ? "rotate(0deg) translateY(0px) scale(1.03)"
                    : `rotate(${preset.rotate}) translateY(${preset.y}px) scale(${preset.scale})`,
                  transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }

            return (
              <div
                key={story.id}
                onMouseEnter={() => setActiveCardIndex(index)}
                onFocus={() => setActiveCardIndex(index)}
                className={cn(
                  "shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] h-[440px] sm:h-[480px] md:h-[520px] transition-all duration-500",
                  isActive ? "z-30" : "z-10 hover:z-20 opacity-90 hover:opacity-100"
                )}
                style={cardStyle}
              >
                <GalaxyStoryCard
                  story={story}
                  index={index}
                  priority={index < 3}
                  isActive={isActive}
                />
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
