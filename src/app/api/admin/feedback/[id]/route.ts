import { NextRequest, NextResponse } from "next/server"
import { feedbackDb } from "@/lib/supabase"
import { isAuthenticated, unauthorizedResponse } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  if (!(await isAuthenticated(req))) {
    return unauthorizedResponse()
  }

  const { id } = await params

  const { data: item, error } = await feedbackDb()
    .select("*")
    .eq("id", id)
    .single()

  if (error || !item) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  if (!(await isAuthenticated(req))) {
    return unauthorizedResponse()
  }

  const { id } = await params
  const body = await req.json().catch(() => null)

  if (!body || typeof body.status !== "string") {
    return NextResponse.json(
      { error: "A valid status ('unread', 'read', or 'archived') is required." },
      { status: 400 }
    )
  }

  const newStatus = body.status
  if (!["unread", "read", "archived"].includes(newStatus)) {
    return NextResponse.json(
      { error: "Invalid status. Allowed values: 'unread', 'read', 'archived'." },
      { status: 400 }
    )
  }

  const updates: Record<string, unknown> = {
    status: newStatus,
  }

  if (newStatus === "read") {
    updates.readAt = new Date().toISOString()
  } else if (newStatus === "unread") {
    updates.readAt = null
  }

  const { data: updated, error } = await feedbackDb()
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message || "Failed to update feedback status." },
      { status: 500 }
    )
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  if (!(await isAuthenticated(req))) {
    return unauthorizedResponse()
  }

  const { id } = await params

  const { error } = await feedbackDb()
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
