import type { Metadata } from "next"
import { CollectionsView } from "@/components/CollectionsView"

export const metadata: Metadata = {
  title: "Collections | bhvy.",
  description:
    "Curated thematic collections of stories, thoughts, and reflections exploring night thoughts, midnight memories, and digital journal entries by Bhavya.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app/collections",
  },
  openGraph: {
    type: "website",
    url: "https://bhvywrts.vercel.app/collections",
    title: "Collections | bhvy.",
    description:
      "Curated thematic collections of stories, thoughts, and reflections exploring night thoughts, midnight memories, and digital journal entries by Bhavya.",
    siteName: "bhvy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections | bhvy.",
    description:
      "Curated thematic collections of stories, thoughts, and reflections exploring night thoughts, midnight memories, and digital journal entries by Bhavya.",
  },
}

const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Collections | bhvy.",
  description:
    "Curated thematic collections of stories, thoughts, and reflections exploring night thoughts, midnight memories, and digital journal entries by Bhavya.",
  url: "https://bhvywrts.vercel.app/collections",
  publisher: {
    "@type": "Organization",
    name: "bhvy.",
    url: "https://bhvywrts.vercel.app",
  },
}

export default function CollectionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <CollectionsView />
    </>
  )
}
