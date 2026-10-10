"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface StoryLikeButtonProps {
  slug: string
  hero?: boolean
  className?: string
  showCount?: boolean
}

export function StoryLikeButton({
  slug,
  hero = false,
  className,
  showCount = true,
}: StoryLikeButtonProps) {
  const [count, setCount] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [animating, setAnimating] = useState<boolean>(false)
  const shouldReduceMotion = useReducedMotion()

  // Fetch initial like state and count on mount
  useEffect(() => {
    let isMounted = true

    async function fetchLikeStatus() {
      try {
        const res = await fetch(`/api/stories/${slug}/likes`)
        if (!res.ok) return
        const data = await res.json()
        if (isMounted) {
          setCount(typeof data.count === "number" ? data.count : 0)
          setLiked(!!data.liked)
        }
      } catch {
        // Silently preserve default state on temporary network issue
      }
    }

    if (slug) {
      fetchLikeStatus()
    }

    return () => {
      isMounted = false
    }
  }, [slug])

  const handleToggleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (isPending) return

      // Optimistic update
      const prevLiked = liked
      const prevCount = count
      const nextLiked = !prevLiked
      const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1)

      setLiked(nextLiked)
      setCount(nextCount)
      setIsPending(true)

      try {
        const res = await fetch(`/api/stories/${slug}/likes`, {
          method: nextLiked ? "POST" : "DELETE",
        })

        if (!res.ok) {
          throw new Error("Like request failed")
        }

        const data = await res.json()
        setCount(typeof data.count === "number" ? data.count : nextCount)
        setLiked(!!data.liked)

        // Trigger strawberry burst animation only after backend confirmation on like
        if (nextLiked && !shouldReduceMotion) {
          setAnimating(true)
          setTimeout(() => {
            setAnimating(false)
          }, 650)
        }
      } catch (err) {
        // Rollback to previous state on failure
        setLiked(prevLiked)
        setCount(prevCount)
      } finally {
        setIsPending(false)
      }
    },
    [slug, liked, count, isPending, shouldReduceMotion]
  )

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        type="button"
        onClick={handleToggleLike}
        disabled={isPending}
        aria-label={liked ? `Unlike story (${count} likes)` : `Like story (${count} likes)`}
        aria-pressed={liked}
        title={liked ? "Liked" : "Like story"}
        whileTap={{ scale: shouldReduceMotion ? 1 : 0.92 }}
        animate={
          animating && !shouldReduceMotion
            ? { scale: [1, 1.22, 0.98, 1], transition: { duration: 0.55, ease: "easeOut" } }
            : { scale: 1 }
        }
        className={cn(
          "relative h-11 px-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer font-[var(--font-grotesk)] text-xs font-medium select-none shadow-sm",
          hero
            ? liked
              ? "border border-[#ff3366]/60 text-[#ff3366] bg-[#ff3366]/20 shadow-[0_0_18px_rgba(255,51,102,0.35)]"
              : "border border-white/20 bg-black/35 backdrop-blur-md text-white/85 hover:text-white hover:bg-white/20 hover:border-white/35 active:scale-95"
            : liked
              ? "border border-[#ff3366]/50 text-[#ff3366] bg-[#ff3366]/15 shadow-[0_0_14px_rgba(255,51,102,0.25)]"
              : "border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--text-2)] hover:text-foreground hover:bg-white/10 active:scale-95",
          className
        )}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            liked && "text-[#ff3366]"
          )}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={liked ? 0 : 2}
        />

        {showCount && (
          <span
            className={cn(
              "tracking-wide tabular-nums",
              liked ? "text-[#ff3366] font-semibold" : "text-inherit"
            )}
          >
            {count}
          </span>
        )}
      </motion.button>

      {/* Strawberry Heart Pop Animation (Target duration 400-800ms) */}
      <AnimatePresence>
        {animating && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1.25, 1.1, 0.9],
              y: -24,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-1/2 -top-1 -translate-x-1/2 flex items-center justify-center z-30"
          >
            <span className="text-sm drop-shadow-[0_0_8px_rgba(255,51,102,0.6)]">
              🍓
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
