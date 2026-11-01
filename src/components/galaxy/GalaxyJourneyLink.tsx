"use client"

import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

export function GalaxyJourneyLink() {
  return (
    <section className="relative z-10 galaxy-container py-14 sm:py-16 md:py-20 border-t border-white/15">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Writing Journey Card */}
        <Link
          href="/writing-journey"
          className="group block relative overflow-hidden rounded-[28px] border border-white/20 hover:border-white/40 bg-white/[0.10] dark:bg-[#091825]/45 hover:bg-white/[0.16] dark:hover:bg-[#091825]/60 hover:shadow-[0_20px_50px_rgba(9,24,37,0.4),0_0_24px_rgba(140,205,242,0.15)] p-7 sm:p-9 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[#8CCDF2] backdrop-blur-xl shadow-[0_16px_40px_rgba(9,24,37,0.35)]"
        >
          {/* Top specular reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2 mb-3 text-[#8CCDF2]">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold">
              Timeline &amp; Rhythm
            </span>
          </div>
          <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-white group-hover:text-[#F8FBFF] transition-colors drop-shadow-sm">
            Writing Journey
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#DCE5EC] leading-relaxed">
            A chronological rhythm of reflections, stories, and thoughts written along the way.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#8CCDF2] font-medium">
            <span>Explore journey</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* About Card */}
        <Link
          href="/about"
          className="group block relative overflow-hidden rounded-[28px] border border-white/20 hover:border-white/40 bg-white/[0.10] dark:bg-[#091825]/45 hover:bg-white/[0.16] dark:hover:bg-[#091825]/60 hover:shadow-[0_20px_50px_rgba(9,24,37,0.4),0_0_24px_rgba(140,205,242,0.15)] p-7 sm:p-9 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[#8CCDF2] backdrop-blur-xl shadow-[0_16px_40px_rgba(9,24,37,0.35)]"
        >
          {/* Top specular reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2 mb-3 text-[#8CCDF2]">
            <User className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold">
              The Author
            </span>
          </div>
          <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-white group-hover:text-[#F8FBFF] transition-colors drop-shadow-sm">
            About Bhavya
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#DCE5EC] leading-relaxed">
            Stories, thoughts, and things left unsaid — crafted in a quieter corner of the internet.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#8CCDF2] font-medium">
            <span>Read about Bhavya</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </section>
  )
}
