import type { Metadata } from "next"
import { AboutView } from "@/components/AboutView"

export const metadata: Metadata = {
  title: "About | Bhavya Writes",
  description:
    "A personal letter and backstory from Bhavya on why Bhavya Writes exists — stories, thoughts, and midnight reflections.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app/about",
  },
  openGraph: {
    type: "profile",
    url: "https://bhvywrts.vercel.app/about",
    title: "About Bhavya | Bhavya Writes",
    description:
      "A personal letter and backstory from Bhavya on why Bhavya Writes exists.",
    siteName: "Bhavya Writes",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Bhavya | Bhavya Writes",
    description:
      "A personal letter and backstory from Bhavya on why Bhavya Writes exists.",
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bhavya",
  url: "https://bhvywrts.vercel.app/about",
  description:
    "Author, poet, and creator of Bhavya Writes — a digital journal of night thoughts, reflections, and stories written under the moonlight.",
  sameAs: ["https://bhvywrts.vercel.app"],
  jobTitle: "Author & Writer",
  worksFor: {
    "@type": "Organization",
    name: "Bhavya Writes",
    url: "https://bhvywrts.vercel.app",
  },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AboutView />
    </>
  )
}
