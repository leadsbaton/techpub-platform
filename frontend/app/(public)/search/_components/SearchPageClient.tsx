'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { SearchResultCard } from './SearchResultCard'
import type { Category, ContentType, PayloadListResponse, Post } from '@/lib/types/cms'
import { API_URL } from '@/lib/api/config'

const HISTORY_KEY = 'techpub-search-history'

type ViewMode = 'grid' | 'list'

type SearchFilters = {
  q: string
  type: string
  category: string
  from: string
  to: string
  sort: string
}

const SORT_OPTIONS = [
  { value: '-publishedAt', label: 'Newest first' },
  { value: 'publishedAt', label: 'Oldest first' },
  { value: 'title', label: 'Title A→Z' },
  { value: '-title', label: 'Title Z→A' },
]

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

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="7" height="7" rx="1.5" />
      <rect x="9" y="0" width="7" height="7" rx="1.5" />
      <rect x="0" y="9" width="7" height="7" rx="1.5" />
      <rect x="9" y="9" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="0" y="1" width="16" height="3" rx="1.5" />
      <rect x="0" y="6.5" width="16" height="3" rx="1.5" />
      <rect x="0" y="12" width="16" height="3" rx="1.5" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function XSmall() {
  return (
    <svg width="7" height="7" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M1 1 9 9M9 1 1 9" />
    </svg>
  )
}

function CardSkeleton({ view }: { view: ViewMode }) {
  if (view === 'list') {
    return (
      <div className="flex animate-pulse overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-white">
        <div className="h-[110px] w-[180px] shrink-0 bg-gray-200" />
        <div className="flex-1 space-y-3 p-5">
          <div className="h-3 w-1/5 rounded-full bg-gray-200" />
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-1/3 rounded bg-gray-200" />
        </div>
      </div>
    )
  }
  return (
    <div className="animate-pulse overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-white">
      <div className="h-[210px] bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-3 py-1.5 text-[12px] font-medium text-[#333]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#c8c8c8] text-white transition-colors hover:bg-[var(--accent-red)]"
      >
        <XSmall />
      </button>
    </span>
  )
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
  // draft = what the user is editing in the sidebar (not yet applied)
  const [draft, setDraft] = useState<SearchFilters>(initialFilters)
  const [results, setResults] = useState(initialResults.docs)
  const [page, setPage] = useState(initialResults.page)
  const [hasNextPage, setHasNextPage] = useState(initialResults.hasNextPage)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
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

  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function saveHistory(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    const next = [trimmed, ...history.filter((h) => h.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
    setHistory(next)
    try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch {}
  }

  function applyFilters() {
    saveHistory(draft.q)
    router.push(buildPageHref(draft))
    setMobileOpen(false)
  }

  function removeFilter(overrides: Partial<SearchFilters>) {
    const next = { ...initialFilters, ...overrides }
    setDraft(next)
    router.push(buildPageHref(next))
  }

  function clearAll() {
    const cleared: SearchFilters = { q: '', type: '', category: '', from: '', to: '', sort: '-publishedAt' }
    setDraft(cleared)
    router.push('/search')
  }

  function applyHistory(query: string) {
    const next = { ...draft, q: query }
    setDraft(next)
    saveHistory(query)
    router.push(buildPageHref(next))
  }

  function loadMore() {
    startTransition(() => {
      void (async () => {
        setError(null)
        try {
          const res = await fetch(buildFeedUrl(page + 1, initialFilters), { cache: 'no-store' })
          if (!res.ok) throw new Error()
          const data = (await res.json()) as PayloadListResponse<Post>
          setResults((prev) => [...prev, ...data.docs])
          setPage(data.page)
          setHasNextPage(data.hasNextPage)
        } catch {
          setError('Unable to load more results. Please try again.')
        }
      })()
    })
  }

  const activeCount = [initialFilters.q, initialFilters.type, initialFilters.category, initialFilters.from || initialFilters.to].filter(Boolean).length

  const filtersPanel = (
    <div className="space-y-6 text-[#222]">
      {/* Search input */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#999]">Search</p>
        <div className="relative">
          <input
            type="search"
            value={draft.q}
            onChange={(e) => update('q', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Keywords..."
            className="h-11 w-full rounded-[10px] border border-[var(--border-subtle)] pl-9 pr-4 text-[13px] outline-none focus:border-[#bbb]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]">
            <SearchIcon />
          </span>
        </div>
      </div>

      {/* Content type */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#999]">Content Type</p>
        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
            <input type="radio" name="filter-type" value="" checked={draft.type === ''} onChange={() => update('type', '')} className="accent-[var(--accent-red)]" />
            All types
          </label>
          {contentTypes.map((ct) => (
            <label key={ct.id} className="flex cursor-pointer items-center gap-2.5 text-[13px]">
              <input type="radio" name="filter-type" value={ct.key} checked={draft.type === ct.key} onChange={() => update('type', ct.key)} className="accent-[var(--accent-red)]" />
              {ct.label}
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#999]">Category</p>
        <div className="max-h-[200px] space-y-2.5 overflow-y-auto pr-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
            <input type="radio" name="filter-category" value="" checked={draft.category === ''} onChange={() => update('category', '')} className="accent-[var(--accent-red)]" />
            All categories
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2.5 text-[13px]">
              <input type="radio" name="filter-category" value={cat.slug} checked={draft.category === cat.slug} onChange={() => update('category', cat.slug)} className="accent-[var(--accent-red)]" />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#999]">Date Range</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] text-[#aaa]">From</label>
            <input type="date" value={draft.from} onChange={(e) => update('from', e.target.value)}
              className="h-10 w-full rounded-[8px] border border-[var(--border-subtle)] px-2 text-[12px] outline-none focus:border-[#bbb]" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-[#aaa]">To</label>
            <input type="date" value={draft.to} onChange={(e) => update('to', e.target.value)}
              className="h-10 w-full rounded-[8px] border border-[var(--border-subtle)] px-2 text-[12px] outline-none focus:border-[#bbb]" />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#999]">Sort By</p>
        <div className="space-y-2.5">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-[13px]">
              <input type="radio" name="filter-sort" value={opt.value} checked={draft.sort === opt.value} onChange={() => update('sort', opt.value)} className="accent-[var(--accent-red)]" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
        <button type="button" onClick={applyFilters}
          className="w-full rounded-[10px] bg-[var(--accent-red)] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">
          Apply Filters
        </button>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll}
            className="w-full rounded-[10px] border border-[var(--border-subtle)] py-2.5 text-[13px] text-[#666] transition-colors hover:bg-gray-50">
            Clear All
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

      {/* Mobile top bar */}
      <div className="flex items-center justify-between lg:hidden">
        <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 rounded-[10px] border border-[var(--border-subtle)] bg-white px-4 py-2.5 text-[13px] font-medium text-[#333] shadow-sm">
          <FilterIcon />
          Filters {activeCount > 0 ? `(${activeCount})` : ''}
        </button>
        <div className="flex gap-1.5">
          {(['grid', 'list'] as const).map((mode) => (
            <button key={mode} type="button" onClick={() => setViewMode(mode)}
              title={mode === 'grid' ? 'Grid view' : 'List view'}
              className={`rounded-[8px] p-2.5 transition-colors ${viewMode === mode ? 'bg-[var(--accent-red)] text-white' : 'border border-[var(--border-subtle)] bg-white text-[#666]'}`}>
              {mode === 'grid' ? <GridIcon /> : <ListIcon />}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile filter panel */}
      {mobileOpen && (
        <div className="rounded-[16px] border border-[var(--border-subtle)] bg-white p-5 shadow-lg lg:hidden">
          {filtersPanel}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-[255px] shrink-0 lg:block xl:w-[275px]">
        <div className="sticky top-6 rounded-[20px] border border-[var(--border-subtle)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="ui-font text-[16px] font-semibold text-[#111]">Filters</h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-[var(--accent-red)] px-2 py-0.5 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          {filtersPanel}
        </div>
      </aside>

      {/* Main results area */}
      <div className="min-w-0 flex-1 space-y-5">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="ui-font text-[14px] text-[#666]">
            <span className="font-semibold text-[#111]">{initialResults.totalDocs}</span>
            {' '}result{initialResults.totalDocs !== 1 ? 's' : ''}
            {initialFilters.q && (
              <> for <em className="not-italic text-[#333]">&ldquo;{initialFilters.q}&rdquo;</em></>
            )}
          </p>
          <div className="hidden items-center gap-1.5 lg:flex">
            {(['grid', 'list'] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => setViewMode(mode)}
                title={mode === 'grid' ? 'Grid view' : 'List view'}
                className={`rounded-[8px] p-2 transition-colors ${viewMode === mode ? 'bg-[var(--accent-red)] text-white' : 'border border-[var(--border-subtle)] bg-white text-[#666] hover:bg-gray-50'}`}>
                {mode === 'grid' ? <GridIcon /> : <ListIcon />}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {initialFilters.q && (
              <FilterChip label={`"${initialFilters.q}"`} onRemove={() => removeFilter({ q: '' })} />
            )}
            {initialFilters.type && (
              <FilterChip
                label={contentTypes.find((t) => t.key === initialFilters.type)?.label ?? initialFilters.type}
                onRemove={() => removeFilter({ type: '' })}
              />
            )}
            {initialFilters.category && (
              <FilterChip
                label={categories.find((c) => c.slug === initialFilters.category)?.name ?? initialFilters.category}
                onRemove={() => removeFilter({ category: '' })}
              />
            )}
            {(initialFilters.from || initialFilters.to) && (
              <FilterChip
                label={`${initialFilters.from || '…'} – ${initialFilters.to || '…'}`}
                onRemove={() => removeFilter({ from: '', to: '' })}
              />
            )}
            <button type="button" onClick={clearAll} className="text-[12px] text-[#bbb] underline underline-offset-4 hover:text-[#666]">
              Clear all
            </button>
          </div>
        )}

        {/* Recent search history */}
        {history.length > 0 && !initialFilters.q && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-[#bbb]">Recent:</span>
            {history.map((item) => (
              <button key={item} type="button" onClick={() => applyHistory(item)}
                className="rounded-full border border-[var(--border-subtle)] bg-white px-3 py-1 text-[12px] text-[#444] transition-colors hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]">
                {item}
              </button>
            ))}
            <button type="button" onClick={() => { setHistory([]); try { window.localStorage.removeItem(HISTORY_KEY) } catch {} }}
              className="text-[12px] text-[#ccc] underline underline-offset-4 hover:text-[#999]">
              Clear
            </button>
          </div>
        )}

        {/* Cards */}
        {results.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
              {results.map((post) => (
                <SearchResultCard key={post.id} post={post} view={viewMode} />
              ))}
              {isPending && Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={`sk-${i}`} view={viewMode} />
              ))}
            </div>

            {/* Load more */}
            {!isPending && (
              <div className="flex flex-col items-center gap-3 pt-2">
                {error && <p className="text-[13px] text-[var(--accent-red)]">{error}</p>}
                {hasNextPage ? (
                  <button type="button" onClick={loadMore}
                    className="ui-font flex items-center gap-2.5 rounded-[10px] border border-[var(--border-subtle)] bg-white px-8 py-3 text-[14px] font-medium text-[#444] shadow-sm transition-all hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]">
                    Load more results
                  </button>
                ) : (
                  <p className="text-[12px] text-[#ccc]">All results loaded</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[var(--border-subtle)] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#ccc]">
              <SearchIcon />
            </div>
            <h2 className="ui-font text-[22px] font-semibold text-[#111]">No results found</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#888]">Try a broader keyword, remove a filter, or browse by category.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/insights" className="rounded-[10px] border border-[var(--border-subtle)] px-4 py-2 text-[13px] text-[#555] transition-colors hover:bg-gray-50">Browse Insights</Link>
              <Link href="/whitepapers" className="rounded-[10px] border border-[var(--border-subtle)] px-4 py-2 text-[13px] text-[#555] transition-colors hover:bg-gray-50">White Papers</Link>
              <Link href="/webinars" className="rounded-[10px] border border-[var(--border-subtle)] px-4 py-2 text-[13px] text-[#555] transition-colors hover:bg-gray-50">Webinars</Link>
            </div>
          </div>
        )}

        {/* Browse footer */}
        <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[#fafafa] p-4 text-[12px] text-[#aaa]">
          Search covers published Insights, White Papers, and Webinars. &nbsp;
          <Link href="/insights" className="underline underline-offset-4 hover:text-[#555]">Insights</Link>
          {' · '}
          <Link href="/whitepapers" className="underline underline-offset-4 hover:text-[#555]">White Papers</Link>
          {' · '}
          <Link href="/webinars" className="underline underline-offset-4 hover:text-[#555]">Webinars</Link>
        </div>
      </div>
    </div>
  )
}
