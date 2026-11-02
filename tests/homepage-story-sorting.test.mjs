import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Story Sorting: Supabase query uses descending createdAt order without hardcoded limits", () => {
  const homeContent = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // Verify query targets Story table
  assert.ok(homeContent.includes('.from("Story")'), "Must query Story table")

  // Verify query filters for published stories
  assert.ok(homeContent.includes('.eq("published", true)'), "Must filter published stories")

  // Verify authoritative ordering by createdAt descending
  assert.ok(
    homeContent.includes('.order("createdAt", { ascending: false })'),
    "Query must order by createdAt descending"
  )

  // Verify NO hardcoded limit (e.g. limit(24) removed so all published stories appear)
  assert.ok(!homeContent.includes(".limit("), "Must not arbitrarily truncate stories with .limit()")

  // Verify in-memory client sort enforces newest published story first
  assert.ok(
    homeContent.includes("new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()"),
    "Client sort must strictly ensure newest story first"
  )

  // Verify exclusion of locked and unpublished stories
  assert.ok(homeContent.includes("!s.isLocked"), "Must exclude locked private stories")
  assert.ok(homeContent.includes("s.published"), "Must strictly verify published status")
})

test("Story Sorting: Descending publication order verification algorithm", () => {
  const sampleStories = [
    { id: "1", title: "Older Story", createdAt: "2026-06-15T05:27:38.374", published: true, isLocked: false, slug: "older" },
    { id: "2", title: "Newest Story", createdAt: "2026-10-24T02:49:42.033", published: true, isLocked: false, slug: "newest" },
    { id: "3", title: "Middle Story", createdAt: "2026-09-19T04:05:20.157", published: true, isLocked: false, slug: "middle" },
    { id: "4", title: "Unpublished", createdAt: "2026-11-01T00:00:00.000", published: false, isLocked: false, slug: "unpub" },
    { id: "5", title: "Locked Story", createdAt: "2026-11-02T00:00:00.000", published: true, isLocked: true, slug: "locked" },
  ]

  const seen = new Set()
  const eligible = []
  for (const s of sampleStories) {
    if (s.id && !seen.has(s.id) && s.slug && s.title && s.published && !s.isLocked) {
      seen.add(s.id)
      eligible.push(s)
    }
  }

  eligible.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  assert.equal(eligible.length, 3, "Only eligible stories must be included")
  assert.equal(eligible[0].title, "Newest Story", "Newest published story must be first")
  assert.equal(eligible[1].title, "Middle Story", "Next newest story must be second")
  assert.equal(eligible[2].title, "Older Story", "Oldest story must be last")

  // Ensure timestamps are strictly descending
  for (let i = 0; i < eligible.length - 1; i++) {
    const current = new Date(eligible[i].createdAt).getTime()
    const next = new Date(eligible[i + 1].createdAt).getTime()
    assert.ok(current >= next, `Story index ${i} must be newer than or equal to index ${i + 1}`)
  }
})
