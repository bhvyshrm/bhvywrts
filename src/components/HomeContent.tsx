"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase-client"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { FloatingWriteButton } from "./FloatingWriteButton"
import { GalaxyBackground } from "./galaxy/GalaxyBackground"
import { GalaxyHero } from "./galaxy/GalaxyHero"
import { GalaxyCollections } from "./galaxy/GalaxyCollections"
import { GalaxyStoryGallery } from "./galaxy/GalaxyStoryGallery"
import { GalaxyJourneyLink } from "./galaxy/GalaxyJourneyLink"
import type { Story } from "@/types"

export function HomeContent() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const { data } = await supabase
          .from("Story")
          .select("id, slug, title, subtitle, excerpt, category, tags, coverImage, published, isLocked, featured, createdAt, readingTime")
          .eq("published", true)
          .order("createdAt", { ascending: false })
          .limit(24)

        if (data && isMounted) {
          // Strictly filter for eligible stories
          const eligible = (data as Story[]).filter(
            (s) => s.published && !s.isLocked && s.slug && s.title
          )
          setStories(eligible)
        }
      } catch {}
      if (isMounted) setLoading(false)
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  // Identify the featured story (or the latest eligible story)
  const latestStory = useMemo(() => {
    return stories.find((s) => s.featured) || stories[0] || null
  }, [stories])

  // Exclude the featured story from recent stories to prevent any duplicate rendering
  const recentStories = useMemo(() => {
    if (!latestStory) return stories
    return stories.filter((s) => s.id !== latestStory.id)
  }, [stories, latestStory])

  const scrollToGallery = () => {
    const el = document.getElementById("story-gallery")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Background Atmosphere */}
      <GalaxyBackground />

      {/* 1. NAVIGATION */}
      <Navbar />

      <main id="main-content" className="relative min-h-screen text-foreground overflow-x-clip">
        {/* 2. HERO / MAIN FEATURED-STORY PRESENTATION */}
        <GalaxyHero
          featuredStory={latestStory}
          loading={loading}
          onScrollToGallery={scrollToGallery}
        />

        {/* 3. COLLECTIONS: Curated worlds directly after hero */}
        <GalaxyCollections stories={stories} />

        {/* 4. RECENT STORIES: Excludes the featured story to eliminate duplication */}
        <GalaxyStoryGallery stories={recentStories} loading={loading} />

        {/* 5. ABOUT & WRITING JOURNEY BRIDGES */}
        <GalaxyJourneyLink />
      </main>

      {/* 6. FOOTER */}
      <Footer />
      <FloatingWriteButton />
    </>
  )
}
