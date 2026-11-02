"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { FloatingWriteButton } from "./FloatingWriteButton"
import { GalaxyBackground } from "./galaxy/GalaxyBackground"
import { HomeStoryArchive } from "./HomeStoryArchive"
import type { Story } from "@/types"

export function HomeContent() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const { data, error } = await supabase
          .from("Story")
          .select("id, slug, title, subtitle, excerpt, category, tags, coverImage, published, isLocked, featured, createdAt, readingTime, wordCount")
          .eq("published", true)
          .order("createdAt", { ascending: false })

        if (error) {
          console.error("Failed to query stories:", error)
        } else if (data && isMounted) {
          // Strictly filter for eligible published, unlocked stories, deduplicated and sorted newest published first
          const seen = new Set<string>()
          const eligible: Story[] = []
          for (const s of data as Story[]) {
            if (s.id && !seen.has(s.id) && s.slug && s.title && s.published && !s.isLocked) {
              seen.add(s.id)
              eligible.push(s)
            }
          }
          eligible.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setStories(eligible)
        }
      } catch (err) {
        console.error("Error loading homepage stories:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      {/* 1. Stationary Coastal Wallpaper Background */}
      <GalaxyBackground />

      {/* 2. Minimal Navigation with bhvy. Brand */}
      <Navbar />

      {/* 3. Homepage Stories Archive Experience */}
      <main id="main-content" className="relative z-10 min-h-screen text-foreground overflow-x-hidden">
        <HomeStoryArchive stories={stories} loading={loading} />
      </main>

      {/* 4. Minimal Footer */}
      <Footer />
      <FloatingWriteButton />
    </>
  )
}
