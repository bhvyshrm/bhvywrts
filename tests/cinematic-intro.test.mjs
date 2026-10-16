import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("Cinematic Intro 2.0: Exact 7-second timeline and scene progression", () => {
  const introCode = fs.readFileSync(path.join(ROOT, "src/components/CinematicIntro.tsx"), "utf-8")

  // 1. Exact 7-second timeline constants
  assert.ok(introCode.includes("const T_BRAND = 1000"), "Scene 2 (Brand reveal) starts at 1.0s (1000ms)")
  assert.ok(introCode.includes("const T_IMAGE = 2200"), "Scene 3 (Cinematic imagery & Liquid Glass) starts at 2.2s (2200ms)")
  assert.ok(introCode.includes("const T_EDITORIAL = 3700"), "Scene 4 (Editorial statement) starts at 3.7s (3700ms)")
  assert.ok(introCode.includes("const T_FINAL = 5100"), "Scene 5 (Final composition) starts at 5.1s (5100ms)")
  assert.ok(introCode.includes("const T_DISSOLVE = 6200"), "Scene 6 (Homepage transition dissolve) starts at 6.2s (6200ms)")
  assert.ok(introCode.includes("const T_END = 7000"), "Sequence completes and unmounts at exactly 7.0s (7000ms)")

  // 2. Dissolve duration fills 6.2s to 7.0s (0.8s)
  assert.ok(introCode.includes("duration: isReducedMotion ? 0.3 : 0.8"), "Dissolve transition must be 0.8s to span 6.2s - 7.0s")
})

test("Cinematic Intro 2.0: AMOLED Black #050505 and Aqua Flow atmosphere", () => {
  const introCode = fs.readFileSync(path.join(ROOT, "src/components/CinematicIntro.tsx"), "utf-8")
  const css = fs.readFileSync(path.join(ROOT, "src/app/globals.css"), "utf-8")

  // AMOLED Black base
  assert.ok(css.includes("html.intro-active {\n    background-color: #050505 !important;"), "html.intro-active must be #050505")
  assert.ok(introCode.includes("bg-[#050505]"), "Intro root must specify AMOLED black #050505")

  // Aqua Flow reflections & subtle strawberry-pink/lavender accents
  assert.ok(introCode.includes("rgba(27, 104, 112,"), "Atmosphere must feature central aqua reflection")
  assert.ok(introCode.includes("rgba(79, 174, 181,"), "Atmosphere must feature cyan refraction highlight")
  assert.ok(introCode.includes("rgba(244, 167, 199,"), "Atmosphere must feature restrained strawberry-pink edge reflection")
  assert.ok(introCode.includes("rgba(100, 117, 184,"), "Atmosphere must feature restrained lavender edge reflection")
})

test("Cinematic Intro 2.0: Liquid Glass material and typography", () => {
  const introCode = fs.readFileSync(path.join(ROOT, "src/components/CinematicIntro.tsx"), "utf-8")

  // Liquid Glass backing layer
  assert.ok(introCode.includes("Liquid Glass Backing Layer"), "Must include Liquid Glass Backing Layer")
  assert.ok(introCode.includes("backdrop-blur-md"), "Liquid Glass must specify backdrop blur")
  assert.ok(introCode.includes("inset 0 1px 0 rgba(255, 255, 255,"), "Liquid Glass must feature specular inner highlight")
  assert.ok(introCode.includes("border border-white/"), "Liquid Glass must feature fine low-contrast border")

  // Brand and Editorial Typography
  assert.ok(introCode.includes("Bhavya Writes"), "Must preserve brand name Bhavya Writes")
  assert.ok(introCode.includes("var(--font-instrument-serif)"), "Brand must use Instrument Serif typography")
  assert.ok(introCode.includes("A quieter corner of the internet."), "Must display editorial statement: A quieter corner of the internet.")
  assert.ok(introCode.includes("var(--font-source-serif)"), "Editorial statement must use Source Serif typography")
})

test("Cinematic Intro 2.0: Skip control, session storage, and stuck prevention", () => {
  const introCode = fs.readFileSync(path.join(ROOT, "src/components/CinematicIntro.tsx"), "utf-8")

  // Skip button
  assert.ok(introCode.includes("Skip intro"), "Must include visible 'Skip intro' control")
  assert.ok(introCode.includes('aria-label="Skip intro and view homepage"'), "Skip button must include descriptive aria-label")
  assert.ok(introCode.includes("focus-visible:ring-2"), "Skip button must provide visible keyboard focus indicator")
  assert.ok(introCode.includes("top-5 right-5 sm:top-8 sm:right-8"), "Skip button must be positioned consistently in corner")

  // Session storage
  assert.ok(introCode.includes('sessionStorage.getItem("bhavy-intro-seen")'), "Must check sessionStorage for repeat visits")
  assert.ok(introCode.includes('sessionStorage.setItem("bhavy-intro-seen", "true")'), "Must record intro completion in sessionStorage")
  assert.ok(introCode.includes('classList.remove("intro-active")'), "Must remove intro-active from documentElement upon exit")

  // Safe failsafe stuck prevention
  assert.ok(introCode.includes("7400"), "Must include safety failsafe timer to prevent ever getting stuck")
})

test("Cinematic Intro 2.0: Accessibility and prefers-reduced-motion", () => {
  const introCode = fs.readFileSync(path.join(ROOT, "src/components/CinematicIntro.tsx"), "utf-8")

  // Prefers-reduced-motion detection
  assert.ok(introCode.includes('window.matchMedia("(prefers-reduced-motion: reduce)").matches'), "Must query prefers-reduced-motion")
  assert.ok(introCode.includes("isReducedMotion"), "Must track isReducedMotion state")
  assert.ok(introCode.includes("filter: isReducedMotion ? \"none\""), "Must bypass blur filter during reduced motion")
  assert.ok(introCode.includes("!isReducedMotion && phase >= 1"), "Must disable light sweep during reduced motion")
})
