"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  shine?: boolean
}

export function Logo({ href, size = "md", className, shine = false }: LogoProps) {
  const logoText = (
    <span
      className={cn(
        "group/logo inline-flex items-baseline select-none tracking-tight leading-none transition-all duration-300 font-medium",
        size === "sm" && "text-xl",
        size === "md" && "text-2xl",
        size === "lg" && "text-3xl sm:text-4xl",
        size === "xl" && "text-4xl sm:text-5xl",
        className
      )}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
      }}
    >
      <span
        className={cn(
          "transition-colors duration-300 text-white group-hover/logo:text-[#F8FBFF]",
          shine && "gradient-shine"
        )}
      >
        bhvy
      </span>
      <span className="text-[#8CCDF2] transition-transform duration-300 inline-block group-hover/logo:scale-125 group-hover/logo:drop-shadow-[0_0_10px_rgba(140,205,242,0.85)] ml-0.5 font-bold">
        .
      </span>
    </span>
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-label="bhvy. — home"
        className="inline-block focus-visible:outline-2 focus-visible:outline-[#8CCDF2] focus-visible:outline-offset-2 rounded-sm"
      >
        {logoText}
      </Link>
    )
  }

  return logoText
}
