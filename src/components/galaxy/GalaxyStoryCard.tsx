"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { parseStoryTags } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { getStoryHref } from "./routes"
import type { GalaxyStoryItem } from "./types"

interface GalaxyStoryCardProps {
  story: GalaxyStoryItem
  index?: number
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  isActive?: boolean
}

export function GalaxyStoryCard({
  story,
  index = 0,
  priority = false,
  className,
  style,
  isActive = false,
}: GalaxyStoryCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const { coverPos } = useMemo(
    () => parseStoryTags(story.tags || ""),
    [story.tags]
  )

  const hasValidImage = Boolean(story.coverImage && !imageFailed)
  const href = getStoryHref(story.slug)

  return (
    <Link
      href={href}
      aria-label={`Read story: ${story.title}`}
      className={cn(
        "group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8CCDF2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#091825] rounded-[24px] sm:rounded-[28px] overflow-hidden select-none cursor-pointer w-full h-full",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "relative w-full h-full overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "bg-white/[0.10] dark:bg-[#091825]/45 backdrop-blur-xl",
          "shadow-[0_16px_40px_rgba(9,24,37,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)]",
          "group-hover:border-white/40 group-hover:bg-white/[0.16] dark:group-hover:bg-[#091825]/60 group-hover:shadow-[0_24px_60px_rgba(9,24,37,0.45),0_0_24px_rgba(140,205,242,0.18)]",
          "active:scale-[0.98]",
          isActive ? "border-white/50 shadow-[0_28px_70px_rgba(9,24,37,0.55)]" : ""
        )}
      >
        {/* Top Edge Specular Reflection */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

        {/* Cover Image Background */}
        <div className="absolute inset-0 bg-[#091825] overflow-hidden">
          {hasValidImage ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 skeleton bg-white/[0.06]" />}
              <img
                src={story.coverImage!}
                alt=""
                role="presentation"
                loading={priority || index < 2 ? "eager" : "lazy"}
                fetchPriority={priority || index === 0 ? "high" : "auto"}
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
                className={cn(
                  "w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]",
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
              className="w-full h-full relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(23, 107, 156, 0.45) 0%, rgba(9, 24, 37, 0.85) 100%)",
              }}
            />
          )}

          {/* Liquid coastal dark gradient for guaranteed title contrast over bright sky or waves */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(9, 24, 37, 0.95) 0%, rgba(9, 24, 37, 0.55) 40%, rgba(9, 24, 37, 0.15) 75%, transparent 100%)",
            }}
          />
        </div>

        {/* Floating Coastal Header Pill */}
        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
          {story.category ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium border border-white/20 bg-white/10 text-[#8CCDF2] backdrop-blur-md shadow-xs">
              {story.category}
            </span>
          ) : (
            <span className="w-1 h-1" />
          )}

          {/* Frosted Action Arrow Indicator */}
          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 group-hover:text-white group-hover:bg-white/25 group-hover:border-white/40 transition-all duration-300 shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8CCDF2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Minimal Editorial Title Overlay */}
        <div className="relative z-10 p-5 sm:p-6 md:p-7 flex flex-col justify-end h-[calc(100%-60px)]">
          <h2
            className="font-[var(--font-instrument-serif)] text-white text-xl sm:text-2xl md:text-[25px] leading-[1.15] font-normal tracking-[-0.015em] drop-shadow-[0_2px_14px_rgba(9,24,37,0.95)] group-hover:text-[#F8FBFF] transition-colors"
          >
            {story.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}
