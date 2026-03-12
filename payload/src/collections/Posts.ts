import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished } from '../access/cmsAccess'
import { linkField } from '../fields/link'
import { seoFields } from '../fields/seo'
import { slugHook } from '../fields/slug'
import { resolvePostPath } from '../lib/contentLinks'
import type { Post as PostDocument } from '../payload-types'

const frontendURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000'
type PostTypeKey = 'insight' | 'whitepaper' | 'webinar'
type PostFormData = Partial<PostDocument> & {
  contentType?: string | { id?: string; key?: PostTypeKey } | null
  type?: PostTypeKey
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'primaryCategory', 'status', 'publishedAt'],
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data.slug === 'string' ? data.slug : null
        const type = typeof data.type === 'string' ? data.type : null
        const title = typeof data.title === 'string' ? data.title : ''
        const excerpt = typeof data.excerpt === 'string' ? data.excerpt : ''
        const status = typeof data.status === 'string' ? data.status : 'draft'
        const route = `${frontendURL}/preview/post`
        const params = new URLSearchParams()
        if (slug) params.set('slug', slug)
        if (type) params.set('type', type)
        if (title) params.set('title', title)
        if (excerpt) params.set('excerpt', excerpt)
        if (status) params.set('status', status)
        return params.toString() ? `${route}?${params.toString()}` : route
      },
    },
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
      type: 'tabs',
      tabs: [
        {
          label: 'Essentials',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Public headline shown in cards, SEO, and the post detail page.',
                    width: '70%',
                  },
                },
                {
                  name: 'readingTime',
                  type: 'number',
                  admin: {
                    description: 'Estimated reading time in minutes.',
                    width: '30%',
                  },
                },
              ],
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              hooks: {
                beforeValidate: [slugHook('title')],
              },
              admin: {
                description: 'Shareable URL segment. Auto-generated from title and adjusted if a duplicate already exists.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contentType',
                  type: 'relationship',
                  relationTo: 'content-types',
                  required: true,
                  filterOptions: {
                    active: {
                      equals: true,
                    },
                  },
                  admin: {
                    description:
                      'Controls the public section and route. Seeded options are Insight, White Paper, and Webinar.',
                    width: '50%',
                  },
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
                  admin: {
                    description:
                      'Draft stays hidden from the public site. Published is visible on the frontend. Archived is stored but excluded from public queries.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'type',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'authors',
                  type: 'relationship',
                  relationTo: 'authors',
                  hasMany: true,
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'primaryCategory',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  admin: {
                    description: 'Main taxonomy used in UI filters like Finance, Marketing, and Technology.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short summary used on listing pages and hero cards.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          label: 'Media & Discovery',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'featuredImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Main card and detail-page image.',
                    width: '50%',
                  },
                },
                {
                  name: 'downloadAsset',
                  type: 'relationship',
                  relationTo: 'media',
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (siblingData.type === 'whitepaper' && !value && !siblingData.externalUrl) {
                      return 'Whitepaper posts need either a download asset or an external URL.'
                    }

                    return true
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'whitepaper',
                    description: 'Optional downloadable asset for whitepaper entries.',
                    width: '50%',
                  },
                },
              ],
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
              type: 'row',
              fields: [
                {
                  name: 'videoUrl',
                  type: 'text',
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (siblingData.type === 'webinar' && !value && !siblingData.externalUrl) {
                      return 'Webinar posts need either a video URL or an external URL.'
                    }

                    return true
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional event stream, replay, or registration video URL for webinar pages.',
                    width: '50%',
                  },
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (siblingData.type === 'whitepaper' && !value && !siblingData.downloadAsset) {
                      return 'Whitepaper posts need either an external URL or a download asset.'
                    }

                    if (siblingData.type === 'webinar' && !value && !siblingData.videoUrl) {
                      return 'Webinar posts need either an external URL or a video URL.'
                    }

                    return true
                  },
                  admin: {
                    description: 'Optional canonical, download, or registration URL.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'pinned',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'publishedAt',
                  type: 'date',
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
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
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              admin: {
                description: 'Optional related content suggestions shown near this post.',
              },
            },
          ],
        },
        {
          label: 'Preview',
          fields: [
            {
              name: 'postLivePreview',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: './components/admin/PostLivePreviewFrame',
                    exportName: 'PostLivePreviewFrame',
                  },
                },
              },
            },
          ],
        },
        {
          label: 'Actions & SEO',
          fields: [
            {
              name: 'cta',
              type: 'group',
              fields: [linkField('primary', 'Primary CTA')],
            },
            ...seoFields(),
          ],
        },
      ],
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
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const nextData: PostFormData = { ...(data as PostFormData) }

        if (operation === 'create' && req.user) {
          nextData.createdBy = req.user.id
        }

        if (req.user) {
          nextData.updatedBy = req.user.id
        }

        const contentTypeValue = nextData.contentType
        const contentTypeId =
          typeof contentTypeValue === 'string'
            ? contentTypeValue
            : contentTypeValue && typeof contentTypeValue === 'object' && 'id' in contentTypeValue
              ? contentTypeValue.id
              : null

        if (contentTypeId) {
          const contentTypeDoc = await req.payload.findByID({
            collection: 'content-types',
            id: contentTypeId,
            depth: 0,
            overrideAccess: true,
          })

          nextData.type = contentTypeDoc.key as PostTypeKey
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
