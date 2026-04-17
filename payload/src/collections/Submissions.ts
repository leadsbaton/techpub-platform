import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/cmsAccess'

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'submissionType',
      'name',
      'email',
      'post',
      'deliveryMode',
      'notificationStatus',
      'submittedAt',
    ],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'submissionType',
      type: 'select',
      required: true,
      options: [
        { label: 'White Paper', value: 'whitepaper' },
        { label: 'Webinar', value: 'webinar' },
      ],
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
          admin: { width: '50%' },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'jobTitle',
          type: 'text',
          admin: { width: '33%' },
        },
        {
          name: 'company',
          type: 'text',
          admin: { width: '33%' },
        },
        {
          name: 'country',
          type: 'text',
          admin: { width: '33%' },
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
          admin: { width: '20%' },
        },
        {
          name: 'consentAccepted',
          type: 'checkbox',
          required: true,
          admin: { width: '20%' },
        },
        {
          name: 'deliveryMode',
          type: 'select',
          required: true,
          options: [
            { label: 'Read', value: 'read' },
            { label: 'Download', value: 'download' },
            { label: 'Redirect', value: 'redirect' },
            { label: 'Register', value: 'register' },
            { label: 'Watch', value: 'watch' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'submittedAt',
          type: 'date',
          required: true,
          admin: {
            width: '30%',
            date: { pickerAppearance: 'dayAndTime' },
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

export default Submissions
