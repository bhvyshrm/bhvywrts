"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Maximize2,
  Minimize2,
  ArrowRight,
  Lock,
  Eye,
  Loader2,
  Check,
  Sparkles,
  Mail,
  Rss,
  ListOrdered,
  BookOpen,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ReadingProgress } from "@/components/ReadingProgress"
import { FloatingWriteButton } from "@/components/FloatingWriteButton"
import { StoryLikeButton } from "@/components/StoryLikeButton"
import { FeedbackDialog } from "@/components/FeedbackDialog"
import { formatDate, cn } from "@/lib/utils"
import { useAmbientStore } from "@/lib/store"
import { parseStoryTags, MOOD_COLORS, type Mood } from "@/lib/constants"
import type { Story } from "@/types"

export interface HeadingItem {
  id: string
  text: string
  level: number
}

export function extractHeadingsAndEnhanceContent(html: string): {
  headings: HeadingItem[]
  enhancedHtml: string
} {
  if (!html) return { headings: [], enhancedHtml: "" }

  const headings: HeadingItem[] = []
  let count = 0

  const enhancedHtml = html.replace(
    /<(h[2-3])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs, content) => {
      const cleanText = content.replace(/<[^>]*>/g, "").trim()
      if (!cleanText) return match

      count++
      const idMatch = attrs.match(/id=["']([^"']+)["']/i)
      const id = idMatch ? idMatch[1] : `section-${count}`
      const level = parseInt(tag.charAt(1), 10)

      headings.push({ id, text: cleanText, level })

      if (idMatch) return match
      return `<${tag}${attrs} id="${id}">${content}</${tag}>`
    }
  )

  return { headings, enhancedHtml }
}

function getRecommendedStories(
  currentStory: Story,
  allStories: Story[],
  limit = 3
): Story[] {
  const currentTags = parseStoryTags(currentStory.tags || "")
  const candidates = allStories.filter(
    (s) => s.slug !== currentStory.slug && s.published !== false
  )

  const scored = candidates.map((story) => {
    let score = 0
    const tags = parseStoryTags(story.tags || "")

    if (
      story.category &&
      currentStory.category &&
      story.category.toLowerCase() === currentStory.category.toLowerCase()
    ) {
      score += 4
    }
    if (
      tags.collection &&
      currentTags.collection &&
      tags.collection.toLowerCase() === currentTags.collection.toLowerCase()
    ) {
      score += 3
    }
    if (
      tags.mood &&
      currentTags.mood &&
      tags.mood.toLowerCase() === currentTags.mood.toLowerCase()
    ) {
      score += 2
    }
    if (story.coverImage) {
      score += 1
    }

    return { story, score }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return (
      new Date(b.story.createdAt).getTime() -
      new Date(a.story.createdAt).getTime()
    )
  })

  return scored.slice(0, limit).map((s) => s.story)
}

function ShareButton({
  title,
  slug,
  hero = false,
}: {
  title: string
  slug: string
  hero?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/stories/${slug}`
      : ""

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {})
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share story"
      title={copied ? "Link copied!" : "Share story"}
      className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8CCDF2]",
        hero
          ? "border border-white/20 bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-white/20 hover:border-white/40 active:scale-95 shadow-sm"
          : "border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--text-2)] hover:text-foreground hover:bg-white/10 active:scale-95 shadow-sm"
      )}
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#8CCDF2]" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
    </button>
  )
}

function BookmarkButton({
  id,
  hero = false,
}: {
  id: string
  hero?: boolean
}) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = JSON.parse(localStorage.getItem("bhavy-bookmarks") || "[]")
      setBookmarked(saved.includes(id))
    } catch {}
  }, [id])

  const toggle = () => {
    try {
      const saved: string[] = JSON.parse(
        localStorage.getItem("bhavy-bookmarks") || "[]"
      )
      const next = bookmarked
        ? saved.filter((s: string) => s !== id)
        : [...saved, id]

      localStorage.setItem("bhavy-bookmarks", JSON.stringify(next))
      setBookmarked(!bookmarked)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark story"}
      aria-pressed={bookmarked}
      title={bookmarked ? "Bookmarked" : "Bookmark"}
      className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8CCDF2]",
        hero
          ? bookmarked
            ? "border border-[#8CCDF2]/60 text-[#8CCDF2] bg-[#8CCDF2]/25 shadow-[0_0_16px_rgba(140,205,242,0.35)]"
            : "border border-white/20 bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-white/20 hover:border-white/40 active:scale-95 shadow-sm"
          : bookmarked
            ? "border border-[#8CCDF2]/50 text-[#8CCDF2] bg-[#8CCDF2]/15 shadow-[0_0_12px_rgba(140,205,242,0.25)]"
            : "border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--text-2)] hover:text-foreground hover:bg-white/10 active:scale-95 shadow-sm"
      )}
    >
      <Bookmark
        className="w-4 h-4"
        fill={bookmarked ? "currentColor" : "none"}
      />
    </button>
  )
}

function LockedStory({
  story,
  slug,
  onUnlocked,
}: {
  story: Partial<Story>
  slug: string
  onUnlocked: () => void
}) {
  const [password, setPassword] = useState("")
  const [unlocking, setUnlocking] = useState(false)
  const [error, setError] = useState("")

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      setError("Please enter the password.")
      return
    }

    setUnlocking(true)
    setError("")

    try {
      const res = await fetch(`/api/stories/${slug}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Incorrect password.")
        setUnlocking(false)
        return
      }

      setPassword("")
      onUnlocked()
    } catch {
      setError("Something went wrong. Please try again.")
      setUnlocking(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#000000] text-[#F8FBFF]">
      <Navbar />

      <main id="main-content" className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Link
            href="/stories"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-2)] hover:text-foreground transition-colors mb-7 font-[var(--font-grotesk)]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>All stories</span>
          </Link>

          <div className="bg-[#070709] rounded-[32px] p-8 md:p-11 text-center relative overflow-hidden border border-white/10 shadow-2xl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative mx-auto w-16 h-16 rounded-full border border-white/25 bg-black/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(232,121,249,0.25)]"
            >
              <Lock className="w-6 h-6 text-[#8CCDF2]" />
            </motion.div>

            <p className="text-[10px] uppercase tracking-[0.24em] text-[#8CCDF2] font-[var(--font-grotesk)] mb-3 font-medium">
              Private Story
            </p>

            <h1 className="font-[var(--font-instrument-serif)] text-3xl md:text-3.5xl text-foreground leading-tight">
              {story.title || "This story is private"}
            </h1>

            {story.subtitle && (
              <p className="mt-2.5 text-sm text-[var(--text-2)] font-[var(--font-source-serif)] italic leading-relaxed">
                {story.subtitle}
              </p>
            )}

            <p className="mt-4 text-xs sm:text-sm text-[var(--text-3)] leading-relaxed max-w-sm mx-auto font-[var(--font-source-serif)]">
              This entry is protected with a password. Enter it below to unlock and read.
            </p>

            <form onSubmit={handleUnlock} className="mt-7">
              <div className="relative">
                <Eye className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError("")
                  }}
                  placeholder="Enter story password"
                  autoComplete="current-password"
                  className={cn(
                    "w-full h-12 rounded-full border glass-pill pl-11 pr-5 text-sm text-foreground outline-none transition-all font-[var(--font-grotesk)]",
                    "placeholder:text-[var(--text-3)]",
                    "focus:border-[#8CCDF2]/70 focus:ring-4 focus:ring-[#8CCDF2]/15",
                    error ? "border-red-400/50" : "border-white/20"
                  )}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-red-400 mt-2.5 text-center font-[var(--font-grotesk)]"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={unlocking}
                className={cn(
                  "w-full h-12 mt-4 rounded-full font-[var(--font-grotesk)] text-sm font-medium",
                  "flex items-center justify-center gap-2 cursor-pointer",
                  "transition-all duration-300 shadow-md",
                  "bg-foreground text-background",
                  "hover:opacity-90 active:scale-98",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {unlocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#8CCDF2]" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Unlock Story</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[10px] text-[var(--text-3)] leading-relaxed font-[var(--font-grotesk)]">
                This story is private and accessible only with the key from the author.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

function StoryHero({
  story,
  tags,
  readingMode,
  onReadingMode,
  onOpenFeedback,
}: {
  story: Story
  tags: { mood?: string; collection?: string; accent?: string; coverPos?: { x: number; y: number } }
  readingMode: boolean
  onReadingMode: () => void
  onOpenFeedback: () => void
}) {
  return (
    <header className="relative w-full bg-[#000000] text-[#F8FBFF] pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 border-b border-white/10">
      <div className="max-w-[1560px] 2xl:max-w-[1740px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Editorial Back to Stories Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/stories"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#DCE5EC]/70 hover:text-white transition-colors duration-200 font-[var(--font-grotesk)] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-[#8CCDF2]" />
            <span>Back to stories</span>
          </Link>
        </div>

        <div className="max-w-4xl">
          {/* Category, Mood, Collection Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {story.category && (
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium font-[var(--font-grotesk)] px-3 py-1 rounded-full border border-white/15 text-[#8CCDF2] bg-white/[0.04]">
                {story.category}
              </span>
            )}

            {tags.mood && (
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium font-[var(--font-grotesk)] px-3 py-1 rounded-full border border-white/10 text-[#DCE5EC]/80 bg-white/[0.02]">
                {tags.mood}
              </span>
            )}

            {tags.collection && (
              <Link
                href={`/collections/${encodeURIComponent(tags.collection.toLowerCase())}`}
                className="text-[10px] uppercase tracking-[0.2em] font-medium font-[var(--font-grotesk)] px-3 py-1 rounded-full border border-white/15 text-[#DCE5EC] hover:text-white hover:border-white/30 bg-white/[0.04] transition-colors"
              >
                {tags.collection}
              </Link>
            )}
          </div>

          {/* Editorial Title */}
          <h1 className="font-[var(--font-instrument-serif)] text-3xl sm:text-4.5xl md:text-5xl lg:text-[56px] leading-[1.08] text-white tracking-tight">
            {story.title}
          </h1>

          {/* Subtitle */}
          {story.subtitle && (
            <p className="mt-3 text-base sm:text-lg md:text-xl text-[#DCE5EC]/85 font-[var(--font-source-serif)] italic leading-relaxed max-w-2xl">
              {story.subtitle}
            </p>
          )}

          {/* Meta & Actions Row */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#667B8C] font-[var(--font-grotesk)]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 tracking-wide">
              <span>{formatDate(story.createdAt)}</span>
              <span className="text-white/20">&middot;</span>
              <span className="inline-flex items-center gap-1 text-[#DCE5EC]/80">
                <Clock className="w-3.5 h-3.5 text-[#8CCDF2]" />
                {story.readingTime || 5} min read
              </span>
              <span className="text-white/20">&middot;</span>
              <span className="text-[#DCE5EC] font-medium">by Bhavya</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <StoryLikeButton slug={story.slug} hero />
              <BookmarkButton id={story.id} hero />
              <button
                type="button"
                onClick={onOpenFeedback}
                aria-label="Write to the Author"
                title="Write to the Author"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 text-[#DCE5EC] hover:text-white hover:bg-white/10 hover:border-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8CCDF2]"
              >
                <Mail className="w-4 h-4 text-[#8CCDF2]" />
              </button>
              <ShareButton title={story.title} slug={story.slug} hero />
              {!readingMode && (
                <button
                  type="button"
                  onClick={onReadingMode}
                  aria-label="Enter reading mode"
                  title="Reading mode"
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 text-[#DCE5EC] hover:text-white hover:bg-white/10 hover:border-white/30 flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-[#8CCDF2]"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Framed Cover Image (When present, framed as a clean photo without full-bleed background takeover) */}
        {story.coverImage && (
          <div className="mt-8 max-w-4xl rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 aspect-[16/9] sm:aspect-[21/9] bg-[#050505] relative">
            <img
              src={story.coverImage}
              alt={story.title}
              width={1600}
              height={900}
              className="w-full h-full object-cover"
              style={
                tags.coverPos
                  ? { objectPosition: `${tags.coverPos.x}% ${tags.coverPos.y}%` }
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </header>
  )
}

export function StoryDetailView({
  initialStory,
  lockedStory: initialLockedStory = null,
  slug,
  allStories = [],
}: {
  initialStory: Story | null
  lockedStory?: Partial<Story> | null
  slug: string
  allStories?: Story[]
}) {
  const [story, setStory] = useState<Story | null>(initialStory)
  const [lockedStory, setLockedStory] = useState<Partial<Story> | null>(
    initialLockedStory
  )
  const [readingMode, setReadingMode] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [activeHeadingId, setActiveHeadingId] = useState<string>("")
  const setBgImage = useAmbientStore((s) => s.setBgImage)

  // Clear ambient background on story pages so pure AMOLED black is guaranteed
  useEffect(() => {
    setBgImage(null)
    return () => {
      setBgImage(null)
    }
  }, [setBgImage])

  // Lock document and body background to pure AMOLED black (#000000)
  useEffect(() => {
    if (typeof document === "undefined") return
    const prevHtmlBg = document.documentElement.style.backgroundColor
    const prevBodyBg = document.body.style.backgroundColor
    document.documentElement.style.backgroundColor = "#000000"
    document.body.style.backgroundColor = "#000000"
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg
      document.body.style.backgroundColor = prevBodyBg
    }
  }, [])

  // Track reading history locally
  useEffect(() => {
    if (typeof window === "undefined" || !slug) return
    try {
      const history: string[] = JSON.parse(
        localStorage.getItem("bhavy-reading-history") || "[]"
      )
      const updated = [slug, ...history.filter((s) => s !== slug)].slice(0, 10)
      localStorage.setItem("bhavy-reading-history", JSON.stringify(updated))
    } catch {}
  }, [slug])

  // Extract headings and inject IDs for Table of Contents
  const { headings, enhancedHtml } = useMemo(() => {
    return extractHeadingsAndEnhanceContent(story?.content || "")
  }, [story?.content])

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length < 2) return

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeadingId(headings[i].id)
          return
        }
      }
      if (headings[0]) setActiveHeadingId(headings[0].id)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  const tags = useMemo(() => parseStoryTags(story?.tags || ""), [story?.tags])

  // Recommended stories for the sidebar
  const recommendedStories = useMemo(() => {
    if (!story) return []
    return getRecommendedStories(story, allStories, 3)
  }, [story, allStories])

  // Derive Previous & Next stories
  const { prevStory, nextStory } = useMemo(() => {
    if (!allStories || allStories.length === 0 || !story) {
      return { prevStory: null, nextStory: null }
    }
    const index = allStories.findIndex((s) => s.slug === story.slug)
    if (index === -1) return { prevStory: null, nextStory: null }

    return {
      prevStory: index < allStories.length - 1 ? allStories[index + 1] : null,
      nextStory: index > 0 ? allStories[index - 1] : null,
    }
  }, [allStories, story])

  const handleReadingMode = useCallback(() => {
    setReadingMode((m) => !m)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  const reloadUnlockedStory = useCallback(async () => {
    try {
      const res = await fetch(`/api/stories/${slug}`)
      const data = await res.json()
      if (res.ok && data && !data.error) {
        setLockedStory(null)
        setStory(data)
      }
    } catch {}
  }, [slug])

  if (lockedStory) {
    return (
      <LockedStory
        story={lockedStory}
        slug={slug}
        onUnlocked={reloadUnlockedStory}
      />
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#F8FBFF]">
        <Navbar />
        <main id="main-content" className="pt-36 max-w-xl mx-auto px-6 py-20 text-center">
          <div className="bg-[#070709] rounded-[32px] p-10 border border-white/10 shadow-xl">
            <h1 className="text-3xl font-[var(--font-instrument-serif)] text-white">
              Story not found
            </h1>
            <p className="mt-3 text-sm text-[#667B8C] font-[var(--font-source-serif)]">
              The story you are looking for may have been moved or unpublished.
            </p>
            <Link
              href="/stories"
              className="text-xs uppercase tracking-[0.18em] text-[#8CCDF2] hover:opacity-80 mt-6 inline-block font-[var(--font-grotesk)] font-medium"
            >
              ← Back to stories
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen relative bg-[#000000] text-[#F8FBFF]", readingMode && "reading-mode")}>
      <ReadingProgress />
      {!readingMode && <Navbar />}

      {/* Floating Reading Mode Toggle Pill */}
      <AnimatePresence>
        {readingMode && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="glass-strong rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl border border-white/25 backdrop-blur-2xl">
              <span className="text-[11px] text-[var(--text-2)] font-[var(--font-grotesk)] tracking-wider uppercase font-medium">
                Reading Mode
              </span>
              <button
                type="button"
                onClick={handleReadingMode}
                className="text-[11px] text-foreground hover:opacity-80 transition-opacity font-[var(--font-grotesk)] flex items-center gap-1.5 cursor-pointer font-medium"
                aria-label="Exit reading mode"
              >
                <Minimize2 className="w-3.5 h-3.5 text-[#8CCDF2]" />
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="relative">
        {/* HERO: Full-Width Cover Image with Prominent Aurora Glass Header Panel */}
        {!readingMode ? (
          <StoryHero
            story={story}
            tags={tags}
            readingMode={readingMode}
            onReadingMode={handleReadingMode}
            onOpenFeedback={() => setFeedbackOpen(true)}
          />
        ) : (
          /* Minimal Header in Reading Mode */
          <header className="max-w-[760px] mx-auto px-5 sm:px-6 md:px-0 pt-24 pb-8 border-b border-[var(--glass-border)]">
            <h1 className="font-[var(--font-instrument-serif)] text-3xl sm:text-4.5xl text-foreground leading-tight">
              {story.title}
            </h1>
            {story.subtitle && (
              <p className="mt-2 text-base text-[var(--text-2)] font-[var(--font-source-serif)] italic">
                {story.subtitle}
              </p>
            )}
            <div className="mt-4 text-xs text-[var(--text-3)] font-[var(--font-grotesk)] flex items-center gap-2">
              <span>{formatDate(story.createdAt)}</span>
              <span>·</span>
              <span>{story.readingTime || 5} min read</span>
            </div>
          </header>
        )}

        {/* ========================================================= */}
        {/* TWO-COLUMN DESKTOP (>=1024px) / SINGLE COLUMN MOBILE       */}
        {/* ========================================================= */}
        <div className="max-w-[1560px] 2xl:max-w-[1740px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-8 md:pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            {/* LEFT COLUMN: ARTICLE READING SURFACE (65–70% width) */}
            <div className="lg:col-span-8 min-w-0">
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: readingMode ? 0 : 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "bg-[#000000] text-[#F8FBFF] py-2 md:py-4 relative border-0 shadow-none",
                  readingMode && "max-w-[780px] mx-auto"
                )}
              >
                {/* Story Prose Body with readable measure */}
                <div
                  className={cn(
                    "reading-prose max-w-[760px] mx-auto text-[#E6EFF7]",
                    readingMode && "reading-prose-large"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: enhancedHtml || "",
                  }}
                />

                {/* Minimal Editorial Signature */}
                <div className="mt-16 md:mt-24 pt-10 border-t border-white/10 text-center max-w-[760px] mx-auto">
                  <p className="font-[var(--font-instrument-serif)] italic text-lg md:text-xl text-[#DCE5EC]/80 leading-relaxed max-w-md mx-auto">
                    Thank you for reading this far.
                  </p>
                  <p className="font-[var(--font-great-vibes)] text-3.5xl md:text-4.5xl gradient-logo mt-4">
                    Bhavya
                  </p>

                  {/* Story Appreciation & Private Writer Feedback Bar */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
                    <StoryLikeButton slug={story.slug} />
                    <button
                      type="button"
                      onClick={() => setFeedbackOpen(true)}
                      aria-label="Write to the Author"
                      className="h-11 px-5 rounded-full border border-white/15 bg-white/5 text-[#DCE5EC] hover:text-white hover:bg-white/10 hover:border-white/30 flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 text-xs font-[var(--font-grotesk)] font-medium focus-visible:outline-2 focus-visible:outline-[#8CCDF2]"
                    >
                      <Mail className="w-4 h-4 text-[#8CCDF2]" />
                      <span>Write to the Author</span>
                    </button>
                  </div>
                </div>
              </motion.article>

              {/* MOBILE ONLY: Continue Reading & More Stories below article */}
              {!readingMode && (
                <div className="lg:hidden mt-10 space-y-8">
                  {/* Previous / Next story navigation on mobile */}
                  {(prevStory || nextStory) && (
                    <nav
                      aria-label="Story navigation"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {prevStory ? (
                        <Link
                          href={`/stories/${prevStory.slug}`}
                          className="group block p-5 rounded-[22px] bg-[#070709] border border-white/10 hover:border-white/20 transition-all shadow-md"
                        >
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#667B8C] group-hover:text-[#8CCDF2] transition-colors font-[var(--font-grotesk)] font-medium">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                            Previous story
                          </span>
                          <span className="font-[var(--font-instrument-serif)] text-lg text-[#F8FBFF] group-hover:text-[#8CCDF2] transition-colors mt-2 block line-clamp-2 leading-snug">
                            {prevStory.title}
                          </span>
                        </Link>
                      ) : (
                        <div />
                      )}

                      {nextStory && (
                        <Link
                          href={`/stories/${nextStory.slug}`}
                          className="group block p-5 rounded-[22px] bg-[#070709] border border-white/10 hover:border-white/20 transition-all text-left sm:text-right shadow-md"
                        >
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#667B8C] group-hover:text-[#8CCDF2] transition-colors font-[var(--font-grotesk)] font-medium">
                            Next story
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                          <span className="font-[var(--font-instrument-serif)] text-lg text-[#F8FBFF] group-hover:text-[#8CCDF2] transition-colors mt-2 block line-clamp-2 leading-snug">
                            {nextStory.title}
                          </span>
                        </Link>
                      )}
                    </nav>
                  )}

                  {/* More from bhvy. on mobile */}
                  {recommendedStories.length > 0 && (
                    <section className="pt-6">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                        <h3 className="text-sm font-[var(--font-grotesk)] uppercase tracking-wider text-[#DCE5EC]/80 font-medium">
                          More from bhvy.
                        </h3>
                        <Link
                          href="/stories"
                          className="text-xs text-[#8CCDF2] hover:underline font-[var(--font-grotesk)]"
                        >
                          Browse all →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {recommendedStories.map((rec) => (
                          <Link
                            key={rec.id}
                            href={`/stories/${rec.slug}`}
                            className="group block bg-[#070709] rounded-[22px] p-3.5 border border-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="aspect-[16/10] rounded-[16px] overflow-hidden bg-black mb-3 relative border border-white/5">
                              {rec.coverImage ? (
                                <img
                                  src={rec.coverImage}
                                  alt={rec.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-white/[0.03]" />
                              )}
                            </div>
                            {rec.category && (
                              <p className="text-[10px] uppercase tracking-wider text-[#8CCDF2] font-[var(--font-grotesk)] mb-1">
                                {rec.category}
                              </p>
                            )}
                            <h4 className="font-[var(--font-instrument-serif)] text-base text-[#F8FBFF] group-hover:text-[#8CCDF2] transition-colors line-clamp-2 leading-snug">
                              {rec.title}
                            </h4>
                            <p className="text-[11px] text-[#667B8C] font-[var(--font-grotesk)] mt-2">
                              {formatDate(rec.createdAt)} · {rec.readingTime || 5} min read
                            </p>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Mobile RSS Card */}
                  <div className="bg-[#070709] rounded-[24px] p-5 border border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#8CCDF2]/15 border border-[#8CCDF2]/30 flex items-center justify-center text-[#8CCDF2] shrink-0">
                        <Rss className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-[var(--font-instrument-serif)] text-base text-[#F8FBFF]">
                          Follow new writing by RSS
                        </p>
                        <p className="text-xs text-[#667B8C] font-[var(--font-source-serif)] italic">
                          Stay quietly in the loop.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/rss.xml"
                      className="px-3.5 py-1.5 rounded-full text-xs font-[var(--font-grotesk)] font-medium bg-[#F8FBFF] text-[#050505] hover:opacity-90 transition-opacity shrink-0"
                    >
                      RSS Feed
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY DESKTOP SIDEBAR (30–35% width, hidden on mobile) */}
            {!readingMode && (
              <aside className="lg:col-span-4 min-w-0 hidden lg:block sticky top-24 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
                {/* 1. “More from bhvy.” (3 recommendations) */}
                {recommendedStories.length > 0 && (
                  <section className="bg-[#070709] rounded-[24px] p-5 xl:p-6 border border-white/10 shadow-lg">
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#8CCDF2]" />
                        <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#DCE5EC]/80 font-[var(--font-grotesk)] font-semibold">
                          More from bhvy.
                        </h3>
                      </div>
                      <Link
                        href="/stories"
                        className="text-[11px] text-[#667B8C] hover:text-[#F8FBFF] transition-colors font-[var(--font-grotesk)]"
                      >
                        All →
                      </Link>
                    </div>

                    <div className="space-y-3.5">
                      {recommendedStories.map((rec) => (
                        <Link
                          key={rec.id}
                          href={`/stories/${rec.slug}`}
                          className="group flex gap-3.5 p-2 rounded-[18px] hover:bg-white/5 transition-all duration-300"
                        >
                          <div className="relative w-20 h-20 shrink-0 rounded-[14px] overflow-hidden bg-black border border-white/10">
                            {rec.coverImage ? (
                              <img
                                src={rec.coverImage}
                                alt={rec.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            {rec.category && (
                              <span className="text-[9px] uppercase tracking-[0.18em] text-[#8CCDF2] font-[var(--font-grotesk)] font-medium line-clamp-1">
                                {rec.category}
                              </span>
                            )}
                            <h4 className="font-[var(--font-instrument-serif)] text-base text-[#F8FBFF] group-hover:text-[#8CCDF2] transition-colors line-clamp-2 leading-snug mt-0.5">
                              {rec.title}
                            </h4>
                            <p className="text-[10px] text-[#667B8C] font-[var(--font-grotesk)] mt-1.5 flex items-center gap-2">
                              <span>{formatDate(rec.createdAt)}</span>
                              <span>·</span>
                              <span>{rec.readingTime || 5} min read</span>
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. “In this story” (Table of Contents - only if meaningful headings) */}
                {headings.length >= 2 && (
                  <section className="bg-[#070709] rounded-[24px] p-5 xl:p-6 border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2 pb-3.5 border-b border-white/10 mb-3">
                      <ListOrdered className="w-3.5 h-3.5 text-[#8CCDF2]" />
                      <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#DCE5EC]/80 font-[var(--font-grotesk)] font-semibold">
                        In this story
                      </h3>
                    </div>

                    <nav aria-label="Table of contents" className="space-y-1">
                      {headings.map((h) => {
                        const active = activeHeadingId === h.id
                        return (
                          <a
                            key={h.id}
                            href={`#${h.id}`}
                            className={cn(
                              "block py-1.5 px-3 rounded-xl text-xs transition-all duration-200 line-clamp-1 font-[var(--font-grotesk)]",
                              h.level === 3 && "pl-6 text-[11px]",
                              active
                                ? "bg-white/10 text-[#8CCDF2] font-semibold"
                                : "text-[#DCE5EC]/70 hover:text-[#F8FBFF] hover:bg-white/5"
                            )}
                          >
                            {h.text}
                          </a>
                        )
                      })}
                    </nav>
                  </section>
                )}

                {/* 3. “Continue reading” (Previous & Next story navigation) */}
                {(prevStory || nextStory) && (
                  <section className="bg-[#070709] rounded-[24px] p-5 xl:p-6 border border-white/10 shadow-lg space-y-3">
                    <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#DCE5EC]/80 font-[var(--font-grotesk)] font-semibold pb-2 border-b border-white/10">
                      Continue reading
                    </h3>

                    {prevStory && (
                      <Link
                        href={`/stories/${prevStory.slug}`}
                        className="group block p-3.5 rounded-[18px] bg-black/40 hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                      >
                        <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#667B8C] group-hover:text-[#8CCDF2] transition-colors font-[var(--font-grotesk)] font-medium">
                          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
                          Previous story
                        </span>
                        <span className="font-[var(--font-instrument-serif)] text-base text-[#F8FBFF] group-hover:text-[#8CCDF2] transition-colors mt-1 block line-clamp-1 leading-snug">
                          {prevStory.title}
                        </span>
                      </Link>
                    )}

                    {nextStory && (
                      <Link
                        href={`/stories/${nextStory.slug}`}
                        className="group block p-3.5 rounded-[18px] bg-black/40 hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                      >
                        <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#667B8C] group-hover:text-[#8CCDF2] transition-colors font-[var(--font-grotesk)] font-medium">
                          Next story
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className="font-[var(--font-instrument-serif)] text-base text-[#F8FBFF] group-hover:text-[#8CCDF2] transition-colors mt-1 block line-clamp-1 leading-snug">
                          {nextStory.title}
                        </span>
                      </Link>
                    )}
                  </section>
                )}

                {/* 4. Small RSS Callout */}
                <div className="bg-[#070709] rounded-[24px] p-5 border border-white/10 shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#8CCDF2]/15 border border-[#8CCDF2]/30 flex items-center justify-center text-[#8CCDF2] shrink-0">
                      <Rss className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-[var(--font-instrument-serif)] text-base text-[#F8FBFF]">
                        Follow new writing by RSS
                      </p>
                      <p className="text-[11px] text-[#667B8C] font-[var(--font-source-serif)] italic">
                        Quiet updates in your feed reader.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/rss.xml"
                    className="px-3.5 py-1.5 rounded-full text-xs font-[var(--font-grotesk)] font-medium bg-[#F8FBFF] text-[#050505] hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    /rss.xml
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* Private Feedback Dialog */}
        <FeedbackDialog
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          storyTitle={story.title}
          storySlug={story.slug}
        />
      </main>

      {!readingMode && (
        <>
          <Footer />
          <FloatingWriteButton />
        </>
      )}
    </div>
  )
}
