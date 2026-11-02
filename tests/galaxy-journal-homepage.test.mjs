import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Simplified Literary Archive: Homepage architecture and component structure", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // 1. Verifies essential archive components are integrated
  assert.ok(home.includes("<GalaxyBackground"), "Must include GalaxyBackground stationary wallpaper")
  assert.ok(home.includes("<Navbar"), "Must preserve Navbar")
  assert.ok(home.includes("<HomeStoryArchive"), "Must include HomeStoryArchive for published stories")
  assert.ok(home.includes("<Footer />"), "Must preserve minimal Footer")
  assert.ok(home.includes("<FloatingWriteButton />"), "Must preserve FloatingWriteButton for admin")

  // 2. Verifies non-archive sections are removed from homepage
  assert.ok(!home.includes("<GalaxyHero"), "Must remove Hero banner from homepage")
  assert.ok(!home.includes("<GalaxyCollections"), "Must remove Collections section from homepage")
  assert.ok(!home.includes("<GalaxyJourneyLink"), "Must remove Writing Journey / About bridge from homepage")
})

test("Story Archive: Story routes and card metadata integrity", () => {
  const cardCode = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryCard.tsx"), "utf-8")
  const archiveCode = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryArchive.tsx"), "utf-8")

  // 1. Story route points to /stories/[slug]
  assert.ok(cardCode.includes("`/stories/${encodeURIComponent(story.slug.trim())}`"), "Card must link to /stories/[slug]")

  // 2. Displays genuine story data
  assert.ok(cardCode.includes("story.title"), "Story card must display title")
  assert.ok(cardCode.includes("story.excerpt"), "Story card must display excerpt when present")
  assert.ok(cardCode.includes("story.category"), "Story card must display category when present")
  assert.ok(cardCode.includes("readingTime"), "Story card must display reading time")
  assert.ok(cardCode.includes("formattedDate"), "Story card must display publication date")

  // 3. Clean link target without nested buttons
  assert.ok(!cardCode.includes("<button"), "Story card link must not contain nested button elements")

  // 4. Archive heading and subtitle
  assert.ok(archiveCode.includes("Stories"), "Archive must have clean Stories heading")
  assert.ok(archiveCode.includes("Words, collected over time."), "Archive must have subtle supporting text")
})

test("Story Archive: Responsive grid layout", () => {
  const archiveCode = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryArchive.tsx"), "utf-8")
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // 1. Mobile-first single-column and desktop 3-column grid
  assert.ok(
    archiveCode.includes("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"),
    "Must use responsive 1-col mobile, 2-col tablet, 3-col desktop grid"
  )

  // 2. Fixed stationary coastal background definition in CSS
  assert.ok(css.includes(".bhvy-coastal-fixed-bg {"), "Must define .bhvy-coastal-fixed-bg")
  assert.ok(css.includes("position: fixed;"), "Fixed background must use position: fixed")
})

test("Story Archive: Accessible card interactions and focus", () => {
  const cardCode = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryCard.tsx"), "utf-8")
  const bgCode = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyBackground.tsx"), "utf-8")

  // 1. Visible keyboard focus on story cards
  assert.ok(cardCode.includes("focus-visible:outline-2"), "Story card must provide visible focus indicator")
  assert.ok(cardCode.includes("aria-label="), "Story card must provide descriptive accessible aria-label")

  // 2. Background is stationary and accessible
  assert.ok(bgCode.includes('aria-hidden="true"'), "Background must be marked aria-hidden")
  assert.ok(bgCode.includes("pointer-events-none"), "Background must have pointer-events-none")
})
