"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, FolderOpen } from "lucide-react"
import {
  COLLECTIONS,
  COLLECTION_ACCENTS,
  COLLECTION_DESCRIPTIONS,
  type CollectionType,
} from "@/lib/constants"
import { getCollectionHref } from "./routes"
import type { Story } from "@/types"

interface GalaxyCollectionsProps {
  stories: Story[]
}

export function GalaxyCollections({ stories }: GalaxyCollectionsProps) {
  // Aggregate real stories per collection
  const collectionData = COLLECTIONS.map((col) => {
    const matching = stories.filter((s) => {
      const tags = (s.tags || "").toLowerCase()
      return tags.includes(col.toLowerCase()) || (s.category || "").toLowerCase() === col.toLowerCase()
    })
    return {
      name: col,
      count: matching.length,
      description: COLLECTION_DESCRIPTIONS[col] || "",
      cover: matching[0]?.coverImage || null,
      accent: COLLECTION_ACCENTS[col] || "var(--orchid)",
    }
  }).filter((c) => c.count > 0)

  if (collectionData.length === 0) return null

  return (
    <section className="relative z-10 galaxy-container py-12 sm:py-16 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)] bg-white/[0.03] border border-white/10 mb-2.5">
            <FolderOpen className="w-3 h-3 text-[var(--orchid)]" />
            <span>Curated Worlds</span>
          </div>
          <h2 className="font-[var(--font-instrument-serif)] text-3xl sm:text-4xl text-[#F5F1EA] font-normal tracking-tight">
            Collections
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#AAA6AF] font-[var(--font-source-serif)] italic">
            Stories connected by a mood, a memory, or a season of life.
          </p>
        </div>

        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs text-[#AAA6AF] hover:text-[#F5F1EA] transition-colors font-[var(--font-grotesk)] group self-start sm:self-auto py-1"
        >
          <span>All collections</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--orchid)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {collectionData.slice(0, 4).map((col) => (
          <Link
            key={col.name}
            href={getCollectionHref(col.name)}
            className="group block relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D0D10] hover:bg-[#15151A] hover:border-white/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(182,107,255,0.08)] p-6 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[var(--orchid)] cursor-pointer"
          >
            {/* Subtle lavender edge highlight on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--orchid)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)]">
                {col.count} {col.count === 1 ? "story" : "stories"}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--orchid)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <h3 className="font-[var(--font-instrument-serif)] text-2xl text-[#F5F1EA] leading-tight transition-transform duration-300 group-hover:translate-x-0.5">
              {col.name}
            </h3>

            {col.description && (
              <p className="mt-2 text-xs text-[#AAA6AF] font-[var(--font-source-serif)] italic line-clamp-2 leading-relaxed">
                {col.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
