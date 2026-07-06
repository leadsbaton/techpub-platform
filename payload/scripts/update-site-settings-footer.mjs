import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config.ts'

const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })

const footerSettings = {
  socialLinks: [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61566855997017&name=xhp_nt_',
    },
    { platform: 'X', url: 'https://x.com/Leads_baton' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/leadsbaton/posts/?feedView=all' },
    { platform: 'Instagram', url: 'https://www.instagram.com/leads_baton_/' },
  ],
  footerSections: [
    {
      title: 'Quick Links',
      links: [
        {
          item: {
            label: 'Services',
            type: 'custom',
            url: 'https://leadsbaton.com/services/',
            newTab: false,
          },
        },
        {
          item: {
            label: 'Audience Data',
            type: 'custom',
            url: 'https://leadsbaton.com/audience-data/',
            newTab: false,
          },
        },
        {
          item: {
            label: 'News & Articles',
            type: 'custom',
            url: 'https://leadsbaton.com/news-articles/',
            newTab: false,
          },
        },
        {
          item: {
            label: 'Contact Us',
            type: 'custom',
            url: 'https://leadsbaton.com/contact-us/',
            newTab: false,
          },
        },
      ],
    },
  ],
  footerContact: {
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
  },
  footerCopyright: 'Copyright © 2026 Leadsbaton. All rights reserved.',
  footerPolicyLinks: [
    { label: 'Privacy Policy', href: 'https://leadsbaton.com/privacy-policy/' },
    { label: 'CCPA', href: 'https://leadsbaton.com/ccpa/' },
    {
      label: "Don't Sell My Personal Information",
      href: 'https://leadsbaton.com/dont-sell-my-personal-information/',
    },
  ],
}

const updated = await payload.updateGlobal({
  slug: 'site-settings',
  data: footerSettings,
  depth: 0,
})

console.log(
  JSON.stringify(
    {
      ok: true,
      socialLinks: updated.socialLinks?.length ?? 0,
      footerSections: updated.footerSections?.length ?? 0,
      footerPolicyLinks: updated.footerPolicyLinks?.length ?? 0,
      footerCopyright: updated.footerCopyright,
    },
    null,
    2,
  ),
)

process.exit(0)
