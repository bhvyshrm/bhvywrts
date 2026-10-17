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

test("Galaxy Journal 3.0: Responsive layout and breakpoint handling", () => {
  const gallery = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyStoryGallery.tsx"), "utf-8")
  const hero = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyHero.tsx"), "utf-8")
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // 1. Mobile-first track architecture
  assert.ok(gallery.includes("md:hidden"), "Must contain dedicated mobile track (< 768px)")
  assert.ok(gallery.includes("snap-x snap-mandatory"), "Mobile track must support CSS scroll snapping")
  assert.ok(gallery.includes("hidden md:block"), "Must contain desktop perspective track (>= 768px)")

  // 2. Responsive hero scaling
  assert.ok(hero.includes("text-[32px] min-[360px]:text-4xl"), "Hero must scale down gracefully for narrow viewports")
  assert.ok(hero.includes("font-[var(--font-instrument-serif)]"), "Hero must use brand Instrument Serif font")

  // 3. Responsive galaxy container definition
  assert.ok(css.includes(".galaxy-container {"), "Must define .galaxy-container utility")
  assert.ok(css.includes("max-width: 1680px;"), "Galaxy container max width must be 1680px")
})

test("Galaxy Journal 3.0: Accessible gallery interactions and reduced-motion", () => {
  const gallery = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyStoryGallery.tsx"), "utf-8")
  const hero = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyHero.tsx"), "utf-8")
  const bg = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyBackground.tsx"), "utf-8")
  const card = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyStoryCard.tsx"), "utf-8")

  // 1. Prefers-reduced-motion detection across all key components
  assert.ok(gallery.includes("(prefers-reduced-motion: reduce)"), "Gallery must detect reduced motion")
  assert.ok(hero.includes("(prefers-reduced-motion: reduce)"), "Hero must detect reduced motion")
  assert.ok(bg.includes("(prefers-reduced-motion: reduce)"), "Background must detect reduced motion")

  // 2. Keyboard gallery navigation buttons
  assert.ok(gallery.includes('aria-label="Previous stories"'), "Must provide accessible previous button")
  assert.ok(gallery.includes('aria-label="Next stories"'), "Must provide accessible next button")

  // 3. Visible keyboard focus on story cards
  assert.ok(card.includes("focus-visible:ring-2"), "Story card must provide visible focus indicator")
  assert.ok(card.includes("aria-label="), "Story card must provide descriptive accessible aria-label")

  // 4. Clean link target without nested buttons
  assert.ok(!card.includes("<button"), "Story card link must not contain nested button elements")
})
