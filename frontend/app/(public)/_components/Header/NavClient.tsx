'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

import type { Category } from '@/lib/types/cms'
import { getCategoryFilterHref, normalizeRouteBase } from '@/lib/utils/contentTypes'

type NavLink = {
  label: string
  href: string
  dropdownEnabled?: boolean
}

type NavClientProps = {
  siteName: string
  siteTagline?: string | null
  links: NavLink[]
  categories: Category[]
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M3 6.25 8 11l5-4.75" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path d="M6 6 18 18M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function NavClient({ siteName, siteTagline, links, categories }: NavClientProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const categoryLinks = useMemo(
    () => [
      { id: 'all', name: 'View All', slug: '' },
      ...categories.map((category) => ({ id: category.id, name: category.name, slug: category.slug })),
    ],
    [categories],
  )

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[color:var(--surface)]">
        <div className="site-container flex h-[88px] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/leads-baton-logo.png"
              alt={siteName}
              width={72}
              height={72}
              className="h-14 w-auto shrink-0 object-contain"
              priority
            />
            <div className="hidden min-w-0 sm:block">
              <div className="text-[10px] font-semibold tracking-tight text-[color:var(--text-strong)]">
                {siteName}
              </div>
              <div className="text-[8px] uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
                {siteTagline || 'We Speak Your Language'}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-12 lg:flex">
            {links.map((link) => {
              const normalizedHref = normalizeRouteBase(link.href)
              const dropdownEnabled = Boolean(link.dropdownEnabled && normalizedHref !== '/' && categoryLinks.length > 1)
              const active = isActive(pathname, normalizedHref)

              return (
                <div
                  key={`${link.label}-${normalizedHref}`}
                  className="relative -mb-4 pb-4"
                  onMouseEnter={() => dropdownEnabled && setOpenDropdown(normalizedHref)}
                  onMouseLeave={() => dropdownEnabled && setOpenDropdown(null)}
                >
                  <Link
                    href={normalizedHref}
                    className={`nav-link ${active ? 'nav-link-active' : ''}`}
                    onClick={() => {
                      setMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    <span>{link.label}</span>
                    {dropdownEnabled ? <ChevronDownIcon /> : null}
                  </Link>

                  {dropdownEnabled && openDropdown === normalizedHref ? (
                    <div className="absolute left-1/2 top-full z-30 w-56 -translate-x-1/2 pt-2">
                      <div className="rounded-[22px] border border-[var(--border-subtle)] bg-white p-3 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                        <div className="space-y-1">
                          {categoryLinks.map((category) => (
                            <Link
                              key={`${normalizedHref}-${category.id}`}
                              href={getCategoryFilterHref(normalizedHref, category.slug)}
                              className="block rounded-xl px-3 py-2 text-[15px] font-medium text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="grid h-12 w-12 place-items-center rounded-full text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
            >
              <SearchIcon />
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border-subtle)] text-[color:var(--text-strong)] lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-[88px] z-40 max-h-[calc(100vh-88px)] overflow-y-auto border-b border-[var(--border-subtle)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:hidden">
          <div className="space-y-2">
            {links.map((link) => {
              const normalizedHref = normalizeRouteBase(link.href)
              const dropdownEnabled = Boolean(link.dropdownEnabled && normalizedHref !== '/' && categoryLinks.length > 1)
              const active = isActive(pathname, normalizedHref)

              return (
                <div key={`mobile-${normalizedHref}`} className="border-b border-[var(--border-subtle)] px-1 py-3 last:border-b-0">
                  <Link
                    href={normalizedHref}
                    className={`flex items-center justify-between text-[1.05rem] font-semibold ${active ? 'text-[color:var(--accent-red)]' : 'text-[color:var(--text-strong)]'}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{link.label}</span>
                    {dropdownEnabled ? <ChevronDownIcon /> : null}
                  </Link>

                  {dropdownEnabled ? (
                    <div className="mt-3 grid gap-1 border-t border-[var(--border-subtle)] pt-3">
                      {categoryLinks.map((category) => (
                        <Link
                          key={`mobile-${normalizedHref}-${category.id}`}
                          href={getCategoryFilterHref(normalizedHref, category.slug)}
                          className="rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--text-soft)] hover:bg-[var(--surface-muted)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </>
  )
}
