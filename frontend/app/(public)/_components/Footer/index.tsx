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

// Real brand icons for the footer social links, picked by platform name. Falls
// back to a generic link/globe icon for anything unrecognized.
function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase()
  const common = { className: 'h-[18px] w-[18px]', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const

  if (key.includes('linkedin')) {
    return (
      <svg {...common}>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    )
  }
  if (key.includes('facebook')) {
    return (
      <svg {...common}>
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.87v-8.4H7.08v-3.47h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.47h-2.8v8.4C19.61 23.04 24 18.07 24 12.07z" />
      </svg>
    )
  }
  if (key === 'x' || key.includes('twitter')) {
    return (
      <svg {...common}>
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
      </svg>
    )
  }
  if (key.includes('instagram')) {
    return (
      <svg {...common}>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    )
  }
  if (key.includes('youtube')) {
    return (
      <svg {...common}>
        <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
      </svg>
    )
  }
  // Generic external-link fallback.
  return (
    <svg {...common}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a7.96 7.96 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4H4.26zm.81 2h2.95c.32 1.25.79 2.45 1.38 3.56A8.03 8.03 0 0 1 5.07 16zm2.95-8H5.07a8.03 8.03 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.02 8zM12 19.96a13.5 13.5 0 0 1-1.91-3.96h3.82A13.5 13.5 0 0 1 12 19.96zM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.24 5.56c.59-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a7.96 7.96 0 0 1 0 4h-3.38z" />
    </svg>
  )
}

const Footer = async () => {
  const settings = await getSiteSettings()
  const socialLinks = settings?.socialLinks ?? []
  const sections = settings?.footerSections?.length ? settings.footerSections : fallbackSections

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-white">
      <div className="site-container grid gap-10 py-10 md:grid-cols-[1fr_auto] md:items-end md:gap-12 md:py-14">
        <div className="space-y-5">
          <Image
            src="/leads-baton-logo.png"
            alt={settings?.siteName || 'LeadsBaton'}
            width={110}
            height={110}
            className="h-16 w-auto object-contain md:h-20"
          />

          {socialLinks.length ? (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={`${item.platform}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.platform}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] text-[color:var(--text-soft)] transition hover:border-[var(--accent-red)] hover:text-[color:var(--accent-red)]"
                >
                  <SocialIcon platform={item.platform} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-10">
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
