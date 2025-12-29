// Type definitions for Insights and related data

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Media {
  id: string
  url: string
  alt?: string
  filename?: string
  width?: number
  height?: number
}

export interface Insight {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: any // Rich text content from Payload
  featuredImage: Media | string
  category: Category | string
  publishedAt: string
  isTrending?: boolean
  isTopPick?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  pagingCounter?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

