import type { Metadata } from "next"
import { HomeContent } from "@/components/HomeContent"

export const metadata: Metadata = {
  title: "bhvy. — Digital Journal",
  description:
    "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app",
  },
  openGraph: {
    type: "website",
    url: "https://bhvywrts.vercel.app",
    title: "bhvy. — Digital Journal",
    description:
      "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
    siteName: "bhvy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bhvy. — Digital Journal",
    description:
      "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "bhvy.",
  alternateName: "bhvy",
  url: "https://bhvywrts.vercel.app",
  description:
    "Stories, thoughts, and fragments of life — collected in one quiet corner of the internet.",
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
