"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  BookOpen,
  PenSquare,
  Archive,
  Eye,
  EyeOff,
  BarChart3,
  Star,
  Sparkles,
  Feather,
  Lock,
  Unlock,
  Mail,
  Inbox,
  CheckCircle2,
  Check,
  X,
  RotateCcw,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ReadingProgress } from "@/components/ReadingProgress"
import { cn, formatDate } from "@/lib/utils"
import { parseStoryTags, buildTags } from "@/lib/constants"
import type { Story, StoryFeedback, FeedbackStatus, FeedbackCounts } from "@/types"

const CHANGELOG = [
  {
    version: "2.0",
    date: "2026",
    note: "Complete visual redesign. AMOLED theme, new typography, storytelling homepage, reading mode, collections & about pages, redesigned editor.",
  },
  {
    version: "1.x",
    date: "2026",
    note: "Story editor, analytics, and the original journal experience.",
  },
]

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<"stories" | "feedback">("stories")
  const [stories, setStories] = useState<Story[]>([])
  const [stats, setStats] = useState({
    totalStories: 0,
    published: 0,
    drafts: 0,
    totalWords: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all")

  // Reader Feedback State
  const [feedbackItems, setFeedbackItems] = useState<StoryFeedback[]>([])
  const [feedbackFilter, setFeedbackFilter] = useState<"all" | "unread" | "read" | "archived">("all")
  const [feedbackCounts, setFeedbackCounts] = useState<FeedbackCounts>({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
  })
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<StoryFeedback | null>(null)
  const [actionInProgress, setActionInProgress] = useState(false)

  const fetchData = useCallback(async () => {
    const params =
      filter === "all"
        ? "?published=all"
        : `?published=${filter === "published"}`

    try {
      const [storiesRes, analyticsRes] = await Promise.all([
        fetch(`/api/stories${params}`),
        fetch("/api/analytics"),
      ])

      setStories(await storiesRes.json())
      setStats(await analyticsRes.json())
    } catch {
      // Keep the existing dashboard behavior if a request fails.
    }

    setLoading(false)
  }, [filter])

  const fetchFeedback = useCallback(async () => {
    setFeedbackLoading(true)
    try {
      const res = await fetch(`/api/admin/feedback?status=${feedbackFilter}`)
      if (res.ok) {
        const data = await res.json()
        setFeedbackItems(data.items || [])
        if (data.counts) {
          setFeedbackCounts(data.counts)
        }
      }
    } catch {
      // Keep existing state on request failure
    }
    setFeedbackLoading(false)
  }, [feedbackFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchFeedback()
  }, [fetchFeedback])

  const updateFeedbackStatus = async (id: string, newStatus: FeedbackStatus) => {
    setActionInProgress(true)
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setFeedbackItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        )
        if (selectedFeedback?.id === id) {
          setSelectedFeedback(updated)
        }
        // Refresh counts to ensure accuracy
        const countRes = await fetch("/api/admin/feedback?status=all")
        if (countRes.ok) {
          const cData = await countRes.json()
          if (cData.counts) setFeedbackCounts(cData.counts)
        }
      }
    } catch {
      // Preserve state on failure
    }
    setActionInProgress(false)
  }

  const deleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this reader message?")) return
    setActionInProgress(true)
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setFeedbackItems((prev) => prev.filter((item) => item.id !== id))
        if (selectedFeedback?.id === id) {
          setSelectedFeedback(null)
        }
        // Refresh counts
        const countRes = await fetch("/api/admin/feedback?status=all")
        if (countRes.ok) {
          const cData = await countRes.json()
          if (cData.counts) setFeedbackCounts(cData.counts)
        }
      }
    } catch {
      // Preserve state on failure
    }
    setActionInProgress(false)
  }

  const patchStory = async (
    story: Story,
    body: Record<string, unknown>
  ) => {
    await fetch(`/api/stories/${story.slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    fetchData()
  }

  const deleteStory = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return

    await fetch(`/api/stories/${slug}`, {
      method: "DELETE",
    })

    fetchData()
  }

  const togglePublish = (story: Story) =>
    patchStory(story, {
      published: !story.published,
    })

  const toggleFlag = (
    story: Story,
    flag: "editorsPick" | "recommended"
  ) => {
    const tags = parseStoryTags(story.tags)
    const next = {
      ...tags,
      [flag]: !tags[flag],
    }

    patchStory(story, {
      tags: buildTags(next),
    })
  }

  const toggleFeatured = (story: Story) =>
    patchStory(story, {
      featured: !story.featured,
    })

  return (
    <div className="min-h-screen">
      <ReadingProgress />

      <Navbar />

      <main className="pt-28 md:pt-36">
        <div className="max-w-6xl mx-auto px-5 md:px-6 pb-16">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] font-[var(--font-grotesk)] mb-2">
                  Admin
                </p>

                <h1 className="text-3xl md:text-4xl text-foreground">
                  Dashboard
                </h1>

                <p className="text-sm text-[var(--foreground-secondary)] mt-1.5">
                  Manage your journal
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full glass-pill hover:scale-105 transition-all"
                >
                  <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
                  Analytics
                </Link>

                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-[var(--text)] text-[var(--bg-base)] font-medium hover:opacity-90 transition-all font-[var(--font-grotesk)] shadow-sm hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  New Story
                </Link>
              </div>
            </div>

            {/* Navigation Tabs: Stories vs Reader Feedback */}
            <div className="flex items-center gap-2 mb-8 border-b border-[var(--border)] pb-4">
              <button
                type="button"
                onClick={() => setActiveSection("stories")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] transition-all cursor-pointer",
                  activeSection === "stories"
                    ? "glass-strong text-foreground border border-white/25 shadow-sm"
                    : "text-[var(--muted)] hover:text-foreground hover:bg-white/5"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Stories</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-[var(--muted)]">
                  {stats.totalStories}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("feedback")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] transition-all cursor-pointer relative",
                  activeSection === "feedback"
                    ? "glass-strong text-foreground border border-white/25 shadow-sm"
                    : "text-[var(--muted)] hover:text-foreground hover:bg-white/5"
                )}
              >
                <span className="text-sm">💌</span>
                <span>Reader Feedback</span>
                {feedbackCounts.unread > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff3366] text-white shadow-[0_0_10px_rgba(255,51,102,0.5)]">
                    {feedbackCounts.unread}
                  </span>
                )}
              </button>
            </div>

            {activeSection === "stories" ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-10">
              {[
                {
                  label: "Total Stories",
                  value: stats.totalStories,
                  icon: FileText,
                },
                {
                  label: "Published",
                  value: stats.published,
                  icon: BookOpen,
                },
                {
                  label: "Drafts",
                  value: stats.drafts,
                  icon: Archive,
                },
                {
                  label: "Words Written",
                  value: stats.totalWords.toLocaleString(),
                  icon: PenSquare,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.6,
                  }}
                  className="p-5 rounded-[26px] glass-card border border-white/10 hover:border-white/20 transition-all"
                >
                  <stat.icon className="w-4 h-4 text-[var(--accent)] mb-3" />

                  <div className="text-2xl font-[var(--font-instrument-serif)] text-foreground">
                    {stat.value}
                  </div>

                  <div className="text-xs text-[var(--muted)] mt-1 font-[var(--font-grotesk)]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full glass-pill mb-7">
              {(["all", "published", "drafts"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs transition-all font-[var(--font-grotesk)] font-medium",
                    filter === f
                      ? "glass-strong text-foreground border border-white/20 shadow-sm"
                      : "text-[var(--muted)] hover:text-foreground"
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl skeleton border border-[var(--border)]"
                  />
                ))}
              </div>
            ) : stories.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20">
                <FileText className="w-10 h-10 text-[var(--muted)] mx-auto mb-4 opacity-40" />

                <p className="text-sm text-[var(--foreground-secondary)]">
                  No stories yet
                </p>

                <Link
                  href="/editor"
                  className="inline-flex items-center gap-1.5 text-sm text-foreground mt-4 underline-animate"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Write your first story
                </Link>
              </div>
            ) : (
              /* Stories */
              <div className="space-y-2.5">
                {stories.map((story, i) => {
                  const tags = parseStoryTags(story.tags)

                  return (
                    <motion.div
                      key={story.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: i * 0.03,
                        duration: 0.4,
                      }}
                      className="group p-5 rounded-2xl glass-card"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Story information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {/* Published / Draft */}
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                story.published
                                  ? "bg-success"
                                  : "bg-warning"
                              )}
                            />

                            <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-[var(--font-grotesk)]">
                              {story.published
                                ? "Published"
                                : "Draft"}
                            </span>

                            {/* LOCKED */}
                            {story.isLocked && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--orchid)] font-[var(--font-grotesk)]">
                                <Lock className="w-3 h-3" />
                                Password Protected
                              </span>
                            )}

                            {/* PUBLIC */}
                            {!story.isLocked && (
                              <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--muted)] font-[var(--font-grotesk)]">
                                <Unlock className="w-3 h-3" />
                                Public
                              </span>
                            )}

                            {/* Featured */}
                            {story.featured && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--orchid)] font-[var(--font-grotesk)]">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </span>
                            )}

                            {/* Editor's Pick */}
                            {tags.editorsPick && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--lavender)] font-[var(--font-grotesk)]">
                                <Star className="w-3 h-3" />
                                Editor&apos;s Pick
                              </span>
                            )}

                            {/* Recommended */}
                            {tags.recommended && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--soft-cyan)] font-[var(--font-grotesk)]">
                                <Feather className="w-3 h-3" />
                                Recommended
                              </span>
                            )}

                            {/* Category */}
                            {story.category && (
                              <>
                                <span className="text-[var(--muted)]/40">
                                  ·
                                </span>

                                <span className="text-[10px] text-[var(--muted)]">
                                  {story.category}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-[var(--font-instrument-serif)] text-lg text-foreground truncate">
                            {story.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-xs text-[var(--muted)] truncate mt-1">
                            {story.excerpt || "No excerpt"}
                          </p>

                          {/* Metadata */}
                          <p className="text-[10px] text-[var(--muted)]/60 mt-1.5 font-[var(--font-grotesk)]">
                            {formatDate(story.createdAt)} ·{" "}
                            {story.readingTime || 5} min read
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-end gap-1 shrink-0 max-w-[220px]">
                          {/* Featured */}
                          <IconBtn
                            onClick={() => toggleFeatured(story)}
                            active={story.featured}
                            title={
                              story.featured
                                ? "Unfeature"
                                : "Feature"
                            }
                            activeColor="text-[var(--orchid)]"
                          >
                            <Sparkles className="w-4 h-4" />
                          </IconBtn>

                          {/* Editor's Pick */}
                          <IconBtn
                            onClick={() =>
                              toggleFlag(
                                story,
                                "editorsPick"
                              )
                            }
                            active={!!tags.editorsPick}
                            title={
                              tags.editorsPick
                                ? "Remove Editor's Pick"
                                : "Mark as Editor's Pick"
                            }
                            activeColor="text-[var(--lavender)]"
                          >
                            <Star className="w-4 h-4" />
                          </IconBtn>

                          {/* Recommended */}
                          <IconBtn
                            onClick={() =>
                              toggleFlag(
                                story,
                                "recommended"
                              )
                            }
                            active={!!tags.recommended}
                            title={
                              tags.recommended
                                ? "Remove Recommended"
                                : "Mark as Recommended"
                            }
                            activeColor="text-[var(--soft-cyan)]"
                          >
                            <Feather className="w-4 h-4" />
                          </IconBtn>

                          <div className="w-px h-5 bg-[var(--border)] mx-1" />

                          {/* View */}
                          <Link
                            href={`/stories/${story.slug}`}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-foreground hover:bg-secondary transition-colors"
                            title="View"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/editor/${story.slug}`}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-foreground hover:bg-secondary transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Publish */}
                          <IconBtn
                            onClick={() =>
                              togglePublish(story)
                            }
                            title={
                              story.published
                                ? "Unpublish"
                                : "Publish"
                            }
                          >
                            {story.published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </IconBtn>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              deleteStory(story.slug)
                            }
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
              </>
            ) : (
              /* ========================================================= */
              /* READER FEEDBACK SECTION                                   */
              /* ========================================================= */
              <div className="space-y-8">
                {/* 1. Feedback Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {[
                    {
                      label: "Total Messages",
                      value: feedbackCounts.total,
                      icon: Mail,
                      accent: "text-[var(--foreground)]",
                    },
                    {
                      label: "Unread",
                      value: feedbackCounts.unread,
                      icon: Sparkles,
                      accent: "text-[var(--orchid)]",
                      highlight: feedbackCounts.unread > 0,
                    },
                    {
                      label: "Read",
                      value: feedbackCounts.read,
                      icon: CheckCircle2,
                      accent: "text-emerald-400",
                    },
                    {
                      label: "Archived",
                      value: feedbackCounts.archived,
                      icon: Archive,
                      accent: "text-[var(--muted)]",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className={cn(
                        "p-5 rounded-[26px] glass-card border transition-all",
                        stat.highlight
                          ? "border-[var(--orchid)]/40 bg-[var(--orchid)]/[0.04] shadow-[0_0_24px_rgba(232,121,249,0.12)]"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <stat.icon className={cn("w-4 h-4 mb-3", stat.accent)} />
                      <div className="text-2xl font-[var(--font-instrument-serif)] text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-1 font-[var(--font-grotesk)]">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 2. Filter Tabs */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full glass-pill">
                  {(["all", "unread", "read", "archived"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFeedbackFilter(f)}
                      aria-pressed={feedbackFilter === f}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs transition-all font-[var(--font-grotesk)] font-medium flex items-center gap-1.5 cursor-pointer",
                        feedbackFilter === f
                          ? "glass-strong text-foreground border border-white/20 shadow-sm"
                          : "text-[var(--muted)] hover:text-foreground"
                      )}
                    >
                      <span>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
                      {f === "unread" && feedbackCounts.unread > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3366]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* 3. Feedback Inbox List */}
                {feedbackLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-28 rounded-2xl skeleton border border-[var(--border)]"
                      />
                    ))}
                  </div>
                ) : feedbackItems.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-20 glass-card rounded-3xl p-8 border border-white/10">
                    <span className="text-3xl block mb-3 select-none">💌</span>
                    <h3 className="font-[var(--font-instrument-serif)] text-2xl text-foreground">
                      Your inbox is quiet for now.
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1.5 font-[var(--font-grotesk)] max-w-sm mx-auto leading-relaxed">
                      Reader messages will appear here when someone writes to you.
                    </p>
                  </div>
                ) : (
                  /* List of Submissions */
                  <div className="space-y-3">
                    {feedbackItems.map((item, i) => {
                      const isUnread = item.status === "unread"
                      const isArchived = item.status === "archived"

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.4 }}
                          onClick={() => setSelectedFeedback(item)}
                          className={cn(
                            "group p-5 rounded-2xl glass-card border transition-all cursor-pointer relative",
                            isUnread
                              ? "border-[var(--orchid)]/30 bg-[var(--orchid)]/[0.03] hover:border-[var(--orchid)]/50"
                              : "border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {/* Header meta */}
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-sm select-none">💌</span>
                                <h4 className="font-[var(--font-grotesk)] font-semibold text-sm text-foreground">
                                  {item.name}
                                </h4>

                                {/* Status badge */}
                                {isUnread ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium font-[var(--font-grotesk)] bg-[var(--orchid)]/15 text-[var(--orchid)] border border-[var(--orchid)]/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--orchid)] animate-pulse" />
                                    Unread
                                  </span>
                                ) : isArchived ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium font-[var(--font-grotesk)] bg-white/5 text-[var(--muted)] border border-white/10">
                                    Archived
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium font-[var(--font-grotesk)] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Read
                                  </span>
                                )}

                                <span className="text-[var(--muted)]/40">·</span>
                                <span className="text-[10px] text-[var(--muted)] font-[var(--font-grotesk)]">
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>

                              {/* Message preview snippet */}
                              <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] line-clamp-2 font-[var(--font-source-serif)] italic leading-relaxed">
                                &ldquo;{item.message}&rdquo;
                              </p>

                              {/* Story attribution */}
                              <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--muted)] font-[var(--font-grotesk)]">
                                <span>Story:</span>
                                {item.storySlug ? (
                                  <Link
                                    href={`/stories/${item.storySlug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[var(--orchid)] hover:underline font-medium truncate max-w-xs"
                                  >
                                    {item.storyTitle || item.storySlug}
                                  </Link>
                                ) : (
                                  <span className="text-foreground/80 truncate">
                                    {item.storyTitle || "Direct note to author"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card action controls */}
                            <div
                              className="flex items-center gap-1.5 shrink-0 sm:self-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedFeedback(item)}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium font-[var(--font-grotesk)] glass hover:bg-white/15 text-foreground transition-all cursor-pointer"
                              >
                                Read message
                              </button>

                              {isUnread ? (
                                <button
                                  type="button"
                                  title="Mark as read"
                                  disabled={actionInProgress}
                                  onClick={() => updateFeedbackStatus(item.id, "read")}
                                  className="p-1.5 rounded-xl text-[var(--muted)] hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Check className="w-4 h-4 text-emerald-400" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  title="Mark as unread"
                                  disabled={actionInProgress}
                                  onClick={() => updateFeedbackStatus(item.id, "unread")}
                                  className="p-1.5 rounded-xl text-[var(--muted)] hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-4 h-4 text-[var(--orchid)]" />
                                </button>
                              )}

                              {!isArchived && (
                                <button
                                  type="button"
                                  title="Archive message"
                                  disabled={actionInProgress}
                                  onClick={() => updateFeedbackStatus(item.id, "archived")}
                                  className="p-1.5 rounded-xl text-[var(--muted)] hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                title="Delete message"
                                disabled={actionInProgress}
                                onClick={() => deleteFeedback(item.id)}
                                className="p-1.5 rounded-xl text-[var(--muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Changelog */}
            <div className="mt-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] font-[var(--font-grotesk)] mb-5">
                Changelog
              </p>

              <div className="glass-card rounded-3xl p-6">
                <div className="space-y-4">
                  {CHANGELOG.map((c) => (
                    <div
                      key={c.version}
                      className="flex gap-4"
                    >
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-[var(--font-grotesk)] border border-[var(--orchid)]/30 text-[var(--lavender)] bg-[var(--orchid)]/10 h-fit whitespace-nowrap">
                        v{c.version}
                      </span>

                      <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                        <span className="text-[var(--muted)] font-[var(--font-grotesk)] mr-1.5">
                          {c.date}
                        </span>

                        {c.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Reader Message Detail Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeedback(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-full max-w-xl glass-strong rounded-[32px] p-6 sm:p-8 border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl select-none">💌</span>
                    <h3 className="font-[var(--font-instrument-serif)] text-2xl sm:text-3xl text-foreground">
                      {selectedFeedback.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted)] font-[var(--font-grotesk)] mt-1">
                    Submitted on {formatDate(selectedFeedback.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[var(--muted)] hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story Context Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs font-[var(--font-grotesk)]">
                <div className="truncate mr-2">
                  <span className="text-[var(--muted)] mr-1.5 uppercase text-[10px]">Story:</span>
                  <span className="text-foreground font-medium font-[var(--font-instrument-serif)] text-base">
                    {selectedFeedback.storyTitle || "Direct note"}
                  </span>
                </div>
                {selectedFeedback.storySlug && (
                  <Link
                    href={`/stories/${selectedFeedback.storySlug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[var(--orchid)] hover:underline shrink-0"
                  >
                    <span>View story</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Message Body (Rendered safely as plain text with preserved line breaks) */}
              <div className="my-5 flex-1 overflow-y-auto pr-1">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-foreground font-[var(--font-source-serif)] text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words selection:bg-[var(--orchid)]/20">
                  {selectedFeedback.message}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {selectedFeedback.status === "unread" ? (
                    <button
                      type="button"
                      disabled={actionInProgress}
                      onClick={() => updateFeedbackStatus(selectedFeedback.id, "read")}
                      className="px-4 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as read</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionInProgress}
                      onClick={() => updateFeedbackStatus(selectedFeedback.id, "unread")}
                      className="px-4 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] bg-white/10 text-[var(--text-2)] hover:text-foreground border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mark as unread</span>
                    </button>
                  )}

                  {selectedFeedback.status !== "archived" && (
                    <button
                      type="button"
                      disabled={actionInProgress}
                      onClick={() => updateFeedbackStatus(selectedFeedback.id, "archived")}
                      className="px-4 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] bg-white/5 text-[var(--muted)] hover:text-foreground border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={actionInProgress}
                    onClick={() => deleteFeedback(selectedFeedback.id)}
                    className="px-3.5 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] text-[var(--destructive)] hover:bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFeedback(null)}
                    className="px-4 py-2 rounded-full text-xs font-medium font-[var(--font-grotesk)] glass-strong hover:bg-white/20 border border-white/20 text-foreground transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

function IconBtn({
  children,
  onClick,
  title,
  active,
  activeColor,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active?: boolean
  activeColor?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        active
          ? cn(
              activeColor,
              "bg-secondary"
            )
          : "text-[var(--muted)] hover:text-foreground hover:bg-secondary"
      )}
    >
      {children}
    </button>
  )
}