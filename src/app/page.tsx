import type { Metadata } from "next"
import { HomeContent } from "@/components/HomeContent"

export const metadata: Metadata = {
  title: "Bhavya Writes — A Digital Journal",
  description:
    "A personal digital journal of stories, thoughts, and things left unsaid by Bhavya. Written under the moonlight.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app",
  },
  openGraph: {
    type: "website",
    url: "https://bhvywrts.vercel.app",
    title: "Bhavya Writes — A Digital Journal",
    description:
      "A personal digital journal of stories, thoughts, and things left unsaid by Bhavya.",
    siteName: "Bhavya Writes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavya Writes — A Digital Journal",
    description:
      "A personal digital journal of stories, thoughts, and things left unsaid by Bhavya.",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bhavya Writes",
  url: "https://bhvywrts.vercel.app",
  description:
    "A personal digital journal of stories, thoughts, and things left unsaid.",
  author: {
    "@type": "Person",
    name: "Bhavya",
  },
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeContent />
    </>
  )
}
