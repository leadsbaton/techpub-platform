import type { ContentType, Post } from '@/lib/types/cms'

export type PostTypeKey = Post['type']

type ContentTypeConfig = {
  key: PostTypeKey
  singularLabel: string
  pluralLabel: string
  routeBase: string
  sidebarAccent: string
  sidebarTitle: string
  primaryActionLabel: string
}

const DEFAULT_TYPE_CONFIGS: Record<PostTypeKey, ContentTypeConfig> = {
  insight: {
    key: 'insight',
    singularLabel: 'Insight',
    pluralLabel: 'Insights',
    routeBase: '/insights',
    sidebarAccent: "People's",
    sidebarTitle: 'Favorite',
    primaryActionLabel: 'Read now',
  },
  whitepaper: {
    key: 'whitepaper',
    singularLabel: 'White Paper',
    pluralLabel: 'White Papers',
    routeBase: '/whitepapers',
    sidebarAccent: 'Must Read',
    sidebarTitle: 'Resources',
    primaryActionLabel: 'Download now',
  },
  webinar: {
    key: 'webinar',
    singularLabel: 'Webinar',
    pluralLabel: 'Webinars',
    routeBase: '/webinars',
    sidebarAccent: 'Upcoming',
    sidebarTitle: 'Webinars',
    primaryActionLabel: 'Register now',
  },
}

const FALLBACK_ROUTE_SEGMENT_MAP: Record<string, PostTypeKey> = {
  insights: 'insight',
  whitepapers: 'whitepaper',
  webinars: 'webinar',
}

export function normalizeRouteBase(routeBase?: string | null): string {
  if (!routeBase) {
    return '/'
  }

  const withLeadingSlash = routeBase.startsWith('/') ? routeBase : `/${routeBase}`
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : withLeadingSlash
}

export function getContentTypeConfigByType(
  type: PostTypeKey,
  contentTypes: ContentType[] = [],
): ContentTypeConfig {
  const defaults = DEFAULT_TYPE_CONFIGS[type]
  const match = contentTypes.find((item) => item.key === type)

  if (!match) {
    return defaults
  }

  return {
    ...defaults,
    routeBase: normalizeRouteBase(match.routeBase),
  }
}

export function getContentTypeConfigByRoute(
  routeSegment?: string | null,
  contentTypes: ContentType[] = [],
): ContentTypeConfig | null {
  if (!routeSegment) {
    return null
  }

  const normalizedRoute = normalizeRouteBase(routeSegment)
  const backendMatch = contentTypes.find(
    (item) => normalizeRouteBase(item.routeBase) === normalizedRoute,
  )

  if (backendMatch) {
    return getContentTypeConfigByType(backendMatch.key, contentTypes)
  }

  const fallbackKey = FALLBACK_ROUTE_SEGMENT_MAP[routeSegment.replace(/^\//, '')]
  return fallbackKey ? DEFAULT_TYPE_CONFIGS[fallbackKey] : null
}

export function getRouteBaseForType(
  type: PostTypeKey,
  contentTypes: ContentType[] = [],
): string {
  return getContentTypeConfigByType(type, contentTypes).routeBase
}

export function getPluralLabelForType(
  type: PostTypeKey,
  contentTypes: ContentType[] = [],
): string {
  return getContentTypeConfigByType(type, contentTypes).pluralLabel
}

export function getSingularLabelForType(
  type: PostTypeKey,
  contentTypes: ContentType[] = [],
): string {
  return getContentTypeConfigByType(type, contentTypes).singularLabel
}

export function getPostHref(
  post: Pick<Post, 'type' | 'slug'>,
  contentTypes: ContentType[] = [],
): string {
  return `${getRouteBaseForType(post.type, contentTypes)}/${post.slug}`
}

export function getCategoryFilterHref(routeBase: string, slug?: string | null): string {
  const normalizedBase = normalizeRouteBase(routeBase)

  if (!slug) {
    return normalizedBase
  }

  return `${normalizedBase}?category=${encodeURIComponent(slug)}`
}
