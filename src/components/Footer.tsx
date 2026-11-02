"use client"

import Link from "next/link"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="relative border-t border-white/15 mt-16 md:mt-24 bg-[#091825]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Logo href="/" size="sm" className="inline-block" />
            <p className="text-xs text-[#DCE5EC] mt-2 font-normal">
              A personal digital journal &amp; essays.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-[var(--font-grotesk)]" aria-label="Footer">
            <FooterLink href="/stories">Stories</FooterLink>
            <FooterLink href="/collections">Collections</FooterLink>
            <FooterLink href="/writing-journey">Writing Journey</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/rss.xml">RSS</FooterLink>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-8 pt-6 border-t border-white/10 font-[var(--font-grotesk)]">
          <p className="text-[11px] text-[#667B8C]">
            &copy; {new Date().getFullYear()} bhvy. All stories written by Bhavya.
          </p>
          <p className="text-[11px] text-[#667B8C]">
            bhvy. &middot; Coastal Glass Edition
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs text-[#DCE5EC] hover:text-white transition-colors py-1.5 px-2 focus-visible:outline-2 focus-visible:outline-[#8CCDF2] rounded-md min-h-[36px] inline-flex items-center active:opacity-70"
    >
      {children}
    </Link>
  )
}
