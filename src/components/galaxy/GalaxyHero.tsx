"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ArrowUpRight, Clock, BookOpen } from "lucide-react"
import { GALAXY_EASING } from "./motion"
import { formatDate } from "@/lib/utils"
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
    <section className="relative z-10 w-full pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 galaxy-container">
      {/* Subtle Atmospheric Lavender Glow behind the Hero */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[400px] pointer-events-none -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(182, 107, 255, 0.15) 0%, rgba(142, 91, 206, 0.05) 50%, transparent 75%)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
        {/* Left Column: Brand Identity, Editorial Headline, CTAs, & Featured Story Details */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Eyebrow Pill */}
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: GALAXY_EASING.editorial }}
            className="flex items-center gap-2.5 flex-wrap"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium font-[var(--font-grotesk)] border border-white/10 bg-white/[0.03] text-[var(--orchid)] backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3 text-[var(--orchid)]" />
              <span>A Digital Journal</span>
            </span>
            <span className="text-xs text-[var(--text-3)] font-[var(--font-grotesk)] tracking-wider uppercase">
              by Bhavya
            </span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.1, ease: GALAXY_EASING.editorial }}
            className="space-y-3"
          >
            <h1 className="font-[var(--font-instrument-serif)] text-[32px] min-[360px]:text-4xl sm:text-5xl md:text-6xl xl:text-6.5xl text-[#F5F1EA] font-normal tracking-[-0.02em] leading-[1.05] select-none text-balance">
              Some things are easier to{" "}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1EA] via-[#ffffff] to-[var(--orchid)]">
                write
              </span>{" "}
              than say.
            </h1>
            <p className="max-w-xl text-sm sm:text-base md:text-lg text-[#AAA6AF] font-[var(--font-source-serif)] italic leading-relaxed text-balance">
              Stories, fragments, and quiet thoughts from a mind that never quite runs out of words.
            </p>
          </motion.div>

          {/* Primary & Secondary Action Buttons */}
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: 0.2, ease: GALAXY_EASING.editorial }}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <button
              type="button"
              onClick={onScrollToGallery}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#F5F1EA] text-[#000000] font-[var(--font-grotesk)] text-xs sm:text-sm font-medium hover:bg-white hover:shadow-[0_0_24px_rgba(182,107,255,0.35)] active:scale-95 transition-all cursor-pointer group shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
            >
              <span>Explore stories</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-[#AAA6AF] hover:text-[#F5F1EA] font-[var(--font-grotesk)] text-xs sm:text-sm font-medium transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
            >
              <span>A little about me</span>
            </Link>
          </motion.div>

          {/* Featured Story Spotlight Bar */}
          {featuredStory && (
            <motion.div
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3, ease: GALAXY_EASING.editorial }}
              className="pt-4 border-t border-white/[0.08]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.24em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)]">
                  Featured Reading
                </span>
                {featuredStory.category && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#77737E] font-[var(--font-grotesk)]">
                      {featuredStory.category}
                    </span>
                  </>
                )}
                {featuredStory.readingTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#77737E] font-[var(--font-grotesk)]">
                      <Clock className="w-3 h-3" />
                      <span>{featuredStory.readingTime} min</span>
                    </span>
                  </>
                )}
              </div>

              <h2 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-[#F5F1EA] leading-tight group">
                <Link
                  href={`/stories/${featuredStory.slug}`}
                  className="hover:text-[var(--orchid)] transition-colors focus-visible:outline-none"
                >
                  {featuredStory.title}
                </Link>
              </h2>

              {(featuredStory.subtitle || featuredStory.excerpt) && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#AAA6AF] font-[var(--font-source-serif)] italic line-clamp-2 leading-relaxed">
                  {featuredStory.subtitle || featuredStory.excerpt}
                </p>
              )}

              <div className="mt-3">
                <Link
                  href={`/stories/${featuredStory.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-[var(--font-grotesk)] text-[var(--orchid)] hover:text-white transition-colors group cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
                >
                  <span className="font-medium">Read this story</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Cinematic Featured Story Cover on pure black AMOLED canvas */}
        <div className="lg:col-span-5">
          {featuredStory ? (
            <motion.div
              initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.9, delay: 0.25, ease: GALAXY_EASING.editorial }}
              className="relative group"
            >
              {/* Backlight Glow */}
              <div
                className="absolute -inset-4 rounded-[36px] opacity-25 group-hover:opacity-40 transition-opacity duration-700 blur-2xl -z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(182, 107, 255, 0.45) 0%, rgba(142, 91, 206, 0.2) 50%, transparent 75%)",
                }}
              />

              <Link
                href={`/stories/${featuredStory.slug}`}
                aria-label={`Read featured story: ${featuredStory.title}`}
                className="block relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/10 group-hover:border-white/25 bg-[#0D0D10] shadow-[0_24px_60px_rgba(0,0,0,0.9)] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orchid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
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
                        "radial-gradient(circle at 35% 30%, #15151a 0%, #0d0d10 50%, #000000 100%)",
                    }}
                  />
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Bottom Story Tag Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)] drop-shadow-md">
                      Featured Cover
                    </span>
                    <p className="font-[var(--font-instrument-serif)] text-lg sm:text-xl text-[#F5F1EA] drop-shadow-md line-clamp-1">
                      {featuredStory.title}
                    </p>
                  </div>

                  {/* Circular Arrow Button */}
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#F5F1EA] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-white/40 shrink-0 ml-3">
                    <ArrowUpRight className="w-4 h-4 text-[var(--orchid)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : (
            /* Skeleton Placeholder when story is loading */
            <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[28px] sm:rounded-[32px] bg-[#0D0D10] border border-white/10 animate-pulse" />
          )}
        </div>
      </div>
    </section>
  )
}
