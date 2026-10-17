export interface GalaxyStoryItem {
  id: string
  slug: string
  title: string
  coverImage?: string | null
  tags?: string | null
  createdAt?: string
}

export interface GalaxyGalleryProps {
  stories: GalaxyStoryItem[]
  loading?: boolean
}
