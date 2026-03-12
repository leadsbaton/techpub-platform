import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished } from '../access/cmsAccess'
import { linkField } from '../fields/link'
import { seoFields } from '../fields/seo'
import { slugHook } from '../fields/slug'
import { resolvePostPath } from '../lib/contentLinks'

const frontendURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'publishedAt'],
    preview: (doc) => {
      const path = resolvePostPath({
        slug: typeof doc.slug === 'string' ? doc.slug : null,
        type: typeof doc.type === 'string' ? doc.type : null,
      })

      return path ? `${frontendURL}${path}` : frontendURL
    },
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrPublished,
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [slugHook('title')],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'insight',
      options: [
        { label: 'Insight', value: 'insight' },
        { label: 'Whitepaper', value: 'whitepaper' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Case Study', value: 'case-study' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'pinned',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      required: true,
    },
    {
      name: 'primaryCategory',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        description: 'Estimated reading time in minutes.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      validate: (value, { siblingData }) => {
        if (siblingData.status === 'published' && !value) {
          return 'Published posts require a publish date.'
        }

        return true
      },
      admin: {
        description: 'Required for published content. Defaults to now when you publish.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'webinar',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: 'Optional canonical or registration URL.',
      },
    },
    {
      name: 'downloadAsset',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'whitepaper',
      },
    },
    {
      name: 'cta',
      type: 'group',
      fields: [linkField('primary', 'Primary CTA')],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    ...seoFields(),
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const nextData = { ...data }

        if (operation === 'create' && req.user) {
          nextData.createdBy = req.user.id
        }

        if (req.user) {
          nextData.updatedBy = req.user.id
        }

        if (nextData.status === 'published' && !nextData.publishedAt) {
          nextData.publishedAt = new Date().toISOString()
        }

        if (nextData.slug && typeof nextData.slug === 'string') {
          const existing = await req.payload.find({
            collection: 'posts',
            depth: 0,
            limit: 1,
            overrideAccess: true,
            pagination: false,
            where: {
              and: [
                {
                  slug: {
                    equals: nextData.slug,
                  },
                },
                ...(originalDoc?.id
                  ? [
                      {
                        id: {
                          not_equals: originalDoc.id,
                        },
                      },
                    ]
                  : []),
              ],
            },
          })

          if (existing.docs.length > 0) {
            nextData.slug = `${nextData.slug}-${Date.now().toString().slice(-6)}`
          }
        }

        return nextData
      },
    ],
  },
}

export default Posts
