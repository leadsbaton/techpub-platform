import type { Author, Category, LinkReference, Media, Post } from '@/lib/types/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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

export function getImageUrl(image?: Media | string | null): string {
  if (!image) return 'https://picsum.photos/1280/720'
  if (typeof image === 'string') return image.startsWith('/') ? `${API_URL}${image}` : image
  if (image.url) return image.url.startsWith('/') ? `${API_URL}${image.url}` : image.url
  if (image.filename) return `${API_URL}/media/${image.filename}`
  return 'https://picsum.photos/1280/720'
}

export function getCategoryName(category?: Category | string | null): string {
  if (!category) return 'General'
  return typeof category === 'string' ? category : category.name
}

export function getAuthorNames(authors?: Array<Author | string> | null): string {
  if (!authors?.length) return 'Editorial team'
  return authors
    .map((author) => (typeof author === 'string' ? author : author.name))
    .join(', ')
}

export function getContentTypeLabel(type: Post['type']): string {
  switch (type) {
    case 'whitepaper':
      return 'Whitepaper'
    case 'webinar':
      return 'Webinar'
    case 'case-study':
      return 'Case Study'
    default:
      return 'Insight'
  }
}

export function resolveLinkHref(link?: LinkReference | null): string {
  if (!link) return '#'
  if (link.type === 'custom' && link.url) return link.url
  if (link.type === 'page' && link.page && typeof link.page !== 'string') return `/${link.page.slug}`
  if (link.type === 'post' && link.post && typeof link.post !== 'string') {
    const base = `${link.post.type}s`.replace('case-studys', 'case-studies')
    return `/${base}/${link.post.slug}`
  }
  if (link.type === 'category' && link.category && typeof link.category !== 'string') {
    return `/categories/${link.category.slug}`
  }
  return '#'
}
