import Image from 'next/image'
import Link from 'next/link'

import { getSiteSettings } from '@/lib/api/cms'
import type { SiteSettings } from '@/lib/types/cms'
import { resolveLinkHref } from '@/lib/utils/formatting'

const fallbackSections: NonNullable<SiteSettings['footerSections']> = [
  {
    title: 'Learn more',
    links: [
      { item: { label: 'Insights', type: 'custom', url: '/insights', newTab: false } },
      { item: { label: 'White Papers', type: 'custom', url: '/whitepapers', newTab: false } },
      { item: { label: 'Webinars', type: 'custom', url: '/webinars', newTab: false } },
    ],
  },
  {
    title: 'Support',
    links: [
      { item: { label: 'Contact Us', type: 'custom', url: '/contact', newTab: false } },
      { item: { label: 'Support', type: 'custom', url: '/support', newTab: false } },
      { item: { label: 'Legal', type: 'custom', url: '/legal', newTab: false } },
    ],
  },
]

const getFooterLabel = (label: string, href: string) => {
  if (href === '/contact' && label.toLowerCase() === 'contact') return 'Contact Us'
  return label
}

const Footer = async () => {
  const settings = await getSiteSettings()
  const socialLinks = settings?.socialLinks ?? []
  const sections = settings?.footerSections?.length ? settings.footerSections : fallbackSections

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-white">
      <div className="site-container grid gap-12 py-14 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-5">
          <div className="space-y-2">
            <Image
              src="/leads-baton-logo.png"
              alt={settings?.siteName || 'LeadsBaton'}
              width={110}
              height={110}
              className="h-20 w-auto object-contain"
            />
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
              {settings?.siteTagline || 'We Speak Your Language'}
            </div>
          </div>

          {socialLinks.length ? (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={`${item.platform}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] text-xs font-semibold text-[color:var(--text-soft)] transition hover:border-[var(--accent-red)] hover:text-[color:var(--accent-red)]"
                >
                  {item.platform.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="headline-font text-[1rem] font-extrabold text-[color:var(--text-strong)]">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.links?.map(({ item }) => (
                  <Link
                    key={`${section.title}-${item.label}`}
                    href={resolveLinkHref(item)}
                    className="block text-[15px] text-[color:var(--text-muted)] transition hover:text-[color:var(--text-strong)]"
                  >
                    {getFooterLabel(item.label, resolveLinkHref(item))}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
