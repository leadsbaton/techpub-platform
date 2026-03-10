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
      defaultValue: 'TechPub',
    },
    {
      name: 'siteTagline',
      type: 'text',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
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
    },
    {
      name: 'socialLinks',
      type: 'array',
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
      fields: [linkField('item', 'Header Link')],
    },
    {
      name: 'footerSections',
      type: 'array',
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
