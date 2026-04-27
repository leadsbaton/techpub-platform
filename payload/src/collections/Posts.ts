import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished } from '../access/cmsAccess'
import { linkField } from '../fields/link'
import { seoFields } from '../fields/seo'
import { slugHook } from '../fields/slug'
import { resolvePostPath } from '../lib/contentLinks'
import type { Post as PostDocument } from '../payload-types'

const frontendURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.vercel.app' : 'http://localhost:3000')
type PostTypeKey = 'insight' | 'whitepaper' | 'webinar'
type PostFormData = Partial<PostDocument> & {
  contentType?: string | { id?: string; key?: PostTypeKey } | null
  type?: PostTypeKey
  webinarSpeakerProfiles?: (string | { id?: string } | null)[] | null
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
          label: 'Post Builder',
          fields: [
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
                      'Choose the post type first. This controls the editor fields, preview examples, and public route.',
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
              name: 'postTypeGuide',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: './components/admin/PostAuthoringGuide',
                    exportName: 'PostAuthoringGuide',
                  },
                },
              },
            },
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
                  name: 'authors',
                  label: 'Authors',
                  type: 'relationship',
                  relationTo: 'authors',
                  hasMany: true,
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (
                      (siblingData.type === 'insight' || siblingData.type === 'whitepaper') &&
                      (!Array.isArray(value) || value.length === 0)
                    ) {
                      return 'Insights and white papers should have at least one author.'
                    }

                    return true
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type !== 'webinar',
                    description:
                      'Used for insight and white paper bylines.',
                    width: '50%',
                  },
                },
                {
                  name: 'webinarSpeakerProfiles',
                  label: 'Speakers',
                  type: 'relationship',
                  relationTo: 'authors',
                  hasMany: true,
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (siblingData.type === 'webinar' && (!Array.isArray(value) || value.length < 2)) {
                      return 'Choose at least 2 people for a webinar: speaker(s) first and moderator last.'
                    }

                    return true
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description:
                      'Pick webinar people from the author profiles. The first selected people appear in the speaker row and the last selected person becomes the moderator automatically.',
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
            {
              type: 'row',
              fields: [
                {
                  name: 'featuredImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Main card and detail-page image. For webinars this is the top hero banner, so use a wide horizontal image.',
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
                  name: 'webinarSecondaryBanner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional second full-width webinar banner shown below the main hero banner. Use the same wide aspect ratio for the cleanest layout.',
                    width: '50%',
                  },
                },
                {
                  name: 'webinarSecondaryBannerAlt',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional label for the secondary banner when a second visual is used.',
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
                    description: 'Pinned white papers can be surfaced in Trending Downloads and priority rails.',
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
              name: 'leadCapture',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'whitepaper',
                description:
                  'Controls the gated white paper form, delivery mode, and post-submit behavior.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'openDeliveryInNewTab',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'deliveryMode',
                      type: 'select',
                      defaultValue: 'download',
                      options: [
                        { label: 'Download Now', value: 'download' },
                        { label: 'Read Now', value: 'read' },
                        { label: 'Redirect To URL', value: 'redirect' },
                      ],
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
                      name: 'formTitle',
                      type: 'text',
                      defaultValue: 'Access this white paper',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'submitLabel',
                      type: 'text',
                      defaultValue: 'Submit and continue',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'formDescription',
                  type: 'textarea',
                  defaultValue:
                    'Complete the form below to unlock this white paper, save your request, and continue to the configured destination.',
                },
                {
                  name: 'successMessage',
                  type: 'textarea',
                  defaultValue: 'Your request has been saved. Opening the white paper now.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'newsletterLabel',
                      type: 'text',
                      defaultValue: 'Tick this box to receive our newsletter.',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'consentLabel',
                      type: 'textarea',
                      defaultValue:
                        'By requesting this resource, you agree to our terms of use and privacy notice.',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'deliveryUrl',
                  type: 'text',
                  admin: {
                    description:
                      'Optional override destination after form submission. If empty, the white paper external URL or uploaded file is used.',
                  },
                },
              ],
            },
            {
              name: 'webinarRegistration',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'webinar',
                description:
                  'Controls webinar registration form content, event copy, moderator override, and CTA behaviour.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '25%' },
                    },
                    {
                      name: 'formTitle',
                      type: 'text',
                      defaultValue: 'Register for this webinar',
                      admin: { width: '35%' },
                    },
                    {
                      name: 'ctaLabel',
                      type: 'text',
                      defaultValue: 'Register now',
                      admin: { width: '40%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'deliveryMode',
                      type: 'select',
                      defaultValue: 'register',
                      options: [
                        { label: 'Register URL', value: 'register' },
                        { label: 'Watch Video', value: 'watch' },
                        { label: 'Download PDF', value: 'download' },
                        { label: 'Redirect URL', value: 'redirect' },
                      ],
                      admin: { width: '35%' },
                    },
                    {
                      name: 'openDeliveryInNewTab',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '20%' },
                    },
                    {
                      name: 'deliveryUrl',
                      type: 'text',
                      admin: {
                        width: '45%',
                        description:
                          'Optional override target after submission. Leave empty to use the webinar external URL or video URL.',
                      },
                    },
                  ],
                },
                {
                  name: 'formDescription',
                  type: 'textarea',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'submitLabel',
                      type: 'text',
                      defaultValue: 'Submit',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'newsletterLabel',
                      type: 'text',
                      defaultValue: 'Tick this box to receive our newsletter',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'consentLabel',
                      type: 'textarea',
                      defaultValue:
                        'By requesting this resource, you agree to our terms of use. All data is protected by our Privacy Notice.',
                      admin: { width: '34%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'successMessage',
                      type: 'textarea',
                      defaultValue: 'Your registration has been saved successfully.',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'eventDateLabel',
                      type: 'text',
                      defaultValue: 'WEDNESDAY, DECEMBER 10 - 11 AM PT, 2 PM ET',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sponsor',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'eventSummary',
                      type: 'textarea',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'agendaPoints',
                  type: 'array',
                  admin: {
                    description: 'Bullet list shown below the webinar intro text.',
                  },
                  fields: [
                    {
                      name: 'point',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'speakers',
                  type: 'array',
                  admin: {
                    condition: () => false,
                    description:
                      'Legacy speaker list. Webinar pages now use the selected authors as the speaker row and only fall back to this older field if needed.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          required: true,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'role',
                          type: 'text',
                          admin: { width: '33%' },
                        },
                        {
                          name: 'company',
                          type: 'text',
                          admin: { width: '34%' },
                        },
                      ],
                    },
                    {
                      name: 'photo',
                      type: 'upload',
                      relationTo: 'media',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'moderatorName',
                      type: 'text',
                      admin: {
                        width: '25%',
                        description: 'Optional override. If left empty and 2 or more authors are selected, the last selected author is used as moderator automatically.',
                      },
                    },
                    {
                      name: 'moderatorRole',
                      type: 'text',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'moderatorCompany',
                      type: 'text',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'moderatorPhoto',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { width: '25%' },
                    },
                  ],
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
              name: 'postTypeGuide',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: './components/admin/PostAuthoringGuide',
                    exportName: 'PostAuthoringGuide',
                  },
                },
              },
            },
            {
              name: 'postTypeTemplatePreview',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: './components/admin/PostTypeTemplatePreview',
                    exportName: 'PostTypeTemplatePreview',
                  },
                },
              },
            },
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
    afterRead: [
      async ({ doc }) => {
        if (doc?.type === 'webinar' && (!Array.isArray(doc.webinarSpeakerProfiles) || doc.webinarSpeakerProfiles.length === 0)) {
          return {
            ...doc,
            webinarSpeakerProfiles: doc.authors ?? [],
          }
        }

        return doc
      },
    ],
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

        if (nextData.type === 'webinar') {
          const selectedProfiles = Array.isArray(nextData.webinarSpeakerProfiles)
            ? nextData.webinarSpeakerProfiles
                .map((item) => {
                  if (typeof item === 'string') return item
                  if (item && typeof item === 'object' && 'id' in item) {
                    return typeof item.id === 'string' ? item.id : null
                  }
                  return null
                })
                .filter((item): item is string => Boolean(item))
            : []

          if (selectedProfiles.length) {
            nextData.authors = selectedProfiles
          }
        } else {
          nextData.webinarSpeakerProfiles = undefined
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
