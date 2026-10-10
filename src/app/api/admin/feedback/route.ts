import { NextRequest, NextResponse } from "next/server"
import { feedbackDb } from "@/lib/supabase"
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth"

export async function GET(req: NextRequest) {
  // Authorize administrator
  if (!(await isAuthenticated(req))) {
    return unauthorizedResponse()
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || "all"
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "50", 10)), 100)
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10))

  try {
    // 1. Efficient parallel counts for summary dashboard cards & tab badges
    const [allRes, unreadRes, readRes, archivedRes] = await Promise.all([
      feedbackDb().select("*", { count: "exact", head: true }),
      feedbackDb().select("*", { count: "exact", head: true }).eq("status", "unread"),
      feedbackDb().select("*", { count: "exact", head: true }).eq("status", "read"),
      feedbackDb().select("*", { count: "exact", head: true }).eq("status", "archived"),
    ])

    const counts = {
      total: allRes.count ?? 0,
      unread: unreadRes.count ?? 0,
      read: readRes.count ?? 0,
      archived: archivedRes.count ?? 0,
    }

    // 2. Query feedback list with ordering and optional status filter
    let query = feedbackDb()
      .select("*")
      .order("createdAt", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== "all") {
      if (["unread", "read", "archived"].includes(status)) {
        query = query.eq("status", status)
      }
    }

    const { data: items, error } = await query

    if (error) {
      console.error("Admin feedback list error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      items: items || [],
      counts,
    })
  } catch (err) {
    console.error("Admin feedback list exception:", err)
    return NextResponse.json(
      { error: "Failed to retrieve feedback submissions." },
      { status: 500 }
    )
  }
}
