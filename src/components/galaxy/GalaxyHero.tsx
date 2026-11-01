"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUpRight, Clock, Compass } from "lucide-react"
import { GALAXY_EASING } from "./motion"
import type { Story } from "@/types"

interface GalaxyHeroProps {
  featuredStory?: Story | null
  loading?: boolean
  onScrollToGallery?: () => void
}

export function GalaxyHero({ featuredStory, loading = false, onScrollToGallery }: GalaxyHeroProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  return (
    <section className="relative z-10 w-full pt-28 sm:pt-32 md:pt-36 pb-14 sm:pb-18 md:pb-24 galaxy-container min-h-[82vh] md:min-h-[88vh] flex flex-col justify-center">
      {/* Long Immersive Coastal Glass Banner */}
      <div className="relative w-full rounded-[32px] sm:rounded-[40px] md:rounded-[48px] border border-white/20 sm:border-white/25 bg-white/[0.08] dark:bg-[#091825]/40 backdrop-blur-2xl shadow-[0_30px_90px_rgba(9,24,37,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.4)] p-7 sm:p-10 md:p-14 lg:p-16 overflow-hidden">
        {/* Subtle Specular Top Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Ambient Coastal Sky Radial Lighting behind banner content */}
        <div
          className="absolute -top-1/4 left-1/3 w-[60vw] max-w-[700px] h-[350px] pointer-events-none -z-10 opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(140, 205, 242, 0.45) 0%, rgba(23, 107, 156, 0.15) 50%, transparent 75%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Brand Eyebrow, Main Editorial Headline & Supporting Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Eyebrow Pill */}
            <motion.div
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: GALAXY_EASING.editorial }}
              className="flex items-center gap-2.5 flex-wrap"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.24em] font-medium border border-white/20 bg-white/10 text-[#8CCDF2] backdrop-blur-md shadow-xs">
                <Compass className="w-3.5 h-3.5 text-[#8CCDF2]" />
                <span>bhvy. &middot; Digital Journal</span>
              </span>
              <span className="text-xs text-[#DCE5EC]/80 tracking-wider">
                by Bhavya
              </span>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.div
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.1, ease: GALAXY_EASING.editorial }}
              className="space-y-4"
            >
              <h1 className="font-[var(--font-instrument-serif)] text-[32px] min-[360px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7.5xl text-white font-normal tracking-[-0.025em] leading-[1.04] select-none text-balance drop-shadow-[0_4px_24px_rgba(9,24,37,0.5)]">
                Some things are better left between the lines.
              </h1>
              <p className="max-w-xl text-sm sm:text-base md:text-lg text-[#DCE5EC] leading-relaxed text-balance drop-shadow-sm font-normal">
                Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.
              </p>
            </motion.div>

            {/* Subtle Editorial Actions */}
            <motion.div
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.2, ease: GALAXY_EASING.editorial }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={onScrollToGallery}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#091825] text-xs sm:text-sm font-medium hover:bg-[#F8FBFF] hover:shadow-[0_0_24px_rgba(140,205,242,0.4)] active:scale-95 transition-all cursor-pointer group shadow-sm focus-visible:outline-2 focus-visible:outline-[#8CCDF2]"
              >
                <span>Latest stories</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/20 hover:border-white/35 bg-white/[0.06] hover:bg-white/10 text-[#DCE5EC] hover:text-white text-xs sm:text-sm font-medium transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8CCDF2]"
              >
                <span>About Bhavya</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Asymmetrical Editorial Floating Glass Detail */}
          <div className="lg:col-span-5">
            {featuredStory ? (
              <motion.div
                initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.9, delay: 0.25, ease: GALAXY_EASING.editorial }}
                className="relative group"
              >
                {/* Backlight reflection */}
                <div
                  className="absolute -inset-3 rounded-[36px] opacity-25 group-hover:opacity-40 transition-opacity duration-700 blur-2xl -z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(140, 205, 242, 0.4) 0%, rgba(23, 107, 156, 0.2) 50%, transparent 75%)",
                  }}
                />

                <Link
                  href={`/stories/${featuredStory.slug}`}
                  aria-label={`Read featured story: ${featuredStory.title}`}
                  className="block relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/20 sm:border-white/25 group-hover:border-white/40 bg-[#091825]/60 shadow-[0_24px_60px_rgba(9,24,37,0.5)] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8CCDF2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#091825]"
                >
                  {featuredStory.coverImage ? (
                    <img
                      src={featuredStory.coverImage}
                      alt={featuredStory.title}
                      width={600}
                      height={750}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div
                      className="w-full h-full relative"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(23, 107, 156, 0.4) 0%, rgba(9, 24, 37, 0.8) 100%)",
                      }}
                    />
                  )}

                  {/* Dark Vignette Overlay for Title Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                  {/* Bottom Story Capsule */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between pointer-events-none">
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8CCDF2] drop-shadow-md">
                          Featured
                        </span>
                        {featuredStory.readingTime && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <span className="inline-flex items-center gap-1 text-[10px] text-white/80">
                              <Clock className="w-3 h-3 text-[#8CCDF2]" />
                              <span>{featuredStory.readingTime} min</span>
                            </span>
                          </>
                        )}
                      </div>
                      <p className="font-[var(--font-instrument-serif)] text-xl sm:text-2xl text-white drop-shadow-md line-clamp-2 leading-tight">
                        {featuredStory.title}
                      </p>
                    </div>

                    {/* Circular Action Arrow */}
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/30 shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-[#8CCDF2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : loading ? (
              <div className="aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[28px] sm:rounded-[32px] bg-white/[0.06] border border-white/10 animate-pulse" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
