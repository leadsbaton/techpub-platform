import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access/cmsAccess'
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
      admin: {
        description:
          'Admin recipients for white paper lead notifications. EmailJS credentials are read from environment variables.',
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
    {
      name: 'systemIntegrations',
      type: 'group',
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
            'Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY in the backend environment.',
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
