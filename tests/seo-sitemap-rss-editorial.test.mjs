import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

test("SEO Metadata & JSON-LD: public routes have canonical URLs and structured data", () => {
  const home = fs.readFileSync(path.join(ROOT, "src/app/page.tsx"), "utf-8")
  const stories = fs.readFileSync(path.join(ROOT, "src/app/stories/page.tsx"), "utf-8")
  const storyDetail = fs.readFileSync(path.join(ROOT, "src/app/stories/[slug]/page.tsx"), "utf-8")
  const collections = fs.readFileSync(path.join(ROOT, "src/app/collections/page.tsx"), "utf-8")
  const collectionDetail = fs.readFileSync(path.join(ROOT, "src/app/collections/[slug]/page.tsx"), "utf-8")
  const about = fs.readFileSync(path.join(ROOT, "src/app/about/page.tsx"), "utf-8")
  const journey = fs.readFileSync(path.join(ROOT, "src/app/writing-journey/page.tsx"), "utf-8")

  // Canonical URLs
  assert.ok(home.includes("https://bhvywrts.vercel.app"), "Home must have canonical URL")
  assert.ok(stories.includes("https://bhvywrts.vercel.app/stories"), "Stories must have canonical URL")
  assert.ok(collections.includes("https://bhvywrts.vercel.app/collections"), "Collections must have canonical URL")
  assert.ok(about.includes("https://bhvywrts.vercel.app/about"), "About must have canonical URL")
  assert.ok(journey.includes("https://bhvywrts.vercel.app/writing-journey"), "Writing journey must have canonical URL")
  assert.ok(storyDetail.includes("canonical: canonicalUrl"), "Story detail must generate dynamic canonical URL")
  assert.ok(collectionDetail.includes("canonical: canonicalUrl"), "Collection detail must generate dynamic canonical URL")

  // Structured Data JSON-LD
  assert.ok(home.includes('"@type": "WebSite"'), "Home must include WebSite JSON-LD")
  assert.ok(collections.includes('"@type": "CollectionPage"'), "Collections must include CollectionPage JSON-LD")
  assert.ok(collectionDetail.includes('"@type": "CollectionPage"'), "Collection detail must include CollectionPage JSON-LD")
  assert.ok(about.includes('"@type": "Person"'), "About must include Person JSON-LD")
  assert.ok(storyDetail.includes('"@type": "BlogPosting"'), "Story detail must include BlogPosting JSON-LD")
})

test("Sitemap & Robots: routes conform to requirements", () => {
  const sitemapFile = fs.readFileSync(path.join(ROOT, "src/app/sitemap.ts"), "utf-8")
  const robotsFile = fs.readFileSync(path.join(ROOT, "src/app/robots.ts"), "utf-8")

  // Sitemap
  assert.ok(sitemapFile.includes("https://bhvywrts.vercel.app"), "Sitemap must use production domain")
  assert.ok(sitemapFile.includes("/writing-journey"), "Sitemap must include writing-journey")
  assert.ok(sitemapFile.includes("/collections/"), "Sitemap must include collection routes")
  assert.ok(sitemapFile.includes("s.published && !s.isLocked"), "Sitemap must exclude unpublished and locked stories")

  // Robots
  assert.ok(robotsFile.includes('userAgent: "*"'), "Robots must target all user agents")
  assert.ok(robotsFile.includes('allow: "/"'), "Robots must allow root")
  assert.ok(robotsFile.includes('disallow: ['), "Robots must define disallow rules")
  assert.ok(robotsFile.includes("/admin"), "Robots must disallow admin")
  assert.ok(robotsFile.includes("/api/"), "Robots must disallow api")
  assert.ok(robotsFile.includes("https://bhvywrts.vercel.app/sitemap.xml"), "Robots must link to sitemap.xml")
})

test("RSS 2.0 Feed: route configuration and structure", () => {
  const rssFile = fs.readFileSync(path.join(ROOT, "src/app/rss.xml/route.ts"), "utf-8")

  assert.ok(rssFile.includes('application/rss+xml; charset=utf-8'), "RSS must set application/rss+xml header")
  assert.ok(rssFile.includes('<rss version="2.0"'), "Must be valid RSS 2.0")
  assert.ok(rssFile.includes('xmlns:atom="http://www.w3.org/2005/Atom"'), "Must define Atom namespace")
  assert.ok(rssFile.includes('atom:link'), "Must include Atom self link")
  assert.ok(rssFile.includes("/rss.xml"), "Atom link must target /rss.xml")
  assert.ok(rssFile.includes('<guid isPermaLink="true">'), "Items must include permalink GUID")
  assert.ok(rssFile.includes("<pubDate>"), "Items must include pubDate")
  assert.ok(rssFile.includes("<enclosure"), "Items must include image enclosure when cover exists")
})

test("Information Architecture: Writing Journey rename & navigation", () => {
  const navbar = fs.readFileSync(path.join(ROOT, "src/components/Navbar.tsx"), "utf-8")
  const footer = fs.readFileSync(path.join(ROOT, "src/components/Footer.tsx"), "utf-8")
  const journey = fs.readFileSync(path.join(ROOT, "src/components/WritingJourney.tsx"), "utf-8")

  assert.ok(navbar.includes("Writing Journey"), "Navbar desktop/mobile must display Writing Journey")
  assert.ok(footer.includes("Writing Journey"), "Footer must display Writing Journey")
  assert.ok(journey.includes("Writing Journey"), "WritingJourney component must display Writing Journey")
  assert.ok(!navbar.includes('label: "Calendar"'), "Navbar must not display Calendar label")
  assert.ok(!footer.includes("Calendar"), "Footer must not display Calendar")
})

test("Desktop Reading Experience: two-column layout & recommendation sidebar", () => {
  const detail = fs.readFileSync(path.join(ROOT, "src/components/StoryDetailView.tsx"), "utf-8")

  assert.ok(detail.includes("lg:grid-cols-12"), "Must use 12-column grid for two-column desktop reading")
  assert.ok(detail.includes("lg:col-span-8"), "Story content must occupy ~65-70% (8/12)")
  assert.ok(detail.includes("lg:col-span-4"), "Sidebar must occupy ~30-35% (4/12)")
  assert.ok(detail.includes("More from Bhavya Writes"), "Sidebar must include More from Bhavya Writes")
  assert.ok(detail.includes("In this story"), "Sidebar must include Table of Contents section")
  assert.ok(detail.includes("Continue reading"), "Sidebar must include Continue reading navigation")
  assert.ok(detail.includes("Follow new writing by RSS"), "Sidebar must include RSS callout")
})

test("Accessibility: zoom enabled, skip to content, focus trap, and search input", () => {
  const layout = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf-8")
  const navbar = fs.readFileSync(path.join(ROOT, "src/components/Navbar.tsx"), "utf-8")
  const storiesArchive = fs.readFileSync(path.join(ROOT, "src/components/StoriesArchiveView.tsx"), "utf-8")

  // Zoom enabled
  assert.ok(!layout.includes("maximumScale: 1"), "Viewport must allow zooming")
  assert.ok(!layout.includes("userScalable: false"), "Viewport must not disable user scaling")

  // Skip to content
  assert.ok(layout.includes("Skip to content"), "Layout must provide Skip to content link")
  assert.ok(layout.includes("#main-content"), "Skip link must point to #main-content")

  // Search input accessibility
  assert.ok(storiesArchive.includes('name="q"'), "Stories search input must have name='q'")
  assert.ok(storiesArchive.includes('aria-label="Search stories'), "Stories search input must have aria-label")

  // Mobile drawer focus trap and semantics
  assert.ok(navbar.includes('role="dialog"'), "Mobile drawer must have role='dialog'")
  assert.ok(navbar.includes('aria-modal="true"'), "Mobile drawer must declare aria-modal='true'")
  assert.ok(navbar.includes('e.key === "Tab"'), "Mobile drawer must trap Tab key focus")
  assert.ok(navbar.includes('e.key === "Escape"'), "Mobile drawer must handle Escape key")
})
