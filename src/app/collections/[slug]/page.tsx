import type { Metadata } from "next"
import { COLLECTIONS, COLLECTION_DESCRIPTIONS } from "@/lib/constants"
import { CollectionDetailView } from "@/components/CollectionDetailView"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const needle = decodeURIComponent(slug).toLowerCase()
  const collection = COLLECTIONS.find((c) => c.toLowerCase() === needle)

  if (!collection) {
    return {
      title: "Collection Not Found | Bhavya Writes",
      description: "The requested collection could not be found.",
    }
  }

  const description =
    COLLECTION_DESCRIPTIONS[collection] ||
    `Explore stories in the ${collection} collection on Bhavya Writes.`

  const canonicalUrl = `https://bhvywrts.vercel.app/collections/${encodeURIComponent(slug.toLowerCase())}`

  return {
    title: `${collection} | Bhavya Writes`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${collection} | Bhavya Writes`,
      description,
      siteName: "Bhavya Writes",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection} | Bhavya Writes`,
      description,
    },
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const needle = decodeURIComponent(slug).toLowerCase()
  const collection = COLLECTIONS.find((c) => c.toLowerCase() === needle)

  const jsonLd = collection
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${collection} — Collection | Bhavya Writes`,
        description: COLLECTION_DESCRIPTIONS[collection],
        url: `https://bhvywrts.vercel.app/collections/${encodeURIComponent(slug.toLowerCase())}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Bhavya Writes",
          url: "https://bhvywrts.vercel.app",
        },
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CollectionDetailView slug={slug} />
    </>
  )
}
