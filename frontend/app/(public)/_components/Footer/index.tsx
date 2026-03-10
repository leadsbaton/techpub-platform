import Link from 'next/link'
import Image from 'next/image'

import { getSiteSettings } from '@/lib/api/cms'
import { resolveLinkHref } from '@/lib/utils/formatting'

const Footer = async () => {
  const settings = await getSiteSettings()
  const socialLinks = settings?.socialLinks ?? []
  const sections =
    settings?.footerSections?.length
      ? settings.footerSections
      : [
          {
            title: 'Content',
            links: [
              { item: { label: 'Insights', type: 'custom', url: '/insights' } },
              { item: { label: 'Whitepapers', type: 'custom', url: '/whitepapers' } },
              { item: { label: 'Webinars', type: 'custom', url: '/webinars' } },
            ],
          },
        ]

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="site-container grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(2,minmax(0,220px))]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Image src="/leads-baton-logo.png" alt={settings?.siteName || 'LeadsBaton'} width={96} height={96} className="h-20 w-auto object-contain" />
            <div>
              <div className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">
                {settings?.siteName || 'LeadsBaton'}
              </div>
              <div className="text-sm text-[color:var(--text-muted)]">
                {settings?.siteTagline || 'We Speak Your Language'}
              </div>
            </div>
          </div>
          {settings?.contactEmail ? <p className="text-sm text-[color:var(--text-soft)]">{settings.contactEmail}</p> : null}
          {socialLinks.length ? (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={`${item.platform}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-11 min-w-11 place-items-center rounded-full border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[color:var(--text-soft)] transition hover:border-[var(--accent-red)] hover:text-[color:var(--accent-red)]"
                >
                  {item.platform.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-sm font-semibold text-[color:var(--text-strong)]">{section.title}</h2>
            <div className="space-y-3">
              {section.links?.map(({ item }) => (
                <Link
                  key={`${section.title}-${item.label}`}
                  href={resolveLinkHref(item)}
                  className="block text-sm text-[color:var(--text-muted)] transition hover:text-[color:var(--text-strong)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  )
}

export default Footer
