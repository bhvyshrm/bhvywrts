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
        "group/logo inline-flex items-baseline select-none tracking-tight leading-none transition-all duration-300 font-normal",
        size === "sm" && "text-xl",
        size === "md" && "text-2xl",
        size === "lg" && "text-3xl sm:text-4xl",
        size === "xl" && "text-4xl sm:text-5xl",
        className
      )}
      style={{ fontFamily: "var(--font-instrument-serif)" }}
    >
      <span className={cn(
        "transition-colors duration-300 text-[#F5F1EA] group-hover/logo:text-white",
        shine && "gradient-shine"
      )}>
        bhvy
      </span>
      <span className="text-[var(--orchid)] transition-transform duration-300 inline-block group-hover/logo:scale-125 group-hover/logo:drop-shadow-[0_0_8px_rgba(182,107,255,0.7)] ml-0.5">
        .
      </span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} aria-label="bhvy. — home" className="inline-block focus-visible:outline-2 focus-visible:outline-[var(--orchid)] focus-visible:outline-offset-2 rounded-sm">
        {logoText}
      </Link>
    )
  }

  return logoText
}
