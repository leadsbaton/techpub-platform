import type { GlobalConfig } from 'payload'

import { linkField } from '../fields/link'
import { seoFields } from '../fields/seo'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
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
      name: 'socialLinks',
      type: 'array',
      defaultValue: [
        {
          platform: 'Instagram',
          url: 'https://instagram.com/leadsbaton',
        },
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/company/leadsbaton',
        },
        {
          platform: 'X',
          url: 'https://x.com/leadsbaton',
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
          title: 'Learn more',
          links: [
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
        },
        {
          title: 'Support',
          links: [
            {
              item: {
                label: 'Contact',
                type: 'custom',
                url: '/contact',
                newTab: false,
              },
            },
            {
              item: {
                label: 'Support',
                type: 'custom',
                url: '/support',
                newTab: false,
              },
            },
            {
              item: {
                label: 'Legal',
                type: 'custom',
                url: '/legal',
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
    ...seoFields(),
  ],
}
