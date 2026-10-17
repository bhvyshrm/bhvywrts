"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Story } from "@/types"

export function useGalaxyStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPublishedStories() {
      try {
        const { data, error: queryError } = await supabase
          .from("Story")
          .select("*")
          .eq("published", true)
          .order("createdAt", { ascending: false })

        if (queryError) {
          if (isMounted) setError(queryError.message)
        } else if (data && isMounted) {
          // Strictly exclude drafts, unpublished records, and locked/password-protected stories
          const eligibleStories = data.filter(
            (story: Story) =>
              story.published === true &&
              !story.isLocked &&
              Boolean(story.slug && story.slug.trim()) &&
              Boolean(story.title && story.title.trim())
          )
          setStories(eligibleStories)
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load stories")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPublishedStories()

    return () => {
      isMounted = false
    }
  }, [])

  // Order: featured stories first, then chronologically descending
  const orderedStories = useMemo(() => {
    if (!stories.length) return []
    const featured = stories.filter((s) => s.featured)
    const nonFeatured = stories.filter((s) => !s.featured)
    return [...featured, ...nonFeatured]
  }, [stories])

  return {
    stories: orderedStories,
    rawStories: stories,
    loading,
    error,
  }
}
