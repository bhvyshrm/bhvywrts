import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import type { Story } from "@/types"

export const dynamic = "force-dynamic"
export const revalidate = 3600

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function cleanCdata(text: string): string {
  return text.replace(/]]>/g, "]]]]><![CDATA[>")
}

function guessMimeType(url: string): string {
  const clean = url.split("?")[0].toLowerCase()
  if (clean.endsWith(".png")) return "image/png"
  if (clean.endsWith(".webp")) return "image/webp"
  if (clean.endsWith(".gif")) return "image/gif"
  return "image/jpeg"
}

export async function GET() {
  const baseUrl = "https://bhvywrts.vercel.app"
  let stories: Story[] = []

  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from("Story")
      .select("id, slug, title, subtitle, excerpt, category, tags, coverImage, createdAt, published, isLocked")
      .eq("published", true)
      .order("createdAt", { ascending: false })
      .limit(30)

    if (!error && data) {
      stories = (data as Story[]).filter((s) => s.published && !s.isLocked)
    }
  } catch (err) {
    console.error("Error fetching stories for RSS feed:", err)
  }

  const latestDate =
    stories.length > 0 && stories[0].createdAt
      ? new Date(stories[0].createdAt).toUTCString()
      : new Date().toUTCString()

  const itemsXml = stories
    .map((story) => {
      const url = `${baseUrl}/stories/${story.slug}`
      const pubDate = story.createdAt
        ? new Date(story.createdAt).toUTCString()
        : new Date().toUTCString()
      const description = story.excerpt || story.subtitle || story.title

      const enclosureTag = story.coverImage
        ? `\n      <enclosure url="${escapeXml(story.coverImage)}" length="0" type="${guessMimeType(story.coverImage)}" />\n      <media:content url="${escapeXml(story.coverImage)}" medium="image" />`
        : ""

      const categoryTag = story.category
        ? `\n      <category><![CDATA[${cleanCdata(story.category)}]]></category>`
        : ""

      return `    <item>
      <title><![CDATA[${cleanCdata(story.title)}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>${categoryTag}
      <description><![CDATA[${cleanCdata(description)}]]></description>${enclosureTag}
    </item>`
    })
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>bhvy.</title>
    <link>${baseUrl}</link>
    <description>The digital journal of Bhavya — stories, thoughts, and writings under the moonlight.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${latestDate}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
