import { NextRequest, NextResponse } from "next/server"
import { sb, feedbackDb } from "@/lib/supabase"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // 1. Client IP for rate-limiting
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anonymous"

    const rate = checkRateLimit(`feedback:${ip}`, 5, 10 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            "You have submitted feedback recently. Please wait a few moments before sending another note.",
        },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
    }

    // 2. Spam Honeypot Check (field should be blank for real humans)
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      // Silently return success to discourage spambots
      return NextResponse.json({
        success: true,
        message: "Your note has reached the writer. ❤️",
      })
    }

    // 3. Name Validation
    const rawName = typeof body.name === "string" ? body.name.trim() : ""
    if (!rawName) {
      return NextResponse.json({ error: "Please provide your name." }, { status: 400 })
    }
    if (rawName.length > 80) {
      return NextResponse.json(
        { error: "Name must be 80 characters or fewer." },
        { status: 400 }
      )
    }

    // 4. Message Validation
    const rawMessage = typeof body.message === "string" ? body.message.trim() : ""
    if (!rawMessage) {
      return NextResponse.json(
        { error: "Please enter your message." },
        { status: 400 }
      )
    }
    if (rawMessage.length > 2000) {
      return NextResponse.json(
        { error: "Message must be 2,000 characters or fewer." },
        { status: 400 }
      )
    }

    // 5. Story association validation (if storySlug provided)
    let storyId: string | null = null
    let storyTitle: string | null = null
    let storySlug: string | null = null

    if (body.storySlug && typeof body.storySlug === "string") {
      const slug = body.storySlug.trim()
      const { data: story, error: storyError } = await sb()
        .select("id, title, slug, published")
        .eq("slug", slug)
        .single()

      if (storyError || !story || !story.published) {
        return NextResponse.json(
          { error: "The associated story could not be found or is not available." },
          { status: 400 }
        )
      }

      storyId = story.id
      storyTitle = story.title
      storySlug = story.slug
    }

    // 6. Safe database insertion with strict server-controlled metadata
    const { error: insertError } = await feedbackDb().insert({
      id: crypto.randomUUID(),
      storyId,
      storyTitle,
      storySlug,
      name: rawName,
      message: rawMessage,
      status: "unread",
      createdAt: new Date().toISOString(),
      readAt: null,
    })

    if (insertError) {
      console.error("StoryFeedback insert error:", insertError)
      return NextResponse.json(
        { error: "Could not save your message. Please try again in a moment." },
        { status: 500 }
      )
    }

    // Return minimal confirmation without exposing internal IDs or submissions
    return NextResponse.json({
      success: true,
      message: "Your note has reached the writer. ❤️",
    })
  } catch (err) {
    console.error("Feedback submission exception:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
