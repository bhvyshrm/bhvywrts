"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { parseStoryTags } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { getStoryHref } from "./routes"
import { GALAXY_EASING } from "./motion"
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

  const { coverPos } = useMemo(
    () => parseStoryTags(story.tags || ""),
    [story.tags]
  )

  const href = getStoryHref(story.slug)

  return (
    <Link
      href={href}
      aria-label={`Read story: ${story.title}`}
      className={cn(
        "group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orchid)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030306] rounded-[24px] sm:rounded-[28px] overflow-hidden select-none cursor-pointer",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "relative w-full h-full overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover:border-white/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)]",
          isActive ? "border-white/30 shadow-[0_24px_60px_rgba(0,0,0,0.7)]" : ""
        )}
      >
        {/* Cover Image Background */}
        <div className="absolute inset-0 bg-[#070811] overflow-hidden">
          {story.coverImage ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 skeleton" />}
              <img
                src={story.coverImage}
                alt=""
                role="presentation"
                loading={priority || index < 2 ? "eager" : "lazy"}
                fetchPriority={priority || index === 0 ? "high" : "auto"}
                decoding="async"
                onLoad={() => setImageLoaded(true)}
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
              className="w-full h-full"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 30%, #17112b 0%, #0b1022 50%, #030306 90%)",
              }}
            />
          )}

          {/* Targeted dark gradient overlay: deep at bottom for title contrast, clear at top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(3, 3, 6, 0.92) 0%, rgba(3, 3, 6, 0.55) 32%, rgba(3, 3, 6, 0.12) 65%, transparent 100%)",
            }}
          />
        </div>

        {/* Title-Only Overlay (Strict Rule: ONLY the story title as text) */}
        <div className="relative z-10 p-5 sm:p-6 md:p-7 flex flex-col justify-end h-full">
          <h2
            className="font-[var(--font-instrument-serif)] text-white text-xl sm:text-2xl md:text-[26px] leading-[1.12] font-normal tracking-[-0.01em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] group-hover:text-white transition-colors"
          >
            {story.title}
          </h2>
        </div>
      </div>
    </Link>
  )
}
