'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { SearchResultCard } from './SearchResultCard'
import type { Category, ContentType, PayloadListResponse, Post } from '@/lib/types/cms'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://techpub-platform.onrender.com'
    : 'http://localhost:5000')

const HISTORY_KEY = 'techpub-search-history'

type SearchFilters = {
  q: string
  type: string
  category: string
  from: string
  to: string
  sort: string
}

function buildPageHref(filters: SearchFilters) {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.type) params.set('type', filters.type)
  if (filters.category) params.set('category', filters.category)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.sort) params.set('sort', filters.sort)
  const query = params.toString()
  return query ? `/search?${query}` : '/search'
}

function buildFeedUrl(page: number, filters: SearchFilters) {
  const params = new URLSearchParams()
  params.set('depth', '3')
  params.set('limit', '9')
  params.set('page', String(page))
  params.set('sort', filters.sort || '-publishedAt')
  params.set('where[status][equals]', 'published')

  if (filters.type) params.set('where[type][equals]', filters.type)
  if (filters.category) params.set('where[primaryCategory.slug][equals]', filters.category)
  if (filters.from) params.set('where[publishedAt][greater_than_equal]', filters.from)
  if (filters.to) params.set('where[publishedAt][less_than_equal]', filters.to)
  if (filters.q) {
    params.set('where[or][0][title][like]', filters.q)
    params.set('where[or][1][excerpt][like]', filters.q)
  }

  return `${API_URL}/api/posts?${params.toString()}`
}

export function SearchPageClient({
  initialResults,
  initialFilters,
  categories,
  contentTypes,
}: {
  initialResults: PayloadListResponse<Post>
  initialFilters: SearchFilters
  categories: Category[]
  contentTypes: ContentType[]
}) {
  const router = useRouter()
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [results, setResults] = useState(initialResults.docs)
  const [page, setPage] = useState(initialResults.page)
  const [hasNextPage, setHasNextPage] = useState(initialResults.hasNextPage)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as string[]
      return Array.isArray(parsed) ? parsed.slice(0, 6) : []
    } catch {
      return []
    }
  })
  const [isPending, startTransition] = useTransition()

  function updateFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function saveHistory(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    const next = [trimmed, ...history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
    setHistory(next)
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    } catch {}
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveHistory(filters.q)
    router.push(buildPageHref(filters))
  }

  function applyHistory(query: string) {
    const nextFilters = { ...filters, q: query }
    setFilters(nextFilters)
    router.push(buildPageHref(nextFilters))
  }

  function clearHistory() {
    setHistory([])
    try {
      window.localStorage.removeItem(HISTORY_KEY)
    } catch {}
  }

  function loadMore() {
    startTransition(() => {
      void (async () => {
        setError(null)
        try {
          const response = await fetch(buildFeedUrl(page + 1, filters), { cache: 'no-store' })
          if (!response.ok) throw new Error('Unable to load more results right now.')
          const data = (await response.json()) as PayloadListResponse<Post>
          setResults((current) => [...current, ...data.docs])
          setPage(data.page)
          setHasNextPage(data.hasNextPage)
        } catch {
          setError('Unable to load more results right now.')
        }
      })()
    })
  }

  const activeCategoryOptions = useMemo(() => categories, [categories])
  const activeTypeOptions = useMemo(() => contentTypes, [contentTypes])

  return (
    <div className="space-y-8">
      <section className="ui-font rounded-[24px] border border-[var(--border-subtle)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <form onSubmit={handleSearchSubmit} className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.7fr))_minmax(0,0.8fr)]">
            <input
              type="search"
              value={filters.q}
              onChange={(event) => updateFilter('q', event.target.value)}
              placeholder="Search articles, guides, white papers, and webinars"
              className="h-12 rounded-[14px] border border-[var(--border-subtle)] px-4 outline-none"
            />

            <select
              value={filters.type}
              onChange={(event) => updateFilter('type', event.target.value)}
              className="h-12 rounded-[14px] border border-[var(--border-subtle)] px-4 outline-none"
            >
              <option value="">All types</option>
              {activeTypeOptions.map((type) => (
                <option key={type.id} value={type.key}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(event) => updateFilter('category', event.target.value)}
              className="h-12 rounded-[14px] border border-[var(--border-subtle)] px-4 outline-none"
            >
              <option value="">All categories</option>
              {activeCategoryOptions.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={(event) => updateFilter('sort', event.target.value)}
              className="h-12 rounded-[14px] border border-[var(--border-subtle)] px-4 outline-none"
            >
              <option value="-publishedAt">Newest first</option>
              <option value="publishedAt">Oldest first</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
            </select>

            <button type="submit" className="h-12 rounded-[14px] bg-[var(--accent-red)] px-5 text-sm font-semibold text-white">
              Search
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#555]">
              <span>From date</span>
              <input
                type="date"
                value={filters.from}
                onChange={(event) => updateFilter('from', event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-subtle)] px-4 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-[#555]">
              <span>To date</span>
              <input
                type="date"
                value={filters.to}
                onChange={(event) => updateFilter('to', event.target.value)}
                className="h-12 w-full rounded-[14px] border border-[var(--border-subtle)] px-4 outline-none"
              />
            </label>
          </div>
        </form>

        {history.length ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[#666]">Recent searches:</span>
            {history.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => applyHistory(item)}
                className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm text-[#222]"
              >
                {item}
              </button>
            ))}
            <button type="button" onClick={clearHistory} className="text-sm text-[#666] underline underline-offset-4">
              Clear
            </button>
          </div>
        ) : null}
      </section>

      {results.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-[var(--border-subtle)] bg-white p-10 text-center">
          <h2 className="ui-font text-[28px] font-medium text-[#111]">No results found</h2>
          <p className="mt-3 text-sm text-[#666]">
            Try a broader keyword, remove a filter, or search by category and type separately.
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        {error ? <p className="text-sm text-[var(--accent-red)]">{error}</p> : null}
        {hasNextPage ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="ui-font rounded-[10px] bg-[var(--accent-red)] px-8 py-3 text-[18px] font-medium text-white disabled:opacity-70"
          >
            {isPending ? 'Loading...' : 'Load More'}
          </button>
        ) : null}
      </div>

      <div className="ui-font rounded-[20px] border border-[var(--border-subtle)] bg-white p-5 text-sm text-[#666]">
        <p>Search covers published Insights, White Papers, and Webinars.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/insights" className="underline underline-offset-4">Browse Insights</Link>
          <Link href="/whitepapers" className="underline underline-offset-4">Browse White Papers</Link>
          <Link href="/webinars" className="underline underline-offset-4">Browse Webinars</Link>
        </div>
      </div>
    </div>
  )
}
