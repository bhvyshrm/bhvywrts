"use client"

import { usePathname } from "next/navigation"

interface AmbientBackgroundProps {
  coverImage?: string | null
}

export function AmbientBackground({ coverImage }: AmbientBackgroundProps) {
  const pathname = usePathname()

  // On the home page, GalaxyBackground provides the dedicated coastal background
  if (pathname === "/") {
    return null
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#091825]"
      aria-hidden="true"
    >
      {/* LAYER 1: Coastal Wallpaper Backdrop for subpages */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt=""
            role="presentation"
            className="w-full h-full object-cover opacity-20 filter blur-md"
          />
        ) : (
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/bhvy-coastal-background-mobile.webp"
              type="image/webp"
            />
            <source
              srcSet="/images/bhvy-coastal-background.webp"
              type="image/webp"
            />
            <img
              src="/images/bhvy-coastal-background.webp"
              alt=""
              role="presentation"
              className="w-full h-full object-cover object-[center_50%] sm:object-[center_60%] opacity-85"
            />
          </picture>
        )}
      </div>

      {/* LAYER 2: Subtle Top and Bottom Vignette for reading focus & navbar legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9, 24, 37, 0.40) 0%, rgba(9, 24, 37, 0.15) 30%, rgba(9, 24, 37, 0.35) 70%, rgba(9, 24, 37, 0.85) 100%)",
        }}
      />
    </div>
  )
}
