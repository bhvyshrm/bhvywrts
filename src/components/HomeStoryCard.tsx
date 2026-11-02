"use client"

import { useState, useMemo, memo } from "react"
import Link from "next/link"
import { Clock, ArrowUpRight, BookOpen } from "lucide-react"
import { parseStoryTags } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Story } from "@/types"

interface HomeStoryCardProps {
  story: Story
  priority?: boolean
}

export const HomeStoryCard = memo(function HomeStoryCard({
  story,
  priority = false,
}: HomeStoryCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const { coverPos } = useMemo(
    () => parseStoryTags(story.tags || ""),
    [story.tags]
  )

  const readingTime =
    story.readingTime ||
    (story.wordCount ? Math.max(1, Math.ceil(story.wordCount / 200)) : 4)

  const formattedDate = useMemo(() => {
    try {
      return new Date(story.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return ""
    }
  }, [story.createdAt])

  const hasImage = Boolean(story.coverImage && !imageFailed)

  return (
    <Link
      href={`/stories/${encodeURIComponent(story.slug.trim())}`}
      aria-label={`Read story: ${story.title}`}
      className="group flex flex-col h-full rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/15 bg-[#091825]/65 hover:bg-[#091825]/85 hover:border-white/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#8CCDF2] focus-visible:outline-offset-2 backdrop-blur-md max-md:backdrop-blur-none hover:shadow-[0_20px_50px_rgba(9,24,37,0.5)] md:hover:-translate-y-1 select-none"
    >
      {/* 1. Cover Image or Visual Coastal Motif */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#091825] shrink-0 border-b border-white/10">
        {/* Subtle Specular Top Reflection */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />

        {hasImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton bg-white/[0.06] animate-pulse" />
            )}
            <img
              src={story.coverImage!}
              alt=""
              role="presentation"
              width={600}
              height={375}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.03]",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              style={
                coverPos
                  ? { objectPosition: `${coverPos.x}% ${coverPos.y}%` }
                  : undefined
              }
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(18, 61, 90, 0.65) 0%, rgba(9, 24, 37, 0.95) 100%)",
            }}
          >
            <BookOpen className="w-8 h-8 text-[#8CCDF2]/30" />
          </div>
        )}

        {/* Ambient Vignette for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091825]/90 via-black/20 to-black/25 pointer-events-none" />

        {/* Category Badge & Action Arrow Overlaid on Image */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none z-10">
          {story.category ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.18em] font-medium text-[#8CCDF2] bg-[#091825]/85 border border-white/20 backdrop-blur-xs shadow-xs pointer-events-auto">
              {story.category}
            </span>
          ) : (
            <span />
          )}

          <div
            aria-hidden="true"
            className="w-7 h-7 rounded-full bg-[#091825]/60 border border-white/20 flex items-center justify-center text-white/80 group-hover:text-white group-hover:border-white/40 group-hover:bg-[#091825]/85 transition-all pointer-events-auto shadow-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8CCDF2] transition-transform md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* 2. Story Details & Excerpt */}
      <div className="flex flex-col flex-1 justify-between p-5 sm:p-5.5">
        <div>
          {/* Metadata line: Reading Time & Publication Date */}
          <div className="flex items-center gap-2 text-[11px] text-[#DCE5EC]/70 font-[var(--font-grotesk)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#8CCDF2]" />
              <span>{readingTime} min read</span>
            </span>
            {formattedDate && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/25" />
                <span>{formattedDate}</span>
              </>
            )}
          </div>

          {/* Story Title */}
          <h2 className="font-[var(--font-instrument-serif)] text-2xl sm:text-[25px] text-white font-normal leading-[1.22] tracking-tight group-hover:text-[#F8FBFF] mt-2.5 transition-colors line-clamp-2">
            {story.title}
          </h2>

          {/* Story Excerpt if present */}
          {story.excerpt && (
            <p className="text-xs sm:text-[13px] text-[#DCE5EC]/85 leading-relaxed line-clamp-2 mt-2 font-[var(--font-source-serif)] font-normal">
              {story.excerpt}
            </p>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-medium text-[#8CCDF2] group-hover:text-white transition-colors font-[var(--font-grotesk)]">
          <span>Read story</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  )
})
