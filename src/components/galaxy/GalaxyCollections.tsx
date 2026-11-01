"use client"

import Link from "next/link"
import { ArrowUpRight, FolderOpen } from "lucide-react"
import {
  COLLECTIONS,
  COLLECTION_DESCRIPTIONS,
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
      return (
        tags.includes(col.toLowerCase()) ||
        (s.category || "").toLowerCase() === col.toLowerCase()
      )
    })
    return {
      name: col,
      count: matching.length,
      description: COLLECTION_DESCRIPTIONS[col] || "",
      cover: matching[0]?.coverImage || null,
    }
  }).filter((c) => c.count > 0)

  if (collectionData.length === 0) return null

  return (
    <section className="relative z-10 galaxy-container py-12 sm:py-16 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium text-[#8CCDF2] bg-white/10 border border-white/20 backdrop-blur-md mb-2.5 shadow-xs">
            <FolderOpen className="w-3 h-3 text-[#8CCDF2]" />
            <span>Curated Worlds</span>
          </div>
          <h2 className="font-[var(--font-instrument-serif)] text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-tight drop-shadow-sm">
            Collections
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#DCE5EC] font-normal">
            Different worlds, connected by words.
          </p>
        </div>

        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs text-[#DCE5EC] hover:text-white transition-colors group self-start sm:self-auto py-1 font-medium"
        >
          <span>All collections</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#8CCDF2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {collectionData.slice(0, 4).map((col) => (
          <Link
            key={col.name}
            href={getCollectionHref(col.name)}
            className="group block relative overflow-hidden rounded-[26px] border border-white/20 hover:border-white/40 bg-white/[0.10] dark:bg-[#091825]/45 hover:bg-white/[0.16] dark:hover:bg-[#091825]/60 hover:shadow-[0_20px_50px_rgba(9,24,37,0.4),0_0_24px_rgba(140,205,242,0.15)] p-6 sm:p-7 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-[#8CCDF2] cursor-pointer backdrop-blur-xl shadow-[0_16px_40px_rgba(9,24,37,0.35)]"
          >
            {/* Top specular reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* Subtle sky blue edge highlight on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8CCDF2]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8CCDF2]">
                {col.count} {col.count === 1 ? "story" : "stories"}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-white/20 group-hover:border-white/35 transition-all duration-300 shadow-xs">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8CCDF2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <h3 className="font-[var(--font-instrument-serif)] text-2xl text-white leading-tight transition-transform duration-300 group-hover:translate-x-0.5 drop-shadow-sm">
              {col.name}
            </h3>

            {col.description && (
              <p className="mt-2 text-xs text-[#DCE5EC] line-clamp-2 leading-relaxed">
                {col.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
