import type { MetadataRoute } from 'next'

import { getContentTypes, getPosts } from '@/lib/api/cms'
import { SITE_URL } from '@/lib/site'
import { getPostHref } from '@/lib/utils/contentTypes'

// Served at /sitemap.xml. Without it Google has to discover every article by
// crawling links, which is slow and misses anything not linked from a listing
// page — the reason article titles were not turning up in search at all.
export const revalidate = 3600

const STATIC_PATHS = ['/', '/insights', '/whitepapers', '/webinars', '/categories', '/tags', '/authors', '/contact-us']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))

  // getPosts already filters to published docs and swallows CMS errors by
  // returning an empty list, so a CMS blip degrades the sitemap to the static
  // routes rather than failing the build.
  const [posts, contentTypes] = await Promise.all([
    getPosts({ limit: 1000, sort: '-publishedAt' }, revalidate),
    getContentTypes(50),
  ])

  const postEntries: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${SITE_URL}${getPostHref(post, contentTypes)}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticEntries, ...postEntries]
}
