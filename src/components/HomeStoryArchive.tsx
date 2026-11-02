"use client"

import { HomeStoryCard } from "./HomeStoryCard"
import type { Story } from "@/types"

interface HomeStoryArchiveProps {
  stories: Story[]
  loading?: boolean
}

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/10 bg-[#091825]/50 animate-pulse">
      <div className="aspect-[16/10] w-full bg-white/[0.04]" />
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="h-3 w-28 bg-white/[0.08] rounded-full mb-3" />
          <div className="h-6 w-3/4 bg-white/[0.08] rounded-md mb-2" />
          <div className="h-3.5 w-full bg-white/[0.04] rounded-md mb-1.5" />
          <div className="h-3.5 w-2/3 bg-white/[0.04] rounded-md" />
        </div>
        <div className="pt-3.5 border-t border-white/5 flex items-center justify-between">
          <div className="h-3 w-16 bg-white/[0.06] rounded-full" />
          <div className="h-3 w-3 bg-white/[0.06] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function HomeStoryArchive({ stories, loading = false }: HomeStoryArchiveProps) {
  return (
    <section
      aria-label="Story archive"
      className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24"
    >
      {/* 1. Minimal Archive Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 md:mb-16">
        <h1 className="font-[var(--font-instrument-serif)] text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight drop-shadow-sm">
          Stories
        </h1>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-[#DCE5EC]/80 font-normal tracking-wide">
          Words, collected over time.
        </p>
      </div>

      {/* 2. Responsive Story Cards Grid: 1-col on mobile, 2-col on tablet, 3-col on desktop */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {stories.map((story, index) => (
            <HomeStoryCard
              key={story.id}
              story={story}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-sm text-[#DCE5EC]/60">No published stories yet.</p>
        </div>
      )}
    </section>
  )
}
