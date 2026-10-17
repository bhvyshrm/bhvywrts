# Bhavya Writes — Galaxy Journal 3.0 Redesign

## 1. Executive Summary & Design Direction
Galaxy Journal 3.0 redesigns the Bhavya Writes homepage into a cinematic, quiet cosmic journal. Stories are suspended in deep AMOLED space, surrounded by subtle nebulae, delicate Aqua Flow reflections, floating Liquid Glass navigation, and scroll-driven perspective cards.

### Core Visual Principles
- **AMOLED-Black Foundation**: Deep cosmic palette (`#030306`, `#070811`, `#0B1022`, `#17112B`).
- **Restrained Aqua & Lavender Nebulae**: Retains the brand's signature Aqua Flow identity while adding cosmic depth.
- **Floating Liquid Glass Navigation**: Translucent pill navigation with subtle backdrop blur, specular inner highlights, fine low-contrast borders, and "Explore Stories" action.
- **Centered Brand Identity**: Clean, editorial typography featuring Instrument Serif and Source Serif 4.
- **Title-Only Story Cards**: Cinematic cards presenting strictly the story title and rich cover imagery without extraneous metadata (no excerpts, no reading times, no dates, no badges, no read buttons).
- **Perspective-Based Gallery**: Horizontal spatial depth on desktop with smooth scroll-driven transitions.
- **Responsive Mobile Track**: Touch-friendly horizontal snap gallery with optimized performance and reduced motion awareness.

---

## 2. Component Architecture
```
src/
├── components/
│   ├── galaxy/
│   │   ├── GalaxyBackground.tsx      # Layered cosmic background, nebulae, stars, and visibilitychange listener
│   │   ├── GalaxyHero.tsx            # Centered brand introduction & editorial statement
│   │   ├── GalaxyStoryCard.tsx       # Title-only cinematic story card with cosmic fallback
│   │   ├── GalaxyStoryGallery.tsx    # Perspective horizontal desktop & mobile snap gallery
│   │   ├── GalaxyCollections.tsx     # Restrained collections preview
│   │   ├── GalaxyJourneyLink.tsx     # Writing Journey & About bridge
│   │   ├── useGalaxyStories.ts       # Optimized data loading hook for published eligible stories
│   │   ├── routes.ts                 # Established route generation helpers
│   │   ├── motion.ts                 # Unified motion tokens & easing curves
│   │   └── types.ts                  # Shared TypeScript interfaces
│   ├── HomeContent.tsx               # Orchestrator for homepage Galaxy Journal 3.0
│   └── Navbar.tsx                    # Liquid Glass navigation with Explore Stories action
```

---

## 3. Technical Specifications

### A. Galaxy Background
- **Layer 1**: Deep AMOLED Cosmic Foundation (`#030306`) with radial gradient into secondary `#070811`.
- **Layer 2**: Cosmic deep blue (`#0B1022`) and muted violet (`#17112B`) nebulae with soft lavender highlights.
- **Layer 3**: Restrained Aqua Flow reflections (`#1B6870`, `#4FAEB5`) positioning light around the hero and gallery.
- **Layer 4**: Static, non-repeating CSS radial star field (zero CPU/GPU particle load).
- **Layer 5**: Cosmic depth vignette and monochromatic micro-noise grain.
- **Optimization**: Disables off-screen layers on small viewports and pauses animations on `document.hidden` (`visibilitychange`).

### B. Floating Liquid Glass Navigation
- **Material**: Translucent dark glass (`bg-[#070811]/65`, `backdrop-blur-2xl`), specular inner highlight (`inset 0 1px 1px rgba(255, 255, 255, 0.18)`), fine border (`border-white/15`).
- **Layout**:
  - Left: Bhavya Writes logo.
  - Center: Stories, Collections, Writing Journey, About.
  - Right: "Explore Stories" primary pill and admin controls when authenticated.
- **Mobile Menu**: Floating drawer with `z-[100]` and `z-[90]` backdrop, focus trap, and Escape key dismissal.

### C. Story Gallery & Title-Only Cards
- **Content Rule**: ONLY the story title appears as text on the card. Excerpts, dates, reading times, categories, authors, like counts, and read buttons are strictly omitted.
- **Imagery**: Uses existing `coverImage` with `object-fit: cover` and deterministic focal point positioning (`parseStoryTags`).
- **Fallbacks**: Graceful fallback with cosmic dust shimmer if image is missing or fails to load (`onError`).
- **Targeted Contrast**: Tailored dark gradient overlay deep at the bottom (92% opacity) and transparent at the top so imagery remains recognizable while titles remain legible.

### D. Motion & Scroll-Driven Transitions
- **Desktop**:
  - Horizontal track linked to vertical scroll progress using Framer Motion `useScroll` and `useSpring`.
  - Deterministic perspective presets (`rotate: -2.2deg`, `1.8deg`, `-1.5deg`, etc.).
  - Active card emphasis on hover/focus (`scale: 1.03`, `rotate: 0deg`, `z-30`).
  - Section header previous/next controls for mouse and keyboard users.
- **Mobile (< 768px)**:
  - Touch-native momentum scrolling with CSS scroll snapping (`snap-x snap-mandatory`).
  - Shows 1 dominant card (82vw) with partial peeks of adjacent cards.
  - 0 3D transforms to maximize frame rates and conserve battery.
- **Reduced Motion**:
  - All motion components detect `(prefers-reduced-motion: reduce)`.
  - Bypasses parallax, perspective rotation, and scroll-linked translations in favor of stable layouts.

---

## 4. Verification & Testing
The redesign is verified through automated Node test suites in `tests/`:
1. `tests/galaxy-journal-homepage.test.mjs`: Tests component integration, route generation, title-only rule, responsive breakpoint tracks, keyboard navigation, and reduced motion.
2. `tests/liquid-glass-theme.test.mjs`: Validates dark tokens, themeColor, and component material integration.
3. `tests/seo-sitemap-rss-editorial.test.mjs`: Validates canonical URLs, JSON-LD structured data, sitemap, and RSS feed.
4. `tests/cinematic-intro.test.mjs`: Validates intro scene progression and skip prevention.
5. `tests/engagement.test.mjs`: Validates JWT reader identity and feedback validation.
