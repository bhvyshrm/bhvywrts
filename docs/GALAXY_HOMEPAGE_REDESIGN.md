# Bhavya Writes — Galaxy Journal 3.0 Redesign

## 1. Overview & Vision
Galaxy Journal 3.0 reimagines the Bhavya Writes homepage as an immersive, cinematic digital universe. Stories are suspended in space, surrounded by restrained nebulae, delicate aqua reflections, and floating Liquid Glass surfaces.

### Core Visual Principles
- **AMOLED-Black Foundation**: Deep cosmic palette (`#030306`, `#070811`, `#0B1022`, `#17112B`).
- **Restrained Aqua & Lavender Nebulae**: Retains the brand's signature Aqua Flow identity while adding cosmic depth.
- **Floating Liquid Glass Navigation**: Translucent pill navigation with subtle backdrop blur, specular inner highlights, and fine low-contrast borders.
- **Centered Brand Identity**: Clean, editorial typography featuring Instrument Serif and Source Serif 4.
- **Title-Only Story Cards**: Cinematic cards presenting strictly the story title and rich cover imagery without extraneous metadata.
- **Perspective-Based Gallery**: Horizontal spatial depth on desktop with smooth scroll-driven transitions.
- **Responsive Mobile Track**: Touch-friendly horizontal snap gallery with optimized performance and reduced motion awareness.

## 2. Architecture & Component Structure
```
src/
├── components/
│   ├── galaxy/
│   │   ├── GalaxyBackground.tsx      # Layered cosmic background & nebula gradients
│   │   ├── GalaxyHero.tsx            # Centered brand introduction & editorial statement
│   │   ├── GalaxyStoryCard.tsx       # Title-only cinematic story card
│   │   ├── GalaxyStoryGallery.tsx    # Perspective horizontal desktop & mobile track gallery
│   │   ├── GalaxyCollections.tsx     # Restrained collections preview
│   │   ├── GalaxyJourneyLink.tsx     # Writing Journey & About bridge
│   │   └── motion.ts                 # Unified motion tokens & easing curves
│   ├── HomeContent.tsx               # Orchestrator for homepage Galaxy Journal 3.0
│   └── Navbar.tsx                    # Liquid Glass navigation with Explore Stories action
```

## 3. Motion System & Accessibility
- **Entrance Sequence**: 1.2s to 1.8s choreographed reveal of galaxy, navbar, brand, and story gallery.
- **Scroll Interpolation**: Continuous transform and rotation tied to viewport scroll progress without scroll-jacking.
- **Reduced Motion**: Gracefully falls back to static layout with clean opacity transitions and zero 3D transforms.
