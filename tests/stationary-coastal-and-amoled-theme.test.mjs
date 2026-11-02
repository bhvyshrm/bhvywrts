import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Stationary Coastal Background: Homepage uses viewport-fixed stationary wallpaper without parallax or scroll listeners", () => {
  const galaxyBg = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyBackground.tsx"), "utf-8")
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // 1. Fixed positioning and non-interactive
  assert.ok(galaxyBg.includes("bhvy-coastal-fixed-bg"), "Must use bhvy-coastal-fixed-bg class")
  assert.ok(galaxyBg.includes("fixed inset-0"), "Must fix to viewport inset-0")
  assert.ok(galaxyBg.includes("pointer-events-none"), "Must disable pointer events so clicks pass through")
  assert.ok(galaxyBg.includes('aria-hidden="true"'), "Must mark decorative background aria-hidden")

  // 2. Stationary in CSS (no movement, transform: none !important)
  assert.ok(css.includes(".bhvy-coastal-fixed-bg {"), "globals.css must define .bhvy-coastal-fixed-bg")
  assert.ok(css.includes("transform: none !important;"), "Background must strictly forbid transforms")
  assert.ok(css.includes('background-image: url("/images/bhvy-coastal-background.webp");'), "Desktop must use WebP coastal background")
  assert.ok(css.includes('background-image: url("/images/bhvy-coastal-background-mobile.webp");'), "Mobile must use mobile-optimized WebP coastal background")

  // 3. Stacking: content is above background
  assert.ok(home.includes("relative z-10"), "Main content must sit above fixed background at z-10")

  // 4. No parallax or scroll event listeners in background
  assert.ok(!galaxyBg.includes('"scroll"') && !galaxyBg.includes("'scroll'"), "GalaxyBackground must not attach scroll listeners")
  assert.ok(!galaxyBg.includes("useScroll"), "GalaxyBackground must not use Framer Motion scroll physics")
  assert.ok(!galaxyBg.includes("useTransform"), "GalaxyBackground must not transform background with scroll")
})

test("AMOLED Black Theme: Individual story pages strictly enforce pure #000000 reading environment", () => {
  const storyDetail = fs.readFileSync(path.join(ROOT, "src/components/StoryDetailView.tsx"), "utf-8")
  const ambient = fs.readFileSync(path.join(ROOT, "src/components/AmbientBackground.tsx"), "utf-8")

  // 1. AmbientBackground returns null on story pages
  assert.ok(ambient.includes('pathname.startsWith("/stories/") && pathname !== "/stories"'), "AmbientBackground must identify individual story pages")
  assert.ok(ambient.includes("return null"), "AmbientBackground must return null on individual story pages")

  // 2. StoryDetailView enforces pure AMOLED black (#000000)
  assert.ok(storyDetail.includes('document.documentElement.style.backgroundColor = "#000000"'), "Document element must lock to #000000")
  assert.ok(storyDetail.includes('document.body.style.backgroundColor = "#000000"'), "Document body must lock to #000000")
  assert.ok(storyDetail.includes("bg-[#000000]"), "StoryDetailView header must enforce bg-[#000000]")

  // 3. Ambient store is cleared on story pages
  assert.ok(storyDetail.includes("setBgImage(null)"), "Ambient background store must be cleared")

  // 4. No large glass panel behind story text
  assert.ok(!storyDetail.includes("reading-glass"), "Story prose must not be wrapped in heavy glass")
})
