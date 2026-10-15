import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Dark-Only Theme: globals.css dark Aurora Glass tokens integrity", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // 1. Dark background tokens
  assert.ok(css.includes("--bg-base: #061014;"), "Must specify dark base #061014")
  assert.ok(css.includes("--background: #061014;"), "Must specify dark background #061014")

  // 2. Midnight Aurora flow gradients
  assert.ok(css.includes("--flow-grad-1:"), "Must define flow-grad-1")
  assert.ok(css.includes("--flow-grad-2:"), "Must define flow-grad-2")
  assert.ok(css.includes("--flow-grad-3:"), "Must define flow-grad-3")
  assert.ok(css.includes("--flow-grad-4:"), "Must define flow-grad-4")
  assert.ok(css.includes("--flow-grad-refraction:"), "Must define caustic refraction gradient")
  assert.ok(css.includes("--flow-vignette:"), "Must define atmospheric vignette")

  // 3. Dark Aurora Glass material tokens
  assert.ok(css.includes("--glass-fill: rgba(255, 255, 255, 0.08);"), "Must define translucent glass fill")
  assert.ok(css.includes("--glass-fill-strong: rgba(255, 255, 255, 0.14);"), "Must define strong glass fill")
  assert.ok(css.includes("--glass-border: rgba(255, 255, 255, 0.18);"), "Must define subtle border")
  assert.ok(css.includes("--glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.25)"), "Must define specular inner highlight")
  assert.ok(css.includes("--glass-shadow: 0 20px 60px rgba(0, 0, 0, 0.45)"), "Must define glass shadow")

  // 4. Color scheme dark and no light theme block
  assert.ok(css.includes("color-scheme: dark;"), "Must enforce color-scheme: dark")
  assert.ok(!css.includes(".light {"), "Must have removed .light theme block")
  assert.ok(!css.includes("html.light"), "Must have removed html.light declaration")
})

test("Dark Mode Layout Enforcement: layout.tsx forces dark and dark themeColor", () => {
  const layout = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf-8")

  assert.ok(layout.includes('themeColor: "#061014"'), "Browser themeColor must be #061014")
  assert.ok(layout.includes('forcedTheme="dark"'), "ThemeProvider must force dark theme")
  assert.ok(!layout.includes("maximumScale: 1"), "Must not restrict viewport zoom")
})

test("Component Material Integration: Navbar, Hero, and StoryCard dark liquid glass", () => {
  const navbar = fs.readFileSync(path.join(ROOT, "src/components/Navbar.tsx"), "utf-8")
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")
  const storyCard = fs.readFileSync(path.join(ROOT, "src/components/StoryCard.tsx"), "utf-8")

  // Navbar has glass styling without theme switcher
  assert.ok(!navbar.includes("<ThemeToggle"), "Navbar must not include ThemeToggle")
  assert.ok(navbar.includes("glass-pill"), "Navbar must retain glass-pill styling")

  // Featured story hero has glass styling
  assert.ok(
    home.includes("border-white/80 dark:border-white/20 shadow-[0_20px_50px_rgba(10,57,64,0.06)] dark:shadow-2xl"),
    "Featured hero must apply glass border and shadow"
  )

  // StoryCard hover has glass border and shadow
  assert.ok(
    storyCard.includes("group-hover:border-white/80 dark:group-hover:border-white/30 group-hover:shadow-[0_20px_50px_rgba(10,57,64,0.12)] dark:group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"),
    "StoryCard hover must apply glass border and shadow"
  )
})
