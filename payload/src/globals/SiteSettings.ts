import type { GlobalConfig } from 'payload'

import { isAdmin, isAdminUser } from '../access/cmsAccess'
import { linkField } from '../fields/link'
import { seoFields } from '../fields/seo'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'LeadsBaton',
    },
    {
      name: 'siteTagline',
      type: 'text',
      defaultValue: 'We Speak Your Language',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Publishing platform for insights, white papers, webinars, and category-led discovery.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'defaultShareImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'info@leadsbaton.com',
    },
    {
      name: 'leadNotificationEmails',
      type: 'array',
      // Internal admin recipient addresses — the global is publicly readable,
      // so restrict this field to admins to avoid leaking these addresses.
      access: {
        read: ({ req }) => isAdminUser(req.user),
      },
      admin: {
        description:
          'Admin recipients for white paper and webinar form submissions. EmailJS credentials are read from environment variables.',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      defaultValue: [
        {
          platform: 'Facebook',
          url: 'https://www.facebook.com/profile.php?id=61566855997017&name=xhp_nt_',
        },
        {
          platform: 'X',
          url: 'https://x.com/Leads_baton',
        },
        {
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/company/leadsbaton/posts/?feedView=all',
        },
        {
          platform: 'Instagram',
          url: 'https://www.instagram.com/leads_baton_/',
        },
      ],
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'headerLinks',
      type: 'array',
      defaultValue: [
        {
          item: {
            label: 'Home',
            type: 'custom',
            url: '/',
            newTab: false,
          },
        },
        {
          item: {
            label: 'Insights',
            type: 'custom',
            url: '/insights',
            newTab: false,
          },
        },
        {
          item: {
            label: 'White Papers',
            type: 'custom',
            url: '/whitepapers',
            newTab: false,
          },
        },
        {
          item: {
            label: 'Webinars',
            type: 'custom',
            url: '/webinars',
            newTab: false,
          },
        },
      ],
      fields: [linkField('item', 'Header Link')],
    },
    {
      name: 'footerSections',
      type: 'array',
      defaultValue: [
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
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [linkField('item', 'Footer Link')],
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Subscribe for weekly insights',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'submitLabel',
          type: 'text',
          defaultValue: 'Subscribe',
        },
      ],
    },
    {
      name: 'footerContact',
      type: 'group',
      defaultValue: {
        phone: '+971 52 713 3741',
        addresses: [
          {
            address: 'Leads Baton, 244, 5th Avenue #2, New York, NY -10001 USA',
          },
          {
            address:
              'Sreevari Complex, 1st Floor, Suite No. 7, Opposite to Mahaveer Cygnet, Kogilu Main Road, Yelahanka, Bengaluru, Karnataka- 560064',
          },
          {
            address: '#17, New Aggarwal Colony, D.N. College Road, Hisar, Haryana-125001',
          },
          {
            address:
              'Leads Baton FZ-LLC, FDEK7867, Compass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ Ras Al Khaimah, United Arab Emirates',
          },
        ],
        emails: [],
      },
      admin: {
        description: 'Contact information displayed in the footer.',
      },
      fields: [
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'addresses',
          type: 'array',
          maxRows: 4,
          fields: [
            {
              name: 'address',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'emails',
          type: 'array',
          maxRows: 3,
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
            },
          ],
        },
        {
          name: 'hours',
          type: 'text',
        },
      ],
    },
    {
      name: 'footerCopyright',
      type: 'text',
      defaultValue: 'Copyright © 2026 Leadsbaton. All rights reserved.',
    },
    {
      name: 'footerPolicyLinks',
      type: 'array',
      defaultValue: [
        {
          label: 'Privacy Policy',
          href: 'https://leadsbaton.com/privacy-policy/',
        },
        {
          label: 'CCPA',
          href: 'https://leadsbaton.com/ccpa/',
        },
        {
          label: "Don't Sell My Personal Information",
          href: 'https://leadsbaton.com/dont-sell-my-personal-information/',
        },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'systemIntegrations',
      type: 'group',
      // Internal infrastructure notes (env var names, provider details) —
      // not meant for public consumption on a publicly-readable global.
      access: {
        read: ({ req }) => isAdminUser(req.user),
      },
      admin: {
        description:
          'Reference-only labels for environment-based integrations used by the frontend and API routes.',
      },
      fields: [
        {
          name: 'emailProvider',
          type: 'text',
          defaultValue: 'EmailJS',
        },
        {
          name: 'emailCredentialNote',
          type: 'textarea',
          defaultValue:
            'Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in the backend environment. EMAILJS_PRIVATE_KEY is optional if your EmailJS setup requires an access token.',
        },
        {
          name: 'emailTemplateFieldNote',
          type: 'textarea',
          defaultValue:
            'Recommended EmailJS template params: to_email, resource_title, lead_name, lead_email, lead_job_title, lead_company, lead_country, newsletter_opt_in, submitted_at, delivery_mode, delivery_target, source_url.',
        },
      ],
    },
    ...seoFields(),
  ],
}
