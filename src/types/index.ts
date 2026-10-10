export interface Story {
  id: string
  title: string
  subtitle: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string
  coverImage: string
  published: boolean
  isLocked: boolean
  featured: boolean
  wordCount: number
  readingTime: number
  likeCount?: number
  createdAt: string
  updatedAt: string
}

export interface StoryLike {
  id: string
  storyId: string
  readerId: string
  createdAt: string
}

export type FeedbackStatus = "unread" | "read" | "archived"

export interface StoryFeedback {
  id: string
  storyId: string | null
  storyTitle: string | null
  storySlug: string | null
  name: string
  message: string
  status: FeedbackStatus
  createdAt: string
  readAt?: string | null
}

export interface FeedbackCounts {
  total: number
  unread: number
  read: number
  archived: number
}

export interface EditorMetrics {
  words: number
  characters: number
  paragraphs: number
  readingTime: number
}

export type WritingMode = "normal" | "focus" | "typewriter" | "zen" | "fullscreen"

