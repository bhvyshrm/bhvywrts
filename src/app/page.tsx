import type { Metadata } from "next"
import { HomeContent } from "@/components/HomeContent"

export const metadata: Metadata = {
  title: "bhvy. — A Digital Journal",
  description:
    "A personal digital journal of stories, fragments, and quiet thoughts from a mind that never quite runs out of words.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app",
  },
  openGraph: {
    type: "website",
    url: "https://bhvywrts.vercel.app",
    title: "bhvy. — A Digital Journal",
    description:
      "A personal digital journal of stories, fragments, and quiet thoughts by Bhavya.",
    siteName: "bhvy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bhvy. — A Digital Journal",
    description:
      "A personal digital journal of stories, fragments, and quiet thoughts by Bhavya.",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "bhvy.",
  alternateName: "Bhavya Writes",
  url: "https://bhvywrts.vercel.app",
  description:
    "A personal digital journal of stories, fragments, and quiet thoughts.",
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
