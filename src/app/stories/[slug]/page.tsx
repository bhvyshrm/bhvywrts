import type { Metadata } from "next"
import { getSupabaseAdmin } from "@/lib/supabase"
import { StoryDetailView } from "@/components/StoryDetailView"
import type { Story } from "@/types"

async function getStory(slug: string): Promise<Story | null> {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from("Story")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error || !data) return null
    return data as Story
  } catch {
    return null
  }
}

async function getAllPublishedStories(): Promise<Story[]> {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from("Story")
      .select("id,slug,title,subtitle,category,tags,coverImage,readingTime,createdAt,published")
      .eq("published", true)
      .order("createdAt", { ascending: false })

    if (error || !data) return []
    return data as Story[]
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story || !story.published) {
    return {
      title: "Story Not Found | Bhavya Writes",
      description: "The story you are looking for may have been moved or unpublished.",
    }
  }

  const excerpt = story.excerpt
    ? story.excerpt.trim().replace(/\s+/g, " ").slice(0, 160)
    : `${story.title} — a story by Bhavya on Bhavya Writes.`

  const canonicalUrl = `https://bhvywrts.vercel.app/stories/${story.slug}`
  const ogImages = story.coverImage ? [story.coverImage] : []

  return {
    title: `${story.title} | Bhavya Writes`,
    description: excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: `${story.title} | Bhavya Writes`,
      description: excerpt,
      images: ogImages,
      publishedTime: story.createdAt,
      modifiedTime: story.updatedAt || story.createdAt,
      authors: ["Bhavya"],
      section: story.category || "Stories",
      siteName: "Bhavya Writes",
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} | Bhavya Writes`,
      description: excerpt,
      images: ogImages,
    },
  }
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const story = await getStory(slug)
  const allStories = await getAllPublishedStories()

  if (!story || !story.published) {
    return (
      <StoryDetailView
        initialStory={null}
        slug={slug}
        allStories={allStories}
      />
    )
  }

  const isLocked = story.isLocked === true

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: story.title,
    description: story.excerpt || story.subtitle || story.title,
    image: story.coverImage || undefined,
    datePublished: story.createdAt,
    dateModified: story.updatedAt || story.createdAt,
    author: {
      "@type": "Person",
      name: "Bhavya",
      url: "https://bhvywrts.vercel.app/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Bhavya Writes",
      url: "https://bhvywrts.vercel.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bhvywrts.vercel.app/stories/${story.slug}`,
    },
    url: `https://bhvywrts.vercel.app/stories/${story.slug}`,
    wordCount: story.wordCount || undefined,
    timeRequired: story.readingTime ? `PT${story.readingTime}M` : undefined,
    articleSection: story.category || undefined,
  }

  if (isLocked) {
    const { passwordHash: _, content: __, ...safeLockedStory } = story as any
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <StoryDetailView
          initialStory={null}
          lockedStory={safeLockedStory}
          slug={slug}
          allStories={allStories}
        />
      </>
    )
  }

  const { passwordHash: _, ...safeStory } = story as any

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryDetailView
        initialStory={safeStory as Story}
        slug={slug}
        allStories={allStories}
      />
    </>
  )
}