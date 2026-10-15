import type { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FloatingWriteButton } from "@/components/FloatingWriteButton"
import WritingJourney from "@/components/WritingJourney"

export const metadata: Metadata = {
  title: "Writing Journey | Bhavya Writes",
  description:
    "A living timeline and seasonal rhythm of stories, thoughts, and writings crafted by Bhavya under the moonlight.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app/writing-journey",
  },
  openGraph: {
    type: "website",
    url: "https://bhvywrts.vercel.app/writing-journey",
    title: "Writing Journey | Bhavya Writes",
    description:
      "A living timeline and seasonal rhythm of stories, thoughts, and writings crafted by Bhavya under the moonlight.",
    siteName: "Bhavya Writes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing Journey | Bhavya Writes",
    description:
      "A living timeline and seasonal rhythm of stories, thoughts, and writings crafted by Bhavya under the moonlight.",
  },
}

export default function WritingJourneyPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main id="main-content">
        <WritingJourney />
      </main>
      <Footer />
      <FloatingWriteButton />
    </div>
  )
}
