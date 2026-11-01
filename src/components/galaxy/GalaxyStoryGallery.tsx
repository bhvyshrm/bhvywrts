"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight, Compass, ArrowUpRight } from "lucide-react"
import { GalaxyStoryCard } from "./GalaxyStoryCard"
import { cn } from "@/lib/utils"
import type { GalaxyStoryItem } from "./types"

interface GalaxyStoryGalleryProps {
  stories: GalaxyStoryItem[]
  loading?: boolean
}

// Gentle, restrained perspective and elevation presets for Apple-style physical depth
const PERSPECTIVE_PRESETS = [
  { rotate: "-0.8deg", y: 4, scale: 0.99 },
  { rotate: "0.6deg", y: -4, scale: 1 },
  { rotate: "-0.5deg", y: 6, scale: 0.99 },
  { rotate: "0.8deg", y: -5, scale: 0.985 },
  { rotate: "-0.6deg", y: 3, scale: 1 },
  { rotate: "0.5deg", y: -4, scale: 0.99 },
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
  const desktopTrackX = useTransform(smoothProgress, [0.1, 0.9], ["1%", "-18%"])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true)
    })
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", listener)
    return () => {
      cancelAnimationFrame(frame)
      media.removeEventListener("change", listener)
    }
  }, [])

  if (loading) {
    return (
      <section className="relative z-10 galaxy-container py-16">
        <div className="flex gap-6 md:gap-8 lg:gap-10 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[260px] md:w-[310px] lg:w-[340px] h-[320px] md:h-[370px] lg:h-[400px] rounded-[28px] skeleton bg-white/[0.06] border border-white/15 shrink-0"
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
      className="relative z-10 w-full max-w-full overflow-x-clip pt-8 pb-16 sm:pb-22"
      aria-label="Latest stories"
    >
      {/* Section Header: Stories First directly after hero */}
      <div className="galaxy-container mb-8 md:mb-12 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium text-[#8CCDF2] bg-white/10 border border-white/20 backdrop-blur-md mb-2.5 shadow-xs">
            <Compass className="w-3 h-3 text-[#8CCDF2]" />
            <span>Fresh Writings</span>
          </div>
          <h2 className="font-[var(--font-instrument-serif)] text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight drop-shadow-sm">
            Latest stories
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#DCE5EC] font-normal">
            Something new to read.
          </p>
        </div>

        {/* Gallery Controls & All Stories Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/stories"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#DCE5EC] hover:text-white transition-colors mr-2"
          >
            <span>All stories</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8CCDF2]" />
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (trackRef.current) {
                  const scrollStep = trackRef.current.clientWidth > 1024 ? 420 : 340
                  trackRef.current.scrollBy({ left: -scrollStep, behavior: "smooth" })
                }
              }}
              aria-label="Previous stories"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/35 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8CCDF2] active:scale-95 shadow-sm backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (trackRef.current) {
                  const scrollStep = trackRef.current.clientWidth > 1024 ? 420 : 340
                  trackRef.current.scrollBy({ left: scrollStep, behavior: "smooth" })
                }
              }}
              aria-label="Next stories"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/35 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8CCDF2] active:scale-95 shadow-sm backdrop-blur-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. MOBILE STORY TRACK (< 768px): Touch-friendly snap track */}
      <div className="md:hidden w-full overflow-hidden">
        <div
          role="region"
          aria-label="Story cards track"
          tabIndex={0}
          style={{ WebkitOverflowScrolling: "touch", contain: "content" }}
          className="flex gap-4 px-4 overflow-x-auto scrollbar-none snap-x snap-mandatory overscroll-x-contain pb-6 scroll-pl-4 focus-visible:outline-2 focus-visible:outline-[#8CCDF2]"
        >
          {stories.map((story, index) => (
            <div
              key={`mobile-${story.id}`}
              className="snap-center shrink-0 w-[265px] min-[360px]:w-[285px] min-[390px]:w-[305px] h-[310px] min-[360px]:h-[335px] min-[390px]:h-[355px]"
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

      {/* 2. DESKTOP STORY TRACK (>= 768px): Perspective composition */}
      <div className="hidden md:block w-full overflow-hidden" style={{ perspective: "1200px" }}>
        <motion.div
          ref={trackRef}
          style={{ x: mounted && !reducedMotion ? desktopTrackX : 0 }}
          className="flex gap-7 md:gap-8 lg:gap-10 xl:gap-11 px-6 md:px-12 lg:px-16 xl:px-20 overflow-x-auto pb-10 pt-4 scrollbar-none items-center will-change-transform"
        >
          {stories.map((story, index) => {
            const preset = PERSPECTIVE_PRESETS[index % PERSPECTIVE_PRESETS.length]
            const isActive = index === activeCardIndex
            const cardStyle: React.CSSProperties = reducedMotion
              ? {}
              : {
                  transform: isActive
                    ? "rotate(0deg) translateY(0px) scale(1.02)"
                    : `rotate(${preset.rotate}) translateY(${preset.y}px) scale(${preset.scale})`,
                  transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }

            return (
              <div
                key={story.id}
                onMouseEnter={() => setActiveCardIndex(index)}
                onFocus={() => setActiveCardIndex(index)}
                className={cn(
                  "shrink-0 md:w-[300px] md:h-[350px] lg:w-[335px] lg:h-[390px] xl:w-[355px] xl:h-[410px] transition-all duration-500",
                  isActive ? "z-30" : "z-10 hover:z-20 opacity-95 hover:opacity-100"
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
