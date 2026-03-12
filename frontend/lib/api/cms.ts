import type {
  Author,
  Category,
  ContentType,
  PageDoc,
  PayloadListResponse,
  Post,
  SiteSettings,
  Tag,
} from '@/lib/types/cms'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

type PostFilters = {
  type?: Post['type']
  category?: string
  tag?: string
  author?: string
  featured?: boolean
  page?: number
  limit?: number
  query?: string
}

function buildQuery(params: Record<string, unknown>) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (key === 'where' && typeof value === 'object') {
      query.append(key, JSON.stringify(value))
      continue
    }
    query.append(key, String(value))
  }

  return query.toString()
}

async function fetchPayload<T>(endpoint: string, revalidate = 60): Promise<T> {
  return fetchPayloadWithOptions<T>(endpoint, revalidate)
}

async function fetchPayloadWithOptions<T>(
  endpoint: string,
  revalidate = 60,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    ...(revalidate > 0
      ? { next: { revalidate } }
      : { cache: 'no-store' as const }),
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Payload request failed: ${response.status}`)
  }

  return response.json()
}

function emptyListResponse<T>(limit = 0, page = 1): PayloadListResponse<T> {
  return {
    docs: [],
    totalDocs: 0,
    limit,
    totalPages: 1,
    page,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  }
}

function publishedWhere() {
  return {
    status: { equals: 'published' },
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await fetchPayload<SiteSettings>('/api/globals/site-settings', 300)
  } catch {
    return null
  }
}

export async function getPosts(
  filters: PostFilters = {},
): Promise<PayloadListResponse<Post>> {
  const where: Record<string, unknown> = publishedWhere()

  if (filters.type) where.type = { equals: filters.type }
  if (filters.category) where['primaryCategory.slug'] = { equals: filters.category }
  if (filters.tag) where['tags.slug'] = { equals: filters.tag }
  if (filters.author) where['authors.slug'] = { equals: filters.author }
  if (filters.featured !== undefined) where.featured = { equals: filters.featured }

  if (filters.query) {
    where.or = [
      { title: { like: filters.query } },
      { excerpt: { like: filters.query } },
    ]
  }

  const query = buildQuery({
    depth: 3,
    sort: '-publishedAt',
    limit: filters.limit ?? 9,
    page: filters.page ?? 1,
    where,
  })

  try {
    return await fetchPayload<PayloadListResponse<Post>>(`/api/posts?${query}`)
  } catch {
    return emptyListResponse<Post>(filters.limit ?? 9, filters.page ?? 1)
  }
}

export async function getPostBySlug(
  slug: string,
  type?: Post['type'],
): Promise<Post | null> {
  const where: Record<string, unknown> = {
    ...publishedWhere(),
    slug: { equals: slug },
  }

  if (type) where.type = { equals: type }

  const query = buildQuery({ depth: 3, limit: 1, where })
  try {
    const data = await fetchPayload<PayloadListResponse<Post>>(`/api/posts?${query}`)
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getPreviewPostBySlug(
  slug: string,
  type: Post['type'],
  token?: string,
): Promise<Post | null> {
  const where: Record<string, unknown> = {
    slug: { equals: slug },
    type: { equals: type },
  }

  const query = buildQuery({ depth: 3, limit: 1, where })
  try {
    const data = await fetchPayloadWithOptions<PayloadListResponse<Post>>(
      `/api/posts?${query}`,
      0,
      token
        ? {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        : undefined,
    )
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getCategories(limit = 12): Promise<Category[]> {
  const query = buildQuery({ limit, depth: 1, sort: 'name' })
  try {
    const data = await fetchPayload<PayloadListResponse<Category>>(
      `/api/categories?${query}`,
      300,
    )
    return data.docs
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = buildQuery({ limit: 1, depth: 1, where: { slug: { equals: slug } } })
  try {
    const data = await fetchPayload<PayloadListResponse<Category>>(
      `/api/categories?${query}`,
      300,
    )
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getTags(limit = 30): Promise<Tag[]> {
  const query = buildQuery({ limit, depth: 1, sort: 'name' })
  try {
    const data = await fetchPayload<PayloadListResponse<Tag>>(`/api/tags?${query}`, 300)
    return data.docs
  } catch {
    return []
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const query = buildQuery({ limit: 1, depth: 1, where: { slug: { equals: slug } } })
  try {
    const data = await fetchPayload<PayloadListResponse<Tag>>(`/api/tags?${query}`, 300)
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getAuthors(limit = 24): Promise<Author[]> {
  const query = buildQuery({ limit, depth: 1, sort: 'name' })
  try {
    const data = await fetchPayload<PayloadListResponse<Author>>(
      `/api/authors?${query}`,
      300,
    )
    return data.docs
  } catch {
    return []
  }
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const query = buildQuery({ limit: 1, depth: 1, where: { slug: { equals: slug } } })
  try {
    const data = await fetchPayload<PayloadListResponse<Author>>(
      `/api/authors?${query}`,
      300,
    )
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getPageBySlug(slug: string): Promise<PageDoc | null> {
  const query = buildQuery({
    limit: 1,
    depth: 2,
    where: {
      status: { equals: 'published' },
      slug: { equals: slug },
    },
  })
  try {
    const data = await fetchPayload<PayloadListResponse<PageDoc>>(`/api/pages?${query}`, 300)
    return data.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getHomePageData() {
  const [settings, featuredPosts, insights, whitepapers, webinars, categories, contentTypes] =
    await Promise.all([
      getSiteSettings(),
      getPosts({ featured: true, limit: 1 }),
      getPosts({ type: 'insight', limit: 7 }),
      getPosts({ type: 'whitepaper', limit: 6 }),
      getPosts({ type: 'webinar', limit: 4 }),
      getCategories(6),
      getContentTypes(6),
    ])

  return {
    settings,
    heroPost: featuredPosts.docs[0] || insights.docs[0] || whitepapers.docs[0] || webinars.docs[0] || null,
    insights: insights.docs,
    whitepapers: whitepapers.docs,
    webinars: webinars.docs,
    categories,
    contentTypes,
  }
}

export async function getContentTypeById(id: string): Promise<ContentType | null> {
  try {
    return await fetchPayload<ContentType>("/api/content-types/" + id, 300)
  } catch {
    return null
  }
}

export async function getContentTypes(limit = 12): Promise<ContentType[]> {
  const query = buildQuery({
    limit,
    depth: 0,
    sort: 'sortOrder',
    where: { active: { equals: true } },
  })

  try {
    const data = await fetchPayload<PayloadListResponse<ContentType>>(
      `/api/content-types?${query}`,
      300,
    )
    return data.docs
  } catch {
    return []
  }
}
