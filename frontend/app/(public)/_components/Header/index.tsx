import Link from 'next/link'

import { getSiteSettings } from '@/lib/api/cms'
import { resolveLinkHref } from '@/lib/utils/formatting'

const fallbackLinks = [
  { label: 'Insights', href: '/insights' },
  { label: 'Whitepapers', href: '/whitepapers' },
  { label: 'Webinars', href: '/webinars' },
  { label: 'Case Studies', href: '/case-studies' },
]

const Header = async () => {
  const settings = await getSiteSettings()
  const headerLinks =
    settings?.headerLinks?.map(({ item }) => ({
      label: item.label,
      href: resolveLinkHref(item),
    })) ?? fallbackLinks

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-bold text-amber-300">
            TP
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-950">
              {settings?.siteName || 'TechPub'}
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {settings?.siteTagline || 'Publishing platform'}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {headerLinks.map((link) => (
            <Link key={`${link.label}-${link.href}`} href={link.href} className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/insights" className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 md:inline-flex">
            Browse
          </Link>
          <Link href="/contact" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Contact
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
