"use client"

import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

export function GalaxyJourneyLink() {
  return (
    <section className="relative z-10 galaxy-container py-12 border-t border-white/[0.08]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Writing Journey Card */}
        <Link
          href="/writing-journey"
          className="group block relative overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/25 p-6 sm:p-8 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
        >
          <div className="flex items-center gap-2 mb-3 text-[var(--orchid)]">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-medium font-[var(--font-grotesk)]">
              Timeline &amp; Rhythm
            </span>
          </div>
          <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-white group-hover:text-white/95 transition-colors">
            Writing Journey
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-2)] font-[var(--font-source-serif)] italic leading-relaxed">
            A chronological rhythm of reflections, stories, and words written under the moonlight.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-[var(--font-grotesk)] text-[var(--orchid)] font-medium">
            <span>Explore journey</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* About Card */}
        <Link
          href="/about"
          className="group block relative overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/25 p-6 sm:p-8 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
        >
          <div className="flex items-center gap-2 mb-3 text-[var(--cyan-muted)]">
            <User className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-medium font-[var(--font-grotesk)]">
              The Author
            </span>
          </div>
          <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-white group-hover:text-white/95 transition-colors">
            About Bhavya
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-2)] font-[var(--font-source-serif)] italic leading-relaxed">
            Stories, thoughts, and things left unsaid — crafted in a quieter corner of the internet.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-[var(--font-grotesk)] text-[var(--cyan-muted)] font-medium">
            <span>Read about Bhavya</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </section>
  )
}
