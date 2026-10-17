"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ArrowUpRight, Clock, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { FloatingWriteButton } from "./FloatingWriteButton"
import { GalaxyBackground } from "./galaxy/GalaxyBackground"
import { GalaxyHero } from "./galaxy/GalaxyHero"
import { GalaxyStoryGallery } from "./galaxy/GalaxyStoryGallery"
import { GalaxyCollections } from "./galaxy/GalaxyCollections"
import { GalaxyJourneyLink } from "./galaxy/GalaxyJourneyLink"
import { parseStoryTags } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import type { Story } from "@/types"

const CinematicIntro = dynamic(
  () => import("./CinematicIntro").then((mod) => mod.CinematicIntro),
  { ssr: false }
)

export function HomeContent() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const galleryRef = useRef<HTMLDivElement>(null)

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

  const latestStory = useMemo(() => {
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
      <CinematicIntro coverImage={latestStory?.coverImage} />
      <GalaxyBackground />
      <Navbar />

      <main id="main-content" className="relative min-h-screen text-foreground overflow-x-clip">
        {/* 1. GALAXY HERO: Centered Brand Presentation */}
        <GalaxyHero onScrollToGallery={scrollToGallery} />

        {/* 2. CINEMATIC STORY GALLERY: Perspective-based title-only cards */}
        <GalaxyStoryGallery stories={stories} loading={loading} />

        {/* 3. FEATURED STORY TRANSITION: Restrained continuation into the featured entry */}
        {latestStory && (
          <section className="galaxy-container py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-[28px] md:rounded-[36px] glass-strong border border-white/80 dark:border-white/20 shadow-[0_20px_50px_rgba(10,57,64,0.06)] dark:shadow-2xl p-6 sm:p-8 md:p-12 lg:p-14"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium font-[var(--font-grotesk)] border border-[var(--orchid)]/40 bg-[var(--orchid)]/15 text-[var(--orchid)] backdrop-blur-md">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured Reading</span>
                    </span>
                    {latestStory.category && (
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--text-3)] font-[var(--font-grotesk)]">
                        {latestStory.category}
                      </span>
                    )}
                  </div>

                  <h2 className="font-[var(--font-instrument-serif)] text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.08] tracking-tight">
                    <Link
                      href={`/stories/${latestStory.slug}`}
                      className="hover:text-[var(--orchid)] transition-colors"
                    >
                      {latestStory.title}
                    </Link>
                  </h2>

                  {(latestStory.subtitle || latestStory.excerpt) && (
                    <p className="text-sm sm:text-base text-[var(--text-2)] font-[var(--font-source-serif)] italic leading-relaxed line-clamp-3">
                      {latestStory.subtitle || latestStory.excerpt}
                    </p>
                  )}

                  <div className="pt-2">
                    <Link
                      href={`/stories/${latestStory.slug}`}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-foreground text-background font-[var(--font-grotesk)] text-xs sm:text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-md group w-fit cursor-pointer"
                    >
                      <span>Read this story</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <Link
                    href={`/stories/${latestStory.slug}`}
                    className="group block relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[24px] overflow-hidden border border-white/20 shadow-xl"
                  >
                    {latestStory.coverImage ? (
                      <img
                        src={latestStory.coverImage}
                        alt={latestStory.title}
                        width={600}
                        height={750}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1b1429] via-[#090710] to-[#1a1224]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full glass-strong border border-white/30 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* 4. COLLECTIONS PREVIEW */}
        <GalaxyCollections stories={stories} />

        {/* 5. WRITING JOURNEY AND ABOUT BRIDGES */}
        <GalaxyJourneyLink />
      </main>

      {/* 6. EXISTING FOOTER */}
      <Footer />
      <FloatingWriteButton />
    </>
  )
}
