import type { MetadataRoute } from "next"
import { getSupabaseAdmin } from "@/lib/supabase"
import { COLLECTIONS } from "@/lib/constants"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bhvywrts.vercel.app"

  // Base public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing-journey`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Collection pages
  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${encodeURIComponent(c.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // Published stories
  let storyRoutes: MetadataRoute.Sitemap = []
  try {
    const admin = getSupabaseAdmin()
    const { data: stories } = await admin
      .from("Story")
      .select("slug, updatedAt, createdAt, published, isLocked")
      .eq("published", true)
      .order("createdAt", { ascending: false })

    if (stories && stories.length > 0) {
      type SitemapStory = {
        slug: string
        updatedAt?: string | null
        createdAt: string
        published: boolean
        isLocked: boolean
      }
      storyRoutes = (stories as unknown as SitemapStory[])
        .filter((s) => s.published && !s.isLocked)
        .map((s) => {
          const modDate = s.updatedAt ? new Date(s.updatedAt) : new Date(s.createdAt)
          const validDate = Number.isNaN(modDate.getTime()) ? new Date() : modDate
          return {
            url: `${baseUrl}/stories/${s.slug}`,
            lastModified: validDate,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }
        })
    }
  } catch (err) {
    console.error("Error generating sitemap stories:", err)
  }

  return [...staticRoutes, ...collectionRoutes, ...storyRoutes]
}
