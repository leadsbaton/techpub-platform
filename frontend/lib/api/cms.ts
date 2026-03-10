import type {
  Author,
  Category,
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
  const response = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate },
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Payload request failed: ${response.status}`)
  }

  return response.json()
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
    depth: 2,
    sort: '-publishedAt',
    limit: filters.limit ?? 9,
    page: filters.page ?? 1,
    where,
  })

  return fetchPayload<PayloadListResponse<Post>>(`/api/posts?${query}`)
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

  const query = buildQuery({ depth: 2, limit: 1, where })
  const data = await fetchPayload<PayloadListResponse<Post>>(`/api/posts?${query}`)
  return data.docs[0] ?? null
}

export async function getCategories(limit = 12): Promise<Category[]> {
  const query = buildQuery({ limit, depth: 1, sort: 'name' })
  const data = await fetchPayload<PayloadListResponse<Category>>(
    `/api/categories?${query}`,
    300,
  )
  return data.docs
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = buildQuery({ limit: 1, depth: 1, where: { slug: { equals: slug } } })
  const data = await fetchPayload<PayloadListResponse<Category>>(
    `/api/categories?${query}`,
    300,
  )
  return data.docs[0] ?? null
}

export async function getTags(limit = 30): Promise<Tag[]> {
  const query = buildQuery({ limit, depth: 1, sort: 'name' })
  const data = await fetchPayload<PayloadListResponse<Tag>>(`/api/tags?${query}`, 300)
  return data.docs
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const query = buildQuery({ limit: 1, depth: 1, where: { slug: { equals: slug } } })
  const data = await fetchPayload<PayloadListResponse<Tag>>(`/api/tags?${query}`, 300)
  return data.docs[0] ?? null
}

export async function getAuthors(limit = 24): Promise<Author[]> {
  const query = buildQuery({ limit, depth: 1, sort: 'name' })
  const data = await fetchPayload<PayloadListResponse<Author>>(
    `/api/authors?${query}`,
    300,
  )
  return data.docs
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const query = buildQuery({ limit: 1, depth: 1, where: { slug: { equals: slug } } })
  const data = await fetchPayload<PayloadListResponse<Author>>(
    `/api/authors?${query}`,
    300,
  )
  return data.docs[0] ?? null
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
  const data = await fetchPayload<PayloadListResponse<PageDoc>>(`/api/pages?${query}`, 300)
  return data.docs[0] ?? null
}

export async function getHomePageData() {
  const [settings, featuredPosts, insights, whitepapers, webinars, categories] =
    await Promise.all([
      getSiteSettings(),
      getPosts({ featured: true, limit: 1 }),
      getPosts({ type: 'insight', limit: 7 }),
      getPosts({ type: 'whitepaper', limit: 6 }),
      getPosts({ type: 'webinar', limit: 4 }),
      getCategories(6),
    ])

  return {
    settings,
    heroPost: featuredPosts.docs[0] || insights.docs[0] || whitepapers.docs[0] || webinars.docs[0] || null,
    insights: insights.docs,
    whitepapers: whitepapers.docs,
    webinars: webinars.docs,
    categories,
  }
}
