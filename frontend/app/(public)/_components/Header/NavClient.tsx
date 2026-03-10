'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { Category } from '@/lib/types/cms'

type NavLink = {
  label: string
  href: string
}

type NavClientProps = {
  siteName: string
  siteTagline?: string | null
  links: NavLink[]
  categories: Category[]
}

const dropdownTargets = new Set(['/insights', '/whitepapers'])

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavClient({ siteName, siteTagline, links, categories }: NavClientProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const categoryLinks = categories.length
    ? [{ id: 'all', name: 'View All', slug: '' }, ...categories.map((category) => ({ id: category.id, name: category.name, slug: category.slug }))]
    : []

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[color:var(--surface)]/95 backdrop-blur">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/leads-baton-logo.png"
              alt={siteName}
              width={54}
              height={54}
              className="h-12 w-auto shrink-0 object-contain"
              priority
            />
            <div className="hidden min-w-0 sm:block">
              <div className="text-sm font-semibold tracking-tight text-[color:var(--text-strong)]">
                {siteName}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                {siteTagline || 'We Speak Your Language'}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {links.map((link) => {
              const dropdownEnabled = dropdownTargets.has(link.href) && categoryLinks.length > 1
              const active = isActive(pathname, link.href)

              return (
                <div
                  key={`${link.label}-${link.href}`}
                  className="relative"
                  onMouseEnter={() => dropdownEnabled && setOpenDropdown(link.href)}
                  onMouseLeave={() => dropdownEnabled && setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`nav-link ${active ? 'nav-link-active' : ''}`}
                    onClick={() => {
                      setMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    <span>{link.label}</span>
                    {dropdownEnabled ? <span className="text-xs">⌄</span> : null}
                  </Link>

                  {dropdownEnabled && openDropdown === link.href ? (
                    <div className="absolute left-1/2 top-full mt-4 w-52 -translate-x-1/2 rounded-[20px] border border-[var(--border-subtle)] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                      <div className="space-y-2">
                        {categoryLinks.map((category) => {
                          const href = category.slug ? `/categories/${category.slug}` : link.href
                          return (
                            <Link
                              key={`${link.href}-${category.id}`}
                              href={href}
                              className="block rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--text-soft)] transition hover:bg-[var(--surface-muted)] hover:text-[color:var(--text-strong)]"
                            >
                              {category.name}
                            </Link>
                          )
                        })}
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
              className="grid h-11 w-11 place-items-center rounded-full text-[color:var(--text-strong)] transition hover:bg-[var(--surface-muted)]"
            >
              <span className="text-[26px] leading-none">⌕</span>
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border-subtle)] text-[color:var(--text-strong)] lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span className="text-lg">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-20 z-40 border-b border-[var(--border-subtle)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <div key={`mobile-${link.href}`} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
                <Link
                  href={link.href}
                  className={`flex items-center justify-between text-base font-semibold ${isActive(pathname, link.href) ? 'text-[color:var(--accent-red)]' : 'text-[color:var(--text-strong)]'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{link.label}</span>
                  {dropdownTargets.has(link.href) && categoryLinks.length > 1 ? <span className="text-sm">Browse</span> : null}
                </Link>
                {dropdownTargets.has(link.href) && categoryLinks.length > 1 ? (
                  <div className="mt-3 grid gap-2 border-t border-[var(--border-subtle)] pt-3">
                    {categoryLinks.map((category) => {
                      const href = category.slug ? `/categories/${category.slug}` : link.href
                      return (
                        <Link
                          key={`mobile-${link.href}-${category.id}`}
                          href={href}
                          className="rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--text-soft)] hover:bg-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          {category.name}
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
