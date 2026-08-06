/**
 * The site's own canonical origin — the single source of truth for anything that
 * has to emit an absolute URL: metadataBase, canonical tags, Open Graph URLs,
 * sitemap entries, robots.txt and JSON-LD.
 *
 * Getting this wrong is an SEO problem, not a cosmetic one: Google indexes
 * whatever host the canonical tags point at, so a stale preview domain here means
 * the real domain never ranks for its own content.
 *
 * Set NEXT_PUBLIC_SITE_URL per environment; the fallback is the live domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://lbtechpub.com' : 'http://localhost:3000')
).replace(/\/+$/, '')

export const SITE_NAME = 'LeadsBaton TechPub'

export const SITE_DESCRIPTION =
  'Editorial platform for insights, white papers, webinars, and category-led discovery.'

export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}
