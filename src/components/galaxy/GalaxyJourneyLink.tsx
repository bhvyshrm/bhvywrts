"use client"

import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

export function GalaxyJourneyLink() {
  return (
    <section className="relative z-10 galaxy-container py-14 sm:py-16 md:py-20 border-t border-white/[0.08]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {/* Writing Journey Card */}
        <Link
          href="/writing-journey"
          className="group block relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D0D10] hover:bg-[#15151A] hover:border-white/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(182,107,255,0.08)] p-6 sm:p-8 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
        >
          <div className="flex items-center gap-2 mb-3 text-[var(--orchid)]">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-medium font-[var(--font-grotesk)]">
              Timeline &amp; Rhythm
            </span>
          </div>
          <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-[#F5F1EA] group-hover:text-white transition-colors">
            Writing Journey
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#AAA6AF] font-[var(--font-source-serif)] italic leading-relaxed">
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
          className="group block relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D0D10] hover:bg-[#15151A] hover:border-white/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(182,107,255,0.08)] p-6 sm:p-8 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
        >
          <div className="flex items-center gap-2 mb-3 text-[var(--orchid)]">
            <User className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-medium font-[var(--font-grotesk)]">
              The Author
            </span>
          </div>
          <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-[#F5F1EA] group-hover:text-white transition-colors">
            About Bhavya
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#AAA6AF] font-[var(--font-source-serif)] italic leading-relaxed">
            Stories, thoughts, and things left unsaid — crafted in a quieter corner of the internet.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-[var(--font-grotesk)] text-[var(--orchid)] font-medium">
            <span>Read about Bhavya</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </section>
  )
}
