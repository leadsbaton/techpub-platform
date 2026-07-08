'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { Category } from '@/lib/types/cms'
import { getCategoryFilterHref, normalizeRouteBase } from '@/lib/utils/contentTypes'

type NavLink = {
  label: string
  href: string
  dropdownEnabled?: boolean
  categories?: Category[]
}

type NavClientProps = {
  siteName: string
  links: NavLink[]
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

export function NavClient({ siteName, links }: NavClientProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-white">
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
          </Link>

          <nav className="hidden items-center gap-12 lg:flex">
            {links.map((link) => {
              const normalizedHref = normalizeRouteBase(link.href)
              const categoryLinks = [
                { id: 'all', name: 'View All', slug: '' },
                ...((link.categories ?? []).map((category) => ({
                  id: category.id,
                  name: category.name,
                  slug: category.slug,
                }))),
              ]
              const dropdownEnabled = Boolean(
                link.dropdownEnabled && normalizedHref !== '/' && categoryLinks.length > 1,
              )
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
                    <div className="absolute left-1/2 top-full z-30 w-[min(280px,calc(100vw-32px))] -translate-x-1/2 pt-2">
                      <div className="rounded-[18px] border border-[var(--border-subtle)] bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                        <div className="max-h-[min(420px,calc(100vh-140px))] space-y-1 overflow-y-auto overscroll-contain pr-1">
                          {categoryLinks.map((category) => (
                            <Link
                              key={`${normalizedHref}-${category.id}`}
                              href={getCategoryFilterHref(normalizedHref, category.slug)}
                              title={category.name}
                              className="block overflow-hidden break-words rounded-xl px-3 py-2.5 text-[13px] font-medium leading-5 text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
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
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border-subtle)] text-[color:var(--text-strong)] lg:hidden"
              onClick={() => {
                setMobileOpen((value) => {
                  const next = !value
                  if (!next) setMobileExpanded(null)
                  return next
                })
              }}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div id="mobile-navigation" className="fixed inset-x-0 top-[88px] z-40 max-h-[calc(100vh-88px)] overflow-y-auto border-b border-[var(--border-subtle)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:hidden">
          <div className="space-y-2">
            {links.map((link) => {
              const normalizedHref = normalizeRouteBase(link.href)
              const categoryLinks = [
                { id: 'all', name: 'View All', slug: '' },
                ...((link.categories ?? []).map((category) => ({
                  id: category.id,
                  name: category.name,
                  slug: category.slug,
                }))),
              ]
              const dropdownEnabled = Boolean(
                link.dropdownEnabled && normalizedHref !== '/' && categoryLinks.length > 1,
              )
              const active = isActive(pathname, normalizedHref)
              const expanded = mobileExpanded === normalizedHref

              return (
                <div
                  key={`mobile-${normalizedHref}`}
                  className={`rounded-2xl border px-3 py-2 transition ${
                    expanded || active
                      ? 'border-[var(--accent-red)] bg-red-50/50'
                      : 'border-transparent'
                  }`}
                >
                  {dropdownEnabled ? (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-categories-${link.label.replace(/\s+/g, '-').toLowerCase()}`}
                      className={`flex w-full items-center justify-between gap-3 py-2 text-left text-[1.05rem] font-semibold ${
                        active || expanded
                          ? 'text-[color:var(--accent-red)]'
                          : 'text-[color:var(--text-strong)]'
                      }`}
                      onClick={() =>
                        setMobileExpanded((value) =>
                          value === normalizedHref ? null : normalizedHref,
                        )
                      }
                    >
                      <span className="min-w-0 break-words">{link.label}</span>
                      <span
                        className={`shrink-0 transition-transform duration-200 ${
                          expanded ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={normalizedHref}
                      className={`flex items-center justify-between gap-3 py-2 text-[1.05rem] font-semibold ${
                        active ? 'text-[color:var(--accent-red)]' : 'text-[color:var(--text-strong)]'
                      }`}
                      onClick={() => {
                        setMobileOpen(false)
                        setMobileExpanded(null)
                      }}
                    >
                      <span className="min-w-0 break-words">{link.label}</span>
                    </Link>
                  )}

                  {dropdownEnabled && expanded ? (
                    <div
                      id={`mobile-categories-${link.label.replace(/\s+/g, '-').toLowerCase()}`}
                      className="mt-2 grid max-h-[45vh] gap-1 overflow-y-auto overscroll-contain border-t border-[var(--border-subtle)] pt-3"
                    >
                      {categoryLinks.map((category) => (
                        <Link
                          key={`mobile-${normalizedHref}-${category.id}`}
                          href={getCategoryFilterHref(normalizedHref, category.slug)}
                          title={category.name}
                          className="break-words rounded-xl px-3 py-2 text-sm font-medium leading-5 text-[color:var(--text-soft)] hover:bg-[var(--surface-muted)]"
                          onClick={() => {
                            setMobileOpen(false)
                            setMobileExpanded(null)
                          }}
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
