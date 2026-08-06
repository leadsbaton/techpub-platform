import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

// Served at /robots.txt. The sitemap reference is the part that matters: it is how
// a crawler finds every article without having to walk the listing pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Gated form pages and search result permutations are noise in an index —
      // they carry no unique content and dilute crawl budget across the site.
      disallow: ['/api/', '/preview/', '/search', '/whitepapers/*/access', '/webinars/*/access'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
