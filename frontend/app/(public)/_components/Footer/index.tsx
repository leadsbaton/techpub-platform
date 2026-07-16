import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { getSiteSettings } from '@/lib/api/cms'
import type { LinkReference } from '@/lib/types/cms'
import { resolveLinkHref } from '@/lib/utils/formatting'

const fallbackQuickLinks: LinkReference[] = [
  {
    label: 'Services',
    type: 'custom',
    url: 'https://leadsbaton.com/services/',
    newTab: false,
  },
  {
    label: 'Audience Data',
    type: 'custom',
    url: 'https://leadsbaton.com/audience-data/',
    newTab: false,
  },
  {
    label: 'News & Articles',
    type: 'custom',
    url: 'https://leadsbaton.com/news-articles/',
    newTab: false,
  },
  {
    label: 'Contact Us',
    type: 'custom',
    url: 'https://leadsbaton.com/contact-us/',
    newTab: false,
  },
]

const fallbackSocialLinks = [
  {
    platform: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61566855997017&name=xhp_nt_',
  },
  { platform: 'X', url: 'https://x.com/Leads_baton' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/leadsbaton/posts/?feedView=all' },
  { platform: 'Instagram', url: 'https://www.instagram.com/leads_baton_/' },
]

const fallbackContact = {
  phone: '+971 52 713 3741',
  addresses: [
    { address: 'Leads Baton, 244, 5th Avenue #2, New York, NY -10001 USA' },
    {
      address:
        'Sreevari Complex, 1st Floor, Suite No. 7, Opposite to Mahaveer Cygnet, Kogilu Main Road, Yelahanka, Bengaluru, Karnataka- 560064',
    },
    { address: '#17, New Aggarwal Colony, D.N. College Road, Hisar, Haryana-125001' },
    {
      address:
        'Leads Baton FZ-LLC, FDEK7867, Compass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ Ras Al Khaimah, United Arab Emirates',
    },
  ],
  emails: [],
  hours: null,
}

const fallbackPolicyLinks = [
  { label: 'Privacy Policy', href: 'https://leadsbaton.com/privacy-policy/' },
  { label: 'CCPA', href: 'https://leadsbaton.com/ccpa/' },
  {
    label: "Don't Sell My Personal Information",
    href: 'https://leadsbaton.com/dont-sell-my-personal-information/',
  },
]

function ExternalAwareLink({
  children,
  className,
  href,
}: {
  children: ReactNode
  className: string
  href: string
}) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')

  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function SocialGlyph({ platform }: { platform: string }) {
  const normalized = platform.toLowerCase()

  if (normalized.includes('facebook')) {
    return <span className="font-bold leading-none">f</span>
  }

  if (normalized === 'x' || normalized.includes('twitter')) {
    return <span className="text-[1.1rem] font-semibold leading-none">X</span>
  }

  if (normalized.includes('linkedin')) {
    return <span className="text-[1.05rem] font-bold leading-none">in</span>
  }

  if (normalized.includes('instagram')) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" className="fill-current stroke-none" />
      </svg>
    )
  }

  return <span className="text-[1rem] font-bold leading-none">↗</span>
}

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const normalized = platform.toLowerCase()
  const colorMap: Record<string, string> = {
    facebook: 'bg-[#4267b2]',
    instagram: 'bg-[#2f2f2f]',
    linkedin: 'bg-[#0077b5]',
    x: 'bg-black',
    twitter: 'bg-black',
    youtube: 'bg-[var(--accent-red)]',
  }
  const colorClass = colorMap[normalized] ?? 'bg-[#2f2f2f]'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-10 w-10 items-center justify-center rounded-full text-[1.35rem] text-white transition-transform duration-200 hover:-translate-y-1 ${colorClass}`}
      aria-label={`${platform} social link`}
    >
      <SocialGlyph platform={platform} />
    </a>
  )
}

function ContactIcon({ type }: { type: 'phone' | 'pin' | 'mail' | 'time' }) {
  if (type === 'phone') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-7 w-7 flex-shrink-0 fill-[#df2946]">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.6c0 .7-.5 1.2-1.2 1.2C10.5 21.5 2.5 13.5 2.5 3.4c0-.7.5-1.2 1.2-1.2h3.6c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-2.2 2.2z" />
      </svg>
    )
  }

  if (type === 'pin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-7 w-7 flex-shrink-0 fill-[#df2946]">
        <path d="M12 2.2c-4 0-7.2 3.2-7.2 7.2 0 5.4 7.2 12.4 7.2 12.4s7.2-7 7.2-12.4c0-4-3.2-7.2-7.2-7.2zm0 10.1a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8z" />
      </svg>
    )
  }

  if (type === 'mail') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-7 w-7 flex-shrink-0 fill-[#df2946]">
        <path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm9 8 8-5.2V7l-8 5.2L4 7v.8L12 13z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-7 w-7 flex-shrink-0 fill-[#df2946]">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.2 4.2 2.5-.9 1.5-5.1-3V6h1.8v6.2z" />
    </svg>
  )
}

const Footer = async () => {
  const settings = await getSiteSettings()

  const quickLinks = fallbackQuickLinks.map((item) => ({ item }))
  const cmsSocialLinks = settings?.socialLinks ?? []
  const socialLinks = fallbackSocialLinks.map((fallbackLink) => {
    const cmsLink = cmsSocialLinks.find(
      (link) => link.platform.toLowerCase() === fallbackLink.platform.toLowerCase(),
    )

    return cmsLink ?? fallbackLink
  })
  const cmsContact = settings?.footerContact
  const contactInfo = {
    phone: cmsContact?.phone || fallbackContact.phone,
    addresses: cmsContact?.addresses?.length ? cmsContact.addresses : fallbackContact.addresses,
    emails: cmsContact?.emails?.length ? cmsContact.emails : fallbackContact.emails,
    hours: cmsContact?.hours || fallbackContact.hours,
  }
  const policyLinks = fallbackPolicyLinks
  const cmsCopyright = settings?.footerCopyright ?? ''
  const copyright =
    cmsCopyright.toLowerCase().includes('techpub') || cmsCopyright.includes('2022')
      ? 'Copyright © 2026 Leadsbaton. All rights reserved.'
      : cmsCopyright || 'Copyright © 2026 Leadsbaton. All rights reserved.'
  const logoSrc =
    typeof settings?.logo === 'string'
      ? settings.logo
      : settings?.logo?.url || '/leads-baton-logo.png'

  return (
    <footer className="border-t border-gray-100 bg-white text-[#111]">
      <div className="site-container py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[230px_210px_minmax(0,1fr)] lg:gap-14">
          <div>
            <div className="mb-5 w-[145px] max-w-full">
              <Image
                src={logoSrc}
                alt={settings?.siteName || 'LeadsBaton'}
                width={170}
                height={125}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <SocialIcon key={link.url} platform={link.platform} url={link.url} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-[1.55rem] font-extrabold leading-none text-[#df2946]">
              Quick Links
            </h3>
            <ul className="space-y-6 text-[1.28rem] leading-tight">
              {quickLinks.map((linkItem) => {
                const href = resolveLinkHref(linkItem.item)
                const label = typeof linkItem.item === 'string' ? linkItem.item : linkItem.item.label

                return href ? (
                  <li key={`${label}-${href}`}>
                    <ExternalAwareLink
                      href={href}
                      className="font-medium text-[#111] transition-colors hover:text-[#df2946]"
                    >
                      {label}
                    </ExternalAwareLink>
                  </li>
                ) : null
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-[1.55rem] font-extrabold leading-none text-[#df2946]">
              Contact
            </h3>
            <div className="space-y-4 text-[1.13rem] leading-[1.45] text-[#111]">
              {contactInfo.phone && (
                <div className="flex gap-4">
                  <ContactIcon type="phone" />
                  <a href={`tel:${contactInfo.phone}`} className="transition-colors hover:text-[#df2946]">
                    {contactInfo.phone}
                  </a>
                </div>
              )}

              {contactInfo.addresses?.map((addr, idx) => (
                <div key={idx} className="flex gap-4">
                  <ContactIcon type="pin" />
                  <p className="break-words">{addr.address}</p>
                </div>
              ))}

              {contactInfo.emails?.map((email, idx) => (
                <div key={idx} className="flex gap-4">
                  <ContactIcon type="mail" />
                  <a href={`mailto:${email.email}`} className="transition-colors hover:text-[#df2946]">
                    {email.email}
                  </a>
                </div>
              ))}

              {contactInfo.hours && (
                <div className="flex gap-4">
                  <ContactIcon type="time" />
                  <p>{contactInfo.hours}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <div className="space-y-5">
          <nav aria-label="Footer policy links" className="flex flex-wrap gap-x-10 gap-y-3">
            {policyLinks.map((link) => (
              <ExternalAwareLink
                key={link.href}
                href={link.href}
                className="text-[0.98rem] font-extrabold uppercase text-[#777] transition-colors hover:text-[#df2946]"
              >
                {link.label}
              </ExternalAwareLink>
            ))}
          </nav>
          <p className="text-[0.96rem] font-bold text-[#777]">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
