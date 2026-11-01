"use client"

import Link from "next/link"
import { PenSquare } from "lucide-react"
import { useAuthStore } from "@/lib/store"

export function FloatingWriteButton() {
  const { isAdmin, checking } = useAuthStore()

  if (!isAdmin || checking) return null

  return (
    <Link
      href="/editor"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#091825] shadow-[0_8px_30px_rgba(9,24,37,0.35)] hover:shadow-[0_8px_30px_rgba(140,205,242,0.45)] transition-all hover:scale-105 active:scale-95 border border-white/25"
      aria-label="Write a new story"
      title="Write a new story"
    >
      <PenSquare className="w-4 h-4" />
    </Link>
  )
}