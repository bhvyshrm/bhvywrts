"use client"

import { motion } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"
import { GALAXY_EASING } from "./motion"

interface GalaxyHeroProps {
  onScrollToGallery?: () => void
}

export function GalaxyHero({ onScrollToGallery }: GalaxyHeroProps) {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-20 px-4 sm:px-6">
      {/* Eyebrow Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: GALAXY_EASING.editorial }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.24em] font-medium font-[var(--font-grotesk)] border border-white/15 bg-white/5 text-[var(--orchid)] backdrop-blur-md mb-4 sm:mb-6 shadow-xs"
      >
        <Sparkles className="w-3 h-3 text-[var(--cyan-muted)]" />
        <span>A Digital Journal</span>
      </motion.div>

      {/* Brand Title: Bhavya Writes */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: GALAXY_EASING.editorial }}
        className="font-[var(--font-instrument-serif)] text-4xl sm:text-5xl md:text-6.5xl lg:text-7xl text-foreground font-normal tracking-[-0.02em] leading-[1.08] select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
      >
        <span className="bg-gradient-to-b from-white via-[#f5f5f7] to-white/80 bg-clip-text text-transparent">
          Bhavya Writes
        </span>
      </motion.h1>

      {/* Editorial Statement */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: GALAXY_EASING.editorial }}
        className="mt-3 sm:mt-4 max-w-sm sm:max-w-md md:max-w-lg text-[15px] sm:text-base md:text-lg text-[var(--text-2)] font-[var(--font-source-serif)] italic leading-relaxed text-balance"
      >
        A quieter corner of the internet.
      </motion.p>

      {/* Scroll Cue to Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="mt-8 sm:mt-10"
      >
        <button
          type="button"
          onClick={onScrollToGallery}
          aria-label="Scroll to stories gallery"
          className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-[var(--font-grotesk)] text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
        >
          <span className="tracking-widest uppercase text-[10px]">Explore Stories</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-[var(--orchid)]" />
        </button>
      </motion.div>
    </section>
  )
}
