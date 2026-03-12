import type { RichTextDocument } from '@/app/(public)/_components/RichTextRenderer'

export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface Media {
  id: string
  url?: string | null
  alt?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  image?: Media | string | null
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string | null
}

export interface Author {
  id: string
  name: string
  slug: string
  role?: string | null
  bio?: string | null
  avatar?: Media | string | null
}

export interface Seo {
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  metaImage?: Media | string | null
  noIndex?: boolean | null
}

export interface LinkReference {
  label: string
  type: 'custom' | 'page' | 'post' | 'category'
  url?: string | null
  page?: PageDoc | string | null
  post?: Post | string | null
  category?: Category | string | null
  newTab?: boolean | null
}

export interface SiteSettings {
  siteName: string
  siteTagline?: string | null
  siteDescription?: string | null
  logo?: Media | string | null
  contactEmail?: string | null
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  headerLinks?: Array<{
    item: LinkReference
  }>
  footerSections?: Array<{
    title: string
    links?: Array<{
      item: LinkReference
    }>
  }>
  newsletter?: {
    enabled?: boolean
    title?: string | null
    description?: string | null
    submitLabel?: string | null
  }
}

export interface Post {
  id: string
  title: string
  slug: string
  type: 'insight' | 'whitepaper' | 'webinar'
  status: 'draft' | 'published' | 'archived'
  excerpt: string
  content?: RichTextDocument | null
  featuredImage?: Media | string | null
  featured?: boolean
  pinned?: boolean
  authors?: Array<Author | string> | null
  primaryCategory?: Category | string | null
  categories?: Array<Category | string> | null
  tags?: Array<Tag | string> | null
  readingTime?: number | null
  publishedAt?: string | null
  videoUrl?: string | null
  externalUrl?: string | null
  seo?: Seo | null
}

export interface PageDoc {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  template: 'standard' | 'landing' | 'contact' | 'legal' | 'support'
  summary?: string | null
  content?: RichTextDocument | null
  featuredPosts?: Array<Post | string> | null
  hero?: {
    eyebrow?: string | null
    headline?: string | null
    description?: string | null
    image?: Media | string | null
    primaryAction?: LinkReference | null
    secondaryAction?: LinkReference | null
  } | null
  seo?: Seo | null
}
