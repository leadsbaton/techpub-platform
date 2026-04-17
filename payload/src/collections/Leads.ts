import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/cmsAccess'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'post', 'deliveryMode', 'notificationStatus', 'submittedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      defaultValue: 'whitepaper',
      options: [{ label: 'White Paper', value: 'whitepaper' }],
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'jobTitle',
          type: 'text',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'company',
          type: 'text',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'newsletterOptIn',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'consentAccepted',
          type: 'checkbox',
          required: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'deliveryMode',
          type: 'select',
          required: true,
          options: [
            { label: 'Read', value: 'read' },
            { label: 'Download', value: 'download' },
            { label: 'Redirect', value: 'redirect' },
          ],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'submittedAt',
          type: 'date',
          required: true,
          admin: {
            width: '25%',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'deliveryTarget',
      type: 'text',
    },
    {
      name: 'sourceUrl',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'notificationStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Partial', value: 'partial' },
            { label: 'Failed', value: 'failed' },
            { label: 'Skipped', value: 'skipped' },
          ],
          admin: {
            readOnly: true,
            width: '30%',
          },
        },
        {
          name: 'notificationRecipients',
          type: 'text',
          admin: {
            readOnly: true,
            width: '70%',
            description: 'Comma-separated admin email recipients used for this lead notification.',
          },
        },
      ],
    },
    {
      name: 'notificationError',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
  ],
}

export default Leads
