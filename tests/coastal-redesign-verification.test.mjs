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

  // GalaxyBackground uses stationary fixed background with zero scroll listeners and zero parallax transforms
  assert.ok(!galaxyBg.includes("setScrollY"), "GalaxyBackground must not trigger React re-renders on scroll")
  assert.ok(!galaxyBg.includes('"scroll"') && !galaxyBg.includes("'scroll'"), "GalaxyBackground must not attach scroll listeners")
  assert.ok(galaxyBg.includes("bhvy-coastal-fixed-bg"), "GalaxyBackground must use stationary bhvy-coastal-fixed-bg")
})

test("Stationary Fixed Background: Viewport-fixed coastal wallpaper with zero scroll movement", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")
  const galaxyBg = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyBackground.tsx"), "utf-8")
  const ambient = fs.readFileSync(path.join(ROOT, "src/components/AmbientBackground.tsx"), "utf-8")
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  // CSS fixed stationary class
  assert.ok(css.includes(".bhvy-coastal-fixed-bg"), "globals.css must define .bhvy-coastal-fixed-bg")
  assert.ok(css.includes("position: fixed;"), "Fixed background must use position: fixed")
  assert.ok(css.includes("inset: 0;"), "Fixed background must use inset: 0")
  assert.ok(css.includes("background-size: cover;"), "Fixed background must use background-size: cover")
  assert.ok(css.includes("pointer-events: none;"), "Fixed background must have pointer-events: none")
  assert.ok(css.includes("z-index: 0;"), "Fixed background must be at z-index: 0 to stay behind content")
  assert.ok(css.includes("transform: none"), "Fixed background must ensure transform is none")

  // HomeContent stacking context
  assert.ok(home.includes("relative z-10"), "Home content must sit above fixed background at z-10")

  // Zero parallax or scroll shifting in GalaxyBackground
  assert.ok(!galaxyBg.includes("translate3d"), "GalaxyBackground must not shift image with translate3d")
  assert.ok(!galaxyBg.includes("requestAnimationFrame"), "GalaxyBackground must not use rAF scroll animation loops")

  // AmbientBackground provides the same stationary fixed background on scenic subpages
  assert.ok(ambient.includes("bhvy-coastal-fixed-bg"), "AmbientBackground must use bhvy-coastal-fixed-bg on scenic subpages")
})

test("AMOLED Black Story Theme: Pure #000000 reading environment with zero coastal wallpaper leakage", () => {
  const storyDetail = fs.readFileSync(path.join(ROOT, "src/components/StoryDetailView.tsx"), "utf-8")
  const ambient = fs.readFileSync(path.join(ROOT, "src/components/AmbientBackground.tsx"), "utf-8")

  // AmbientBackground returns null on story detail pages
  assert.ok(ambient.includes('pathname.startsWith("/stories/")'), "AmbientBackground must detect story detail pages")
  assert.ok(ambient.includes("return null"), "AmbientBackground must return null on story detail pages")

  // StoryDetailView uses AMOLED pure black (#000000)
  assert.ok(storyDetail.includes("bg-[#000000]"), "StoryDetailView must enforce bg-[#000000]")
  assert.ok(storyDetail.includes('document.documentElement.style.backgroundColor = "#000000"'), "Document root must lock to pure AMOLED black")
  assert.ok(storyDetail.includes('document.body.style.backgroundColor = "#000000"'), "Document body must lock to pure AMOLED black")

  // Ambient store is cleared on story detail pages
  assert.ok(storyDetail.includes("setBgImage(null)"), "Ambient store image must be set to null on story pages")

  // No large glass panel behind story prose
  assert.ok(!storyDetail.includes("reading-glass"), "Story prose must not be trapped in a reading-glass panel")
  assert.ok(storyDetail.includes("reading-prose"), "Story prose must use clean typography reading-prose")
})

test("Mobile Reading Comfort: No heavy blur behind long text", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  assert.ok(css.includes("@media (max-width: 767px)"), "CSS must contain mobile responsive queries")
  assert.ok(css.includes("backdrop-filter: none;"), "Reading glass must disable expensive backdrop-filter on mobile")
})

test("Homepage Structure: Navbar -> Stationary Background -> Story Archive -> Minimal Footer", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")

  const navbarIndex = home.indexOf("<Navbar")
  const bgIndex = home.indexOf("<GalaxyBackground")
  const archiveIndex = home.indexOf("<HomeStoryArchive")
  const footerIndex = home.indexOf("<Footer")

  assert.ok(navbarIndex !== -1, "Navbar must exist on homepage")
  assert.ok(bgIndex !== -1, "Stationary Background must exist on homepage")
  assert.ok(archiveIndex !== -1, "Latest stories archive must exist on homepage")
  assert.ok(footerIndex !== -1, "Minimal Footer must exist on homepage")

  assert.ok(navbarIndex < archiveIndex, "Navbar must precede Story Archive")
  assert.ok(archiveIndex < footerIndex, "Story Archive must precede Footer")

  // Ensure non-archive sections are removed from homepage
  assert.ok(!home.includes("<GalaxyHero"), "Hero banner must be removed from homepage")
  assert.ok(!home.includes("<GalaxyCollections"), "Collections section must be removed from homepage")
  assert.ok(!home.includes("<GalaxyJourneyLink"), "Journey/About link must be removed from homepage")
})
