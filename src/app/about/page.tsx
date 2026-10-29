import type { Metadata } from "next"
import { AboutView } from "@/components/AboutView"

export const metadata: Metadata = {
  title: "About | bhvy.",
  description:
    "A personal letter and backstory from Bhavya on why bhvy. exists — stories, thoughts, and midnight reflections.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app/about",
  },
  openGraph: {
    type: "profile",
    url: "https://bhvywrts.vercel.app/about",
    title: "About Bhavya | bhvy.",
    description:
      "A personal letter and backstory from Bhavya on why bhvy. exists.",
    siteName: "bhvy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Bhavya | bhvy.",
    description:
      "A personal letter and backstory from Bhavya on why bhvy. exists.",
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bhavya",
  url: "https://bhvywrts.vercel.app/about",
  description:
    "Author, poet, and creator of bhvy. — a digital journal of night thoughts, reflections, and stories written under the moonlight.",
  sameAs: ["https://bhvywrts.vercel.app"],
  jobTitle: "Author & Writer",
  worksFor: {
    "@type": "Organization",
    name: "bhvy.",
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
