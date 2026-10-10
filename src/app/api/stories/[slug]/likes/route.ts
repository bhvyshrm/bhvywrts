import { NextRequest, NextResponse } from "next/server"
import { sb, likeDb } from "@/lib/supabase"
import { isAuthenticated } from "@/lib/auth"
import { getOrCreateReaderId, applyReaderCookie } from "@/lib/reader-id"

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await params

  // Validate story existence and access rules
  const { data: story, error: storyError } = await sb()
    .select("id, published, isLocked")
    .eq("slug", slug)
    .single()

  if (storyError || !story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 })
  }

  // Unpublished stories are restricted to authorized admin
  const admin = await isAuthenticated(req)
  if (!story.published && !admin) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 })
  }

  const session = await getOrCreateReaderId(req)

  try {
    // 1. Efficient total count using Supabase exact head query (no row transfer)
    const { count, error: countError } = await likeDb()
      .select("*", { count: "exact", head: true })
      .eq("storyId", story.id)

    if (countError) {
      console.error("Story likes count error:", countError)
      return NextResponse.json({ count: 0, liked: false })
    }

    // 2. Determine whether the current reader has an active like
    const { data: userLike } = await likeDb()
      .select("id")
      .eq("storyId", story.id)
      .eq("readerId", session.readerId)
      .maybeSingle()

    const res = NextResponse.json({
      count: count ?? 0,
      liked: !!userLike,
    })

    if (session.newCookieValue) {
      applyReaderCookie(res, session.newCookieValue)
    }

    return res
  } catch (err) {
    console.error("Story likes GET handler exception:", err)
    return NextResponse.json({ count: 0, liked: false })
  }
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await params

  // Validate story existence and access rules
  const { data: story, error: storyError } = await sb()
    .select("id, published")
    .eq("slug", slug)
    .single()

  if (storyError || !story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 })
  }

  const admin = await isAuthenticated(req)
  if (!story.published && !admin) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 })
  }

  const session = await getOrCreateReaderId(req)

  try {
    // Attempt insert; unique constraint (storyId, readerId) safely prevents duplicates
    const { error: insertError } = await likeDb().insert({
      id: crypto.randomUUID(),
      storyId: story.id,
      readerId: session.readerId,
      createdAt: new Date().toISOString(),
    })

    // Ignore Postgres unique constraint violation (code 23505) if like already exists
    if (insertError && !insertError.message?.includes("unique") && !insertError.message?.includes("duplicate")) {
      console.error("Story likes insert error:", insertError)
    }

    // Fetch confirmed exact count from database
    const { count } = await likeDb()
      .select("*", { count: "exact", head: true })
      .eq("storyId", story.id)

    const res = NextResponse.json({
      count: count ?? 1,
      liked: true,
    })

    if (session.newCookieValue) {
      applyReaderCookie(res, session.newCookieValue)
    }

    return res
  } catch (err) {
    console.error("Story likes POST handler exception:", err)
    return NextResponse.json({ error: "Failed to like story" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await params

  const { data: story, error: storyError } = await sb()
    .select("id, published")
    .eq("slug", slug)
    .single()

  if (storyError || !story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 })
  }

  const session = await getOrCreateReaderId(req)

  try {
    // Delete the active like for this reader and story
    const { error: deleteError } = await likeDb()
      .delete()
      .eq("storyId", story.id)
      .eq("readerId", session.readerId)

    if (deleteError) {
      console.error("Story likes delete error:", deleteError)
    }

    // Fetch confirmed exact count from database
    const { count } = await likeDb()
      .select("*", { count: "exact", head: true })
      .eq("storyId", story.id)

    const res = NextResponse.json({
      count: count ?? 0,
      liked: false,
    })

    if (session.newCookieValue) {
      applyReaderCookie(res, session.newCookieValue)
    }

    return res
  } catch (err) {
    console.error("Story likes DELETE handler exception:", err)
    return NextResponse.json({ error: "Failed to unlike story" }, { status: 500 })
  }
}
