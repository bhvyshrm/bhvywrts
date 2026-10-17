/**
 * Story Route Helper
 *
 * Guarantees that every story link generated on the homepage precisely
 * maps to the established Next.js App Router dynamic route `/stories/[slug]`.
 */
export function getStoryHref(slug: string): string {
  if (!slug) return "/stories"
  return `/stories/${encodeURIComponent(slug.trim())}`
}

export function getCollectionHref(collectionName: string): string {
  if (!collectionName) return "/collections"
  return `/collections/${encodeURIComponent(collectionName.trim().toLowerCase())}`
}
