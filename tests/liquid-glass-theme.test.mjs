import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("AMOLED Black Theme: globals.css dark Aurora Glass tokens integrity", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // 1. Dark background tokens — AMOLED Pure Black #000000
  assert.ok(css.includes("--bg-base: #000000;"), "Must specify AMOLED black base #000000")
  assert.ok(css.includes("--background: #000000;"), "Must specify AMOLED background #000000")
  assert.ok(css.includes("--surface: #050505;"), "Must specify AMOLED elevated surface #050505")
  assert.ok(css.includes("--card: #0d0d10;"), "Must specify AMOLED card surface #0d0d10")

  // 2. Midnight Aurora flow gradients
  assert.ok(css.includes("--flow-grad-1:"), "Must define flow-grad-1")
  assert.ok(css.includes("--flow-grad-2:"), "Must define flow-grad-2")
  assert.ok(css.includes("--flow-grad-3:"), "Must define flow-grad-3")
  assert.ok(css.includes("--flow-grad-4:"), "Must define flow-grad-4")
  assert.ok(css.includes("--flow-grad-refraction:"), "Must define caustic refraction gradient")
  assert.ok(css.includes("--flow-vignette:"), "Must define atmospheric vignette")

  // 3. Dark Aurora Glass material tokens
  assert.ok(css.includes("--glass-fill:"), "Must define translucent glass fill")
  assert.ok(css.includes("--glass-fill-strong:"), "Must define strong glass fill")
  assert.ok(css.includes("--glass-border:"), "Must define subtle border")
  assert.ok(css.includes("--glass-highlight:"), "Must define specular inner highlight")
  assert.ok(css.includes("--glass-shadow:"), "Must define glass shadow")

  // 4. Color scheme dark and no light theme block
  assert.ok(css.includes("color-scheme: dark;"), "Must enforce color-scheme: dark")
  assert.ok(!css.includes(".light {"), "Must have removed .light theme block")
  assert.ok(!css.includes("html.light"), "Must have removed html.light declaration")
})

test("Dark Mode Layout Enforcement: layout.tsx forces dark and dark themeColor", () => {
  const layout = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf-8")

  assert.ok(layout.includes('themeColor: "#000000"'), "Browser themeColor must be AMOLED #000000")
  assert.ok(layout.includes('forcedTheme="dark"'), "ThemeProvider must force dark theme")
  assert.ok(!layout.includes("maximumScale: 1"), "Must not restrict viewport zoom")
})

test("Component Material Integration: Navbar, Hero, and StoryCard dark liquid glass", () => {
  const navbar = fs.readFileSync(path.join(ROOT, "src/components/Navbar.tsx"), "utf-8")
  const hero = fs.readFileSync(path.join(ROOT, "src/components/galaxy/GalaxyHero.tsx"), "utf-8")
  const storyCard = fs.readFileSync(path.join(ROOT, "src/components/StoryCard.tsx"), "utf-8")

  // Navbar has glass styling without theme switcher
  assert.ok(!navbar.includes("<ThemeToggle"), "Navbar must not include ThemeToggle")
  assert.ok(navbar.includes("glass-pill"), "Navbar must retain glass-pill styling")

  // Featured story hero has glass styling & border
  assert.ok(
    hero.includes("border-white/10"),
    "Featured hero must apply glass border"
  )

  // StoryCard hover has glass border and shadow
  assert.ok(
    storyCard.includes("group-hover:border-white/80 dark:group-hover:border-white/30 group-hover:shadow-[0_20px_50px_rgba(10,57,64,0.12)] dark:group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"),
    "StoryCard hover must apply glass border and shadow"
  )
})
