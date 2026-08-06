import type { Post } from '@/lib/types/cms'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site'
import { getMediaUrl } from '@/lib/utils/formatting'

const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/leads-baton-logo.png'),
  },
}

/**
 * Site-level identity, emitted once on the home page. The SearchAction is what
 * lets Google offer a sitelinks search box for the brand.
 */
export function buildWebsiteJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      publisher: PUBLISHER,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: absoluteUrl('/search?q={search_term_string}'),
        },
        'query-input': 'required name=search_term_string',
      },
    },
    { '@context': 'https://schema.org', ...PUBLISHER },
  ]
}

/**
 * Per-article identity. `mainEntityOfPage` ties the markup to this exact URL, so
 * Google credits the article to our domain rather than treating it as a copy of
 * whichever vendor originally published the asset.
 */
export function buildArticleJsonLd(post: Post, pathname: string): Record<string, unknown> {
  const url = absoluteUrl(pathname)
  const image = getMediaUrl(post.seo?.metaImage || post.featuredImage) || undefined
  const authors = post.authors?.filter((author) => typeof author !== 'string') ?? []

  return {
    '@context': 'https://schema.org',
    '@type': post.type === 'whitepaper' ? 'Report' : 'Article',
    headline: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image ? { image: [image] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(authors.length
      ? { author: authors.map((author) => ({ '@type': 'Person', name: author.name })) }
      : { author: PUBLISHER }),
    publisher: PUBLISHER,
    isAccessibleForFree: post.type !== 'whitepaper',
  }
}
