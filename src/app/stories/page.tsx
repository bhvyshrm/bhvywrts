import type { Metadata } from "next"
import { StoriesArchiveView } from "@/components/StoriesArchiveView"

export const metadata: Metadata = {
  title: "Stories | bhvy.",
  description:
    "Browse the complete digital journal archive of stories, reflections, and personal essays by Bhavya.",
  alternates: {
    canonical: "https://bhvywrts.vercel.app/stories",
  },
  openGraph: {
    type: "website",
    url: "https://bhvywrts.vercel.app/stories",
    title: "Stories | bhvy.",
    description:
      "Browse the complete digital journal archive of stories, reflections, and personal essays by Bhavya.",
    siteName: "bhvy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories | bhvy.",
    description:
      "Browse the complete digital journal archive of stories, reflections, and personal essays by Bhavya.",
  },
}

export default function StoriesPage() {
  return <StoriesArchiveView />
}
