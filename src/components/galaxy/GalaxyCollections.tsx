"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, FolderOpen } from "lucide-react"
import {
  COLLECTIONS,
  COLLECTION_ACCENTS,
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
      cover: matching[0]?.coverImage || null,
      accent: COLLECTION_ACCENTS[col] || "var(--orchid)",
    }
  }).filter((c) => c.count > 0)

  if (collectionData.length === 0) return null

  return (
    <section className="relative z-10 galaxy-container py-12 md:py-16">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)] bg-white/5 border border-white/10 mb-2">
            <FolderOpen className="w-3 h-3 text-[var(--cyan-muted)]" />
            <span>Curated Worlds</span>
          </div>
          <h2 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3.5xl text-foreground font-normal tracking-tight">
            Collections
          </h2>
        </div>

        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-2)] hover:text-white transition-colors font-[var(--font-grotesk)] group"
        >
          <span>All collections</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--orchid)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {collectionData.slice(0, 4).map((col, idx) => (
          <Link
            key={col.name}
            href={getCollectionHref(col.name)}
            className="group block relative overflow-hidden rounded-[22px] border border-white/12 bg-white/[0.03] backdrop-blur-md p-5 hover:border-white/30 hover:bg-white/[0.06] transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[var(--orchid)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium font-[var(--font-grotesk)] text-[var(--orchid)]">
                {col.count} {col.count === 1 ? "story" : "stories"}
              </span>
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/15 transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <h3 className="font-[var(--font-instrument-serif)] text-xl sm:text-[22px] text-white leading-tight">
              {col.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
