import type { Author, Category, LinkReference, Media, Post } from '@/lib/types/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23e8ecef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='46' fill='%236b7280'%3ELeadsBaton TechPub%3C/text%3E%3C/svg%3E"

  export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]}, ${date.getDate()}`;
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

export function getImageUrl(image?: Media | string | null): string {
  if (!image) return FALLBACK_IMAGE
  if (typeof image === 'string') return image.startsWith('/') ? `${API_URL}${image}` : image
  if (image.url) return image.url.startsWith('/') ? `${API_URL}${image.url}` : image.url
  if (image.filename) return `${API_URL}/media/${image.filename}`
  return FALLBACK_IMAGE
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
