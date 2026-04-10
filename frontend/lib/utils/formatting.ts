import type { Author, Category, LinkReference, Media, Post } from '@/lib/types/cms'
import { getPostHref, getSingularLabelForType } from '@/lib/utils/contentTypes'

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.onrender.com' : 'http://localhost:5000')
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23e8ecef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='46' fill='%236b7280'%3ELeadsBaton TechPub%3C/text%3E%3C/svg%3E"

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]}, ${date.getDate()}`
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) {
    return 'Unscheduled'
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function formatShortDate(dateString?: string | null): string {
  if (!dateString) {
    return 'Unscheduled'
  }

  const date = new Date(dateString)
  const day = date.getDate()
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
  return `${day}${suffix} ${month}`
}

export function getMediaUrl(media?: Media | string | null): string | null {
  if (!media) return null
  if (typeof media === 'string') return media.startsWith('/') ? `${API_URL}${media}` : media
  if (media.url) return media.url.startsWith('/') ? `${API_URL}${media.url}` : media.url
  if (media.filename) return `${API_URL}/media/${media.filename}`
  return null
}

export function getImageUrl(image?: Media | string | null): string {
  return getMediaUrl(image) || FALLBACK_IMAGE
}

export function hasMediaSource(media?: Media | string | null): boolean {
  return Boolean(getMediaUrl(media))
}

export function getCategoryName(category?: Category | string | null): string {
  if (!category) return 'General'
  return typeof category === 'string' ? category : category.name
}

export function getCategoryAccent(category?: Category | string | null): string {
  const name = getCategoryName(category).toLowerCase()
  if (name.includes('tech')) return '#1238d6'
  if (name.includes('finance')) return '#ff2a1f'
  if (name.includes('marketing')) return '#12a639'
  return '#1f2937'
}

export function getAuthorNames(authors?: Array<Author | string> | null): string {
  if (!authors?.length) return 'Editorial team'
  return authors
    .map((author) => (typeof author === 'string' ? author : author.name))
    .join(', ')
}

export function getContentTypeLabel(type: Post['type']): string {
  return getSingularLabelForType(type)
}

export function resolveLinkHref(link?: LinkReference | null): string {
  if (!link) return '#'
  if (link.type === 'custom' && link.url) return link.url
  if (link.type === 'page' && link.page && typeof link.page !== 'string') return `/${link.page.slug}`
  if (link.type === 'post' && link.post && typeof link.post !== 'string') {
    return getPostHref(link.post)
  }
  if (link.type === 'category' && link.category && typeof link.category !== 'string') {
    return `/insights?category=${link.category.slug}`
  }
  return '#'
}
