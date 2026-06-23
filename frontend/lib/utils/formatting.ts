import type { Author, Category, LinkReference, Media, Post } from '@/lib/types/cms'
import { getPostHref, getSingularLabelForType } from '@/lib/utils/contentTypes'
import { API_URL } from '@/lib/api/config'

export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23f4f4f4'/%3E%3Cg fill='none' stroke='%23999999' stroke-width='18' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='390' y='180' width='420' height='315' rx='24'/%3E%3Ccircle cx='510' cy='290' r='34'/%3E%3Cpath d='M430 445l115-120 85 82 65-70 75 108'/%3E%3C/g%3E%3Ctext x='50%25' y='565' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='34' fill='%23777777'%3EImage unavailable%3C/text%3E%3C/svg%3E"

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

export function getPostCardImageUrl(post: Pick<Post, 'cardBannerImage' | 'featuredImage'>): string {
  return getImageUrl(post.cardBannerImage || post.featuredImage)
}

export function getPostCardImageFit(post: Pick<Post, 'cardBannerFit'>): 'cover' | 'contain' {
  return post.cardBannerFit === 'contain' ? 'contain' : 'cover'
}

export function getPostCardImageClass(post: Pick<Post, 'cardBannerFit'>): string {
  return getPostCardImageFit(post) === 'contain' ? 'object-contain' : 'object-cover'
}

export function getPostCardButtonLabel(post: Pick<Post, 'cardButtonLabel' | 'type'>): string {
  const customLabel = post.cardButtonLabel?.trim()
  if (customLabel) return customLabel
  if (post.type === 'webinar') return 'Join'
  if (post.type === 'whitepaper') return 'Download'
  return 'Read'
}

export function hasMediaSource(media?: Media | string | null): boolean {
  return Boolean(getMediaUrl(media))
}

export function getMediaDimensions(
  media?: Media | string | null,
): { width: number; height: number } | null {
  if (media && typeof media === 'object' && media.width && media.height && media.width > 0 && media.height > 0) {
    return { width: media.width, height: media.height }
  }

  return null
}

export function getMediaAspectRatio(media?: Media | string | null, fallback = 16 / 9): number {
  if (media && typeof media === 'object' && media.width && media.height && media.width > 0 && media.height > 0) {
    return media.width / media.height
  }

  return fallback
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

export type WebinarPerson = {
  id: string
  name: string
  role?: string | null
  secondaryLine?: string | null
  photo?: Media | string | null
}

export type WebinarPersonRole = 'speaker' | 'moderator' | 'presenter'

export type WebinarPersonGroup = {
  role: WebinarPersonRole
  label: string
  people: WebinarPerson[]
}

function authorToWebinarPerson(author: Author): WebinarPerson {
  return {
    id: author.id,
    name: author.name,
    role: author.role,
    secondaryLine: author.bio,
    photo: author.avatar,
  }
}

function getWebinarAuthors(post: Post): WebinarPerson[] {
  return post.authors?.filter((author): author is Author => typeof author !== 'string').map(authorToWebinarPerson) ?? []
}

export function getWebinarPersonGroups(post: Post): WebinarPersonGroup[] {
  const grouped: Record<WebinarPersonRole, WebinarPerson[]> = {
    speaker: [],
    moderator: [],
    presenter: [],
  }

  post.webinarPeople?.forEach((item) => {
    if (!item?.person || typeof item.person === 'string') return
    const role = item.role === 'moderator' || item.role === 'presenter' ? item.role : 'speaker'
    grouped[role].push(authorToWebinarPerson(item.person))
  })

  if (!grouped.speaker.length && !grouped.moderator.length && !grouped.presenter.length) {
    const legacyAuthors = getWebinarAuthors(post)
    if (legacyAuthors.length > 1) {
      grouped.speaker = legacyAuthors.slice(0, -1)
      grouped.moderator = legacyAuthors.slice(-1)
    } else {
      grouped.speaker = legacyAuthors
    }
  }

  const groups: WebinarPersonGroup[] = [
    { role: 'speaker', label: 'Speakers', people: grouped.speaker },
    { role: 'moderator', label: 'Moderator', people: grouped.moderator },
    { role: 'presenter', label: 'Presenters', people: grouped.presenter },
  ]

  return groups.filter((group) => group.people.length > 0)
}

export function getWebinarSpeakers(post: Post): WebinarPerson[] {
  return getWebinarPersonGroups(post).find((group) => group.role === 'speaker')?.people ?? []
}

export function getWebinarModerator(post: Post): WebinarPerson | null {
  return getWebinarPersonGroups(post).find((group) => group.role === 'moderator')?.people[0] ?? null
}

export function getWebinarSpeakerSummary(post: Post): string | null {
  const people = getWebinarPersonGroups(post).flatMap((group) => group.people)
  if (!people.length) return null
  if (people.length === 1) return people[0]?.name || null
  return `${people[0]?.name || 'Speaker'} + ${people.length - 1} more`
}

type WebinarDateSource = Pick<Post, 'webinarRegistration' | 'content'>

export function getWebinarEventLabel(post: WebinarDateSource): string {
  return post.webinarRegistration?.eventDateLabel?.trim() || extractWebinarEventLabelFromContent(post.content) || 'Date TBD'
}

const webinarMonthIndexes: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

function getTextFromRichTextNode(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const value = node as { text?: unknown; children?: unknown }
  const ownText = typeof value.text === 'string' ? value.text : ''
  const childText = Array.isArray(value.children)
    ? value.children.map(getTextFromRichTextNode).join(' ')
    : ''

  return `${ownText} ${childText}`.trim()
}

function getTextFromRichText(content: Post['content']): string {
  return content?.root?.children?.map(getTextFromRichTextNode).join(' ').replace(/\s+/g, ' ').trim() || ''
}

function extractWebinarEventLabelFromContent(content: Post['content']): string | null {
  const text = getTextFromRichText(content)
  if (!text) return null

  const datePattern =
    /\b(?:(?:mon|tues|wednes|thurs|fri|satur|sun)day,\s*)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?(?:,\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[A-Z]{2}(?:\s*\/\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)(?:\s*[A-Z]{2})?)?)?/gi
  const labels = Array.from(text.matchAll(datePattern), (match) => match[0].trim())
  if (!labels.length) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = labels.find((label) => {
    const eventDate = parseWebinarDateLabel(label)
    if (!eventDate) return false
    eventDate.setHours(0, 0, 0, 0)
    return eventDate >= today
  })

  return upcoming || labels[labels.length - 1] || null
}

function parseWebinarDateLabel(label?: string | null, referenceDate = new Date()): Date | null {
  if (!label) return null

  const match = label.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/i,
  )
  if (!match) return null

  const month = webinarMonthIndexes[match[1].toLowerCase()]
  const day = Number(match[2])
  const year = match[3] ? Number(match[3]) : referenceDate.getFullYear()
  if (month === undefined || !day || Number.isNaN(year)) return null

  const eventDate = new Date(year, month, day)
  return Number.isNaN(eventDate.getTime()) ? null : eventDate
}

export function getWebinarEventDate(post: WebinarDateSource, referenceDate = new Date()): Date | null {
  const structuredDate = post.webinarRegistration?.eventStartsAt
    ? new Date(post.webinarRegistration.eventStartsAt)
    : null

  if (structuredDate && !Number.isNaN(structuredDate.getTime())) {
    return structuredDate
  }

  return parseWebinarDateLabel(
    post.webinarRegistration?.eventDateLabel?.trim() || extractWebinarEventLabelFromContent(post.content),
    referenceDate,
  )
}

export function isUpcomingWebinar(post: WebinarDateSource, referenceDate = new Date()): boolean {
  const eventDate = getWebinarEventDate(post, referenceDate)
  if (!eventDate) return false

  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  return eventDate >= today
}

export function compareWebinarsByEventDate(a: WebinarDateSource, b: WebinarDateSource): number {
  const aDate = getWebinarEventDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER
  const bDate = getWebinarEventDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER
  return aDate - bDate
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
