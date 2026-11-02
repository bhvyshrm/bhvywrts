"use client"

import { usePathname } from "next/navigation"

interface AmbientBackgroundProps {
  coverImage?: string | null
}

export function AmbientBackground({ coverImage: _coverImage }: AmbientBackgroundProps) {
  const pathname = usePathname()

  // 1. On individual story pages, enforce pure AMOLED black (#000000) with ZERO wallpaper
  const isStoryPage = pathname.startsWith("/stories/") && pathname !== "/stories"
  // 2. On admin/dashboard/editor, keep distraction-free
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/editor")
  // 3. On home page, GalaxyBackground renders the dedicated stationary coastal layer
  if (pathname === "/" || isStoryPage || isAdmin) {
    return null
  }

  return (
    <div
      className="bhvy-coastal-fixed-bg fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Stationary Coastal Landscape Wallpaper (Scenic Subpages) */}
      <div className="absolute inset-0 bg-cover bg-no-repeat bg-[center_50%] max-md:bg-[center_40%] bg-[url('/images/bhvy-coastal-background.webp')] max-md:bg-[url('/images/bhvy-coastal-background-mobile.webp')]" />

      {/* Subtle top vignette for navbar contrast */}
      <div
        className="absolute top-0 inset-x-0 h-36 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9, 24, 37, 0.40) 0%, rgba(9, 24, 37, 0.12) 60%, transparent 100%)",
        }}
      />

      {/* Subtle bottom vignette for footer contrast */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(9, 24, 37, 0.60) 0%, rgba(9, 24, 37, 0.20) 60%, transparent 100%)",
        }}
      />
    </div>
  )
}
