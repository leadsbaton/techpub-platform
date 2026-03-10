import Link from 'next/link'

type Props = {
  basePath: string
  currentPage: number
  totalPages: number
  query?: Record<string, string | undefined>
}

function createHref(basePath: string, page: number, query?: Record<string, string | undefined>) {
  const params = new URLSearchParams()

  if (page > 1) params.set('page', String(page))

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

export function Pagination({ basePath, currentPage, totalPages, query }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-3">
      <Link href={createHref(basePath, currentPage - 1, query)} aria-disabled={currentPage === 1} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 aria-disabled:pointer-events-none aria-disabled:opacity-40">
        Previous
      </Link>
      <span className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <Link href={createHref(basePath, currentPage + 1, query)} aria-disabled={currentPage === totalPages} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 aria-disabled:pointer-events-none aria-disabled:opacity-40">
        Next
      </Link>
    </nav>
  )
}
