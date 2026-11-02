import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Coastal Wallpaper Assets: local optimized WebP and original exist", () => {
  const original = path.join(ROOT, "public/images/bhvy-coastal-original.jpg")
  const desktopWebp = path.join(ROOT, "public/images/bhvy-coastal-background.webp")
  const mobileWebp = path.join(ROOT, "public/images/bhvy-coastal-background-mobile.webp")
  const desktopJpg = path.join(ROOT, "public/images/bhvy-coastal-background.jpg")

  assert.ok(fs.existsSync(original), "Original uploaded wallpaper must exist in public/images")
  assert.ok(fs.existsSync(desktopWebp), "Optimized desktop WebP must exist")
  assert.ok(fs.existsSync(mobileWebp), "Optimized mobile portrait WebP must exist")
  assert.ok(fs.existsSync(desktopJpg), "Desktop JPG fallback must exist")

  const desktopStats = fs.statSync(desktopWebp)
  const mobileStats = fs.statSync(mobileWebp)
  // Ensure optimized under 300KB
  assert.ok(desktopStats.size < 300 * 1024, "Desktop asset must be web-optimized under 300KB")
  assert.ok(mobileStats.size < 120 * 1024, "Mobile asset must be web-optimized under 120KB")
})

test("Branding: bhvy. lowercase branding with period across public entrypoints", () => {
  const layout = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf-8")
  const page = fs.readFileSync(path.join(ROOT, "src/app/page.tsx"), "utf-8")
  const logo = fs.readFileSync(path.join(ROOT, "src/components/Logo.tsx"), "utf-8")
  const footer = fs.readFileSync(path.join(ROOT, "src/components/Footer.tsx"), "utf-8")

  assert.ok(layout.includes('default: "bhvy. — Digital Journal"'), "Layout title must reflect bhvy.")
  assert.ok(page.includes('title: "bhvy. — Digital Journal"'), "Home page metadata must reflect bhvy.")
  assert.ok(page.includes('name: "bhvy."'), "JSON-LD must specify bhvy.")
  assert.ok(logo.includes("bhvy"), "Logo must use lowercase bhvy wordmark")
  assert.ok(footer.includes("bhvy."), "Footer must use bhvy. branding")
})

test("Performance: Background rendering without blocking solid black and blur overhead", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")
  const ambient = fs.readFileSync(path.join(ROOT, "src/components/AmbientBackground.tsx"), "utf-8")
  const galaxyBg = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyBackground.tsx"), "utf-8")

  // Transparent body so background is visible
  assert.ok(css.includes("background-color: transparent;"), "Body background must be transparent")

  // No expensive continuously animated blur shapes
  assert.ok(!ambient.includes("animate-aqua-flow-1"), "AmbientBackground must not run continuous blur animations")
  assert.ok(!ambient.includes("feTurbulence"), "AmbientBackground must not render CPU-heavy SVG turbulence")

  // GalaxyBackground uses direct ref transforms or static positioning on mobile instead of scroll-listener state re-renders
  assert.ok(!galaxyBg.includes("setScrollY"), "GalaxyBackground must not trigger React re-renders on scroll")
  assert.ok(galaxyBg.includes("max-width: 768px"), "GalaxyBackground must check mobile breakpoint to disable scroll parallax")
})

test("Mobile Reading Comfort: No heavy blur behind long text", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  assert.ok(css.includes("@media (max-width: 767px)"), "CSS must contain mobile responsive queries")
  assert.ok(css.includes("backdrop-filter: none;"), "Reading glass must disable expensive backdrop-filter on mobile")
})

test("Homepage Structure: Navbar -> Hero -> Latest stories -> Collections -> Journey/About -> Footer", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  const heroIndex = home.indexOf("<GalaxyHero")
  const galleryIndex = home.indexOf("<GalaxyStoryGallery")
  const collectionsIndex = home.indexOf("<GalaxyCollections")
  const journeyIndex = home.indexOf("<GalaxyJourneyLink")
  const footerIndex = home.indexOf("<Footer")

  assert.ok(heroIndex !== -1, "Hero must exist")
  assert.ok(galleryIndex !== -1, "Latest stories gallery must exist")
  assert.ok(collectionsIndex !== -1, "Collections must exist")
  assert.ok(journeyIndex !== -1, "Journey/About link must exist")
  assert.ok(footerIndex !== -1, "Footer must exist")

  assert.ok(heroIndex < galleryIndex, "Hero must precede Latest stories")
  assert.ok(galleryIndex < collectionsIndex, "Latest stories must precede Collections")
  assert.ok(collectionsIndex < journeyIndex, "Collections must precede Journey/About")
  assert.ok(journeyIndex < footerIndex, "Journey/About must precede Footer")
})
