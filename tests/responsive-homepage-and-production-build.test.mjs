import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Homepage Simplicity: Homepage contains ONLY minimal navbar, stationary coastal background, latest stories, and minimal footer", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")
  const page = fs.readFileSync(path.join(ROOT, "src/app/page.tsx"), "utf-8")

  // Must render HomeContent directly
  assert.ok(page.includes("<HomeContent />"), "LandingPage must render HomeContent directly")

  // Must include GalaxyBackground (stationary coastal background)
  assert.ok(home.includes("<GalaxyBackground />"), "Homepage must include GalaxyBackground")

  // Must include Navbar
  assert.ok(home.includes("<Navbar />"), "Homepage must include Navbar")

  // Must include HomeStoryArchive
  assert.ok(home.includes("<HomeStoryArchive"), "Homepage must include HomeStoryArchive")

  // Must include minimal Footer
  assert.ok(home.includes("<Footer />"), "Homepage must include Footer")

  // STRICT PROHIBITIONS: No promotional, hero, collections, or about sections
  assert.ok(!home.includes("<GalaxyHero"), "Must NOT include GalaxyHero banner")
  assert.ok(!home.includes("<GalaxyCollections"), "Must NOT include GalaxyCollections")
  assert.ok(!home.includes("<GalaxyJourneyLink"), "Must NOT include GalaxyJourneyLink")
  assert.ok(!home.includes("featuredStory"), "Must NOT include separate featured story highlight banner")
  assert.ok(!home.includes("Explore Stories"), "Must NOT include Explore Stories CTA button")
})

test("Story Archive Sorting & Dedup: Real publication order descending by createdAt", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // Checks Supabase query
  assert.ok(home.includes('.eq("published", true)'), "Must filter for published: true")
  assert.ok(
    home.includes('.order("createdAt", { ascending: false })'),
    "Must sort by createdAt descending in query"
  )

  // Checks in-memory client sort
  assert.ok(
    home.includes("new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()"),
    "Must sort newest published story first"
  )

  // Checks deduplication by ID
  assert.ok(home.includes("seen.has(s.id)"), "Must deduplicate stories by ID")
})

test("Story Archive Card Design: Full metadata presentation without inventing data", () => {
  const card = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryCard.tsx"), "utf-8")
  const archive = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryArchive.tsx"), "utf-8")

  // Header & Title
  assert.ok(archive.includes("Stories"), "Archive must have 'Stories' heading")
  assert.ok(archive.includes("Words, collected over time."), "Archive must have subtitle")
  assert.ok(card.includes("story.title"), "Card must display story title")

  // Metadata: Excerpt, Reading time, Publication date, Category
  assert.ok(card.includes("story.excerpt"), "Card must display excerpt if available")
  assert.ok(card.includes("readingTime"), "Card must display calculated or existing reading time")
  assert.ok(card.includes("formattedDate"), "Card must display publication date")
  assert.ok(card.includes("story.category"), "Card must display category if available")

  // Image cropping and aspect ratio
  assert.ok(card.includes("aspect-[16/10]"), "Card must enforce consistent 16:10 aspect ratio")
  assert.ok(card.includes("width={600}"), "Card image must specify width to prevent layout shifts")
  assert.ok(card.includes("height={375}"), "Card image must specify height to prevent layout shifts")
})

test("Responsive Grid: 1-column mobile, 2-column tablet, 3-column desktop layout", () => {
  const archive = fs.readFileSync(path.join(ROOT, "src/components/HomeStoryArchive.tsx"), "utf-8")
  assert.ok(
    archive.includes("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"),
    "Grid must be 1-column on mobile, 2-col on sm, 3-col on lg"
  )
})

test("Mobile Performance: No excessive blur, no scroll transform springs", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // No heavy framer-motion useScroll or useSpring in HomeContent
  assert.ok(!home.includes("useScroll"), "HomeContent must not attach scroll physics")
  assert.ok(!home.includes("useSpring"), "HomeContent must not use spring inertia on scroll")

  // Mobile blur reduction
  assert.ok(css.includes("@media (max-width: 767px)"), "Must optimize glass for mobile")
  assert.ok(css.includes("backdrop-filter: blur(8px)"), "Must reduce blur to 8px on mobile")
})

test("Theme Separation: Stationary coastal wallpaper on home vs AMOLED black on story pages", () => {
  const bg = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyBackground.tsx"), "utf-8")
  const ambient = fs.readFileSync(path.join(ROOT, "src/components/AmbientBackground.tsx"), "utf-8")
  const storyDetail = fs.readFileSync(path.join(ROOT, "src/components/StoryDetailView.tsx"), "utf-8")

  // Home stationary background
  assert.ok(bg.includes("bhvy-coastal-fixed-bg"), "Homepage must use stationary coastal fixed background")

  // Story page pure black
  assert.ok(ambient.includes('pathname.startsWith("/stories/")'), "Ambient must detect story pages")
  assert.ok(storyDetail.includes('document.documentElement.style.backgroundColor = "#000000"'), "Story page must lock to pure AMOLED black")
})
