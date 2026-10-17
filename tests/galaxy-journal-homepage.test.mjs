import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Galaxy Journal 3.0: Homepage architecture and component structure", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // 1. Verifies galaxy components are integrated
  assert.ok(home.includes("<GalaxyBackground"), "Must include GalaxyBackground component")
  assert.ok(home.includes("<GalaxyHero"), "Must include GalaxyHero component")
  assert.ok(home.includes("<GalaxyStoryGallery"), "Must include GalaxyStoryGallery component")
  assert.ok(home.includes("<GalaxyCollections"), "Must include GalaxyCollections component")
  assert.ok(home.includes("<GalaxyJourneyLink"), "Must include GalaxyJourneyLink component")

  // 2. Preserves Navbar and Footer
  assert.ok(home.includes("<Navbar />") || home.includes("<Navbar"), "Must preserve Navbar")
  assert.ok(home.includes("<Footer />"), "Must preserve Footer")
  assert.ok(home.includes("<FloatingWriteButton />"), "Must preserve FloatingWriteButton")
})

test("Galaxy Journal 3.0: Story routes and title-only card integrity", () => {
  const routesCode = fs.readFileSync(path.join(ROOT, "src/components/galaxy/routes.ts"), "utf-8")
  const cardCode = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyStoryCard.tsx"), "utf-8")
  const hookCode = fs.readFileSync(path.join(ROOT, "src/components/galaxy/useGalaxyStories.ts"), "utf-8")

  // 1. Route helper ensures /stories/[slug] format
  assert.ok(routesCode.includes('`/stories/${encodeURIComponent(slug.trim())}`'), "Must map to /stories/[slug]")
  assert.ok(routesCode.includes('`/collections/${encodeURIComponent(collectionName.trim().toLowerCase())}`'), "Must map to /collections/[slug]")

  // 2. Title-Only Rule: Cards must NOT display excerpts, reading times, dates, or badges inside card text
  assert.ok(!cardCode.includes("readingTime"), "Story card must NOT display reading time text")
  assert.ok(!cardCode.includes("formatDate"), "Story card must NOT display publication date text")
  assert.ok(!cardCode.includes("likeCount"), "Story card must NOT display like count text")
  assert.ok(!cardCode.includes("excerpt"), "Story card must NOT display excerpt text")

  // 3. Excludes ineligible stories (locked and unpublished)
  assert.ok(hookCode.includes("story.published === true"), "Must require story.published === true")
  assert.ok(hookCode.includes("!story.isLocked"), "Must filter out locked stories")
})
