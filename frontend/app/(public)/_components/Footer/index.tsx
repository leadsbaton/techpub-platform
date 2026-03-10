import Link from 'next/link'

import { getSiteSettings } from '@/lib/api/cms'
import { resolveLinkHref } from '@/lib/utils/formatting'

const Footer = async () => {
  const settings = await getSiteSettings()
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
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] md:px-6">
        <div className="space-y-4">
          <div className="text-2xl font-semibold tracking-tight">{settings?.siteName || 'TechPub'}</div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            {settings?.siteDescription || 'Editorial publishing stack powered by Next.js, Payload CMS, and MongoDB Atlas.'}
          </p>
          {settings?.contactEmail ? <p className="text-sm text-slate-400">{settings.contactEmail}</p> : null}
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.links?.map(({ item }) => (
                <Link key={`${section.title}-${item.label}`} href={resolveLinkHref(item)} className="block text-sm text-slate-300 transition hover:text-white">
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
