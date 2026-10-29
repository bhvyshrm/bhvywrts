"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
        "group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orchid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000] rounded-[24px] sm:rounded-[26px] md:rounded-[28px] overflow-hidden select-none cursor-pointer w-full h-full",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "relative w-full h-full overflow-hidden rounded-[24px] sm:rounded-[26px] md:rounded-[28px] border border-white/10 bg-[#0D0D10] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]",
          "group-hover:border-white/25 group-hover:bg-[#15151A] group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_24px_rgba(182,107,255,0.12)]",
          isActive ? "border-white/30 shadow-[0_28px_70px_rgba(0,0,0,0.95)]" : ""
        )}
      >
        {/* Cover Image Background */}
        <div className="absolute inset-0 bg-[#0a0a0c] overflow-hidden">
          {hasValidImage ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 skeleton bg-white/[0.04]" />}
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
                  "w-full h-full object-cover transform-gpu will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
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
                  "radial-gradient(circle at 30% 25%, #15151a 0%, #0d0d10 50%, #000000 100%)",
              }}
            />
          )}

          {/* Targeted dark gradient overlay: deep at bottom for title contrast, clear at top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 36%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)",
            }}
          />
        </div>

        {/* Title-Only Overlay (Strict Rule: ONLY the story title as text) */}
        <div className="relative z-10 p-5 sm:p-6 md:p-7 flex flex-col justify-end h-full">
          <h2
            className="font-[var(--font-instrument-serif)] text-[#F5F1EA] text-xl sm:text-2xl md:text-[26px] leading-[1.12] font-normal tracking-[-0.01em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] group-hover:text-white transition-colors"
          >
            {story.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}
