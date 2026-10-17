export interface GalaxyStoryItem {
  id: string
  slug: string
  title: string
  coverImage?: string | null
  tags?: string | null
  createdAt?: string
  isLocked?: boolean
  featured?: boolean
  category?: string | null
}

export interface GalaxyGalleryProps {
  stories: GalaxyStoryItem[]
  loading?: boolean
}
