/**
 * Single source of truth for the Payload CMS base URL.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_API_URL (set per environment)
 *   2. Production fallback to the Hostinger VPS API
 *   3. Local dev fallback to localhost:5000
 *
 * Kept in one place so the rule does not drift between the server data layer
 * (cms.ts), media helpers (formatting.ts), and the client "load more" fetchers.
 *
 * NOTE: next.config.ts intentionally inlines the same rule because config files
 * run before the path alias (`@/`) is available and cannot import this module.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'http://187.127.213.19:5000'
    : 'http://localhost:5000')
