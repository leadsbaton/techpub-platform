import type { MetadataRoute } from 'next'

/**
 * Served at https://cms.lbtechpub.com/robots.txt.
 *
 * This host is the CMS: an admin panel plus the REST/GraphQL API. None of it
 * should ever appear in search. Without this file it was fully crawlable, which
 * costs twice over — /api/posts responses are indexable JSON copies of the same
 * articles the public site publishes, so Google sees two hosts serving one body
 * of content and has to guess which is canonical.
 *
 * The public site keeps its own robots.txt and sitemap in the frontend app.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
