import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Liquid Glass Theme: globals.css light mode tokens integrity", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // 1. Light background tokens
  assert.ok(css.includes("--bg-base: #f2fafa;"), "Must specify pale aqua base #f2fafa")
  assert.ok(css.includes("--background: #f2fafa;"), "Must specify pale aqua background #f2fafa")

  // 2. Flow gradients with pale aqua, soft cyan, and muted blue
  assert.ok(css.includes("--flow-grad-1:"), "Must define flow-grad-1")
  assert.ok(css.includes("--flow-grad-2:"), "Must define flow-grad-2")
  assert.ok(css.includes("--flow-grad-3:"), "Must define flow-grad-3")
  assert.ok(css.includes("--flow-grad-4:"), "Must define flow-grad-4")
  assert.ok(css.includes("--flow-grad-refraction:"), "Must define caustic refraction gradient")
  assert.ok(css.includes("--flow-vignette:"), "Must define atmospheric vignette")

  // 3. Liquid Glass material tokens
  assert.ok(css.includes("--glass-fill: rgba(255, 255, 255, 0.62);"), "Must define translucent glass fill")
  assert.ok(css.includes("--glass-fill-strong: rgba(255, 255, 255, 0.78);"), "Must define strong glass fill")
  assert.ok(css.includes("--glass-border: rgba(255, 255, 255, 0.78);"), "Must define semi-transparent white border")
  assert.ok(css.includes("--glass-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.92)"), "Must define specular inner highlight")
  assert.ok(css.includes("--glass-shadow: 0 12px 36px rgba(10, 57, 64, 0.06)"), "Must define delicate aqua-tinted shadow")

  // 4. Fallback support
  assert.ok(css.includes("@supports not (backdrop-filter: blur(1px))"), "Must define backdrop-filter fallback")
  assert.ok(css.includes(".light .glass-strong,"), "Must include light mode strong fallback")
})

test("Dark Mode Preservation: dark theme tokens remain intact", () => {
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // Extract root/dark block
  const darkMatch = css.match(/(:root,\s*\.dark\s*\{[\s\S]*?\n\})/)
  assert.ok(darkMatch, "Must retain :root, .dark theme declaration")
  const darkBlock = darkMatch[1]

  assert.ok(darkBlock.includes("--bg-base: #061014;"), "Dark mode base background must remain #061014")
  assert.ok(darkBlock.includes("--aqua-deep: #0a3940;"), "Dark mode aqua deep must remain #0a3940")
  assert.ok(darkBlock.includes("--glass-fill: rgba(255, 255, 255, 0.08);"), "Dark mode glass fill must remain 0.08")
  assert.ok(darkBlock.includes("--card: #0d0d12;"), "Dark mode card must remain #0d0d12")
})

test("Component Material Integration: Navbar, Hero, and StoryCard theme-awareness", () => {
  const navbar = fs.readFileSync(path.join(ROOT, "src/components/Navbar.tsx"), "utf-8")
  const home = fs.readFileSync(path.join(ROOT, "src/components/HomeContent.tsx"), "utf-8")
  const storyCard = fs.readFileSync(path.join(ROOT, "src/components/StoryCard.tsx"), "utf-8")

  // Navbar has refined light mode shadow while preserving dark mode shadow
  assert.ok(
    navbar.includes("shadow-[0_12px_36px_rgba(10,57,64,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"),
    "Navbar must apply theme-aware liquid glass shadow"
  )

  // Featured story hero has light mode border and shadow
  assert.ok(
    home.includes("border-white/80 dark:border-white/20 shadow-[0_20px_50px_rgba(10,57,64,0.06)] dark:shadow-2xl"),
    "Featured hero must apply theme-aware glass border and shadow"
  )

  // StoryCard hover has theme-aware border and shadow
  assert.ok(
    storyCard.includes("group-hover:border-white/80 dark:group-hover:border-white/30 group-hover:shadow-[0_20px_50px_rgba(10,57,64,0.12)] dark:group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"),
    "StoryCard hover must apply theme-aware glass border and shadow"
  )
})
