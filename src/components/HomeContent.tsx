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
          // Strictly filter for eligible stories sorted newest published first
          const eligible = (data as Story[])
            .filter((s) => s.published && !s.isLocked && s.slug && s.title)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

  // Featured story highlight for the hero banner
  const featuredStory = useMemo(() => {
    return stories.find((s) => s.featured) || stories[0] || null
  }, [stories])

  const scrollToGallery = () => {
    const el = document.getElementById("story-gallery")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Coastal Background Atmosphere */}
      <GalaxyBackground />

      {/* 1. FLOATING NAVIGATION */}
      <Navbar />

      <main id="main-content" className="relative z-10 min-h-screen text-foreground overflow-x-clip">
        {/* 2. LONG COASTAL GLASS HERO BANNER */}
        <GalaxyHero
          featuredStory={featuredStory}
          loading={loading}
          onScrollToGallery={scrollToGallery}
        />

        {/* 3. LATEST STORIES: Directly after Hero */}
        <GalaxyStoryGallery stories={stories} loading={loading} />

        {/* 4. COLLECTIONS: Placed below Latest Stories */}
        <GalaxyCollections stories={stories} />

        {/* 5. ABOUT & WRITING JOURNEY BRIDGES */}
        <GalaxyJourneyLink />
      </main>

      {/* 6. FINAL FOOTER */}
      <Footer />
      <FloatingWriteButton />
    </>
  )
}
