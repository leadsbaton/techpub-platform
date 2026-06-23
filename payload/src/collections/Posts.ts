import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished, isAuthenticatedField } from '../access/cmsAccess'
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
  webinarPeople?: {
    person?: string | { id?: string } | null
    role?: 'speaker' | 'moderator' | 'presenter' | null
  }[] | null
  webinarSpeakerProfiles?: (string | { id?: string } | null)[] | null
}

function getRelationshipId(value: string | { id?: string } | null | undefined): string | null {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && typeof value.id === 'string') return value.id
  return null
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'primaryCategory', 'status', 'publishedAt'],
    // "View on site" link to the published page. The in-admin live-preview
    // iframe and the dedicated Preview tab were removed to keep the editor focused
    // on entering content rather than previewing it.
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
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Insight', value: 'insight' },
                    { label: 'White Paper', value: 'whitepaper' },
                    { label: 'Webinar', value: 'webinar' },
                  ],
                  admin: {
                    description:
                      'Pick the post type first — this controls which fields appear below and the public route.',
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
              // Auto-kept in sync with `type` (resolved in beforeChange) for any
              // internal reference. Hidden so editors pick the type only once,
              // via the select above.
              name: 'contentType',
              type: 'relationship',
              relationTo: 'content-types',
              admin: {
                hidden: true,
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
                    if (siblingData.type === 'insight' && (!Array.isArray(value) || value.length === 0)) {
                      return 'Insights should have at least one author.'
                    }

                    return true
                  },
                  admin: {
                    // Authors are only used for insight bylines. White papers and
                    // webinars don't need them, so the field is hidden for those.
                    condition: (_, siblingData) => siblingData?.type === 'insight',
                    description: 'Used for insight bylines.',
                    width: '50%',
                  },
                },
                {
                  name: 'webinarSpeakerProfiles',
                  label: 'Legacy Speakers',
                  type: 'relationship',
                  relationTo: 'authors',
                  hasMany: true,
                  // Optional — a webinar can be saved with no speakers. When 2+ are
                  // chosen, the last one is shown as the moderator automatically.
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description:
                      'Optional. Pick webinar people from the author profiles — speaker(s) first; if you add 2 or more, the LAST one becomes the moderator automatically. Leave empty to hide the speakers row.',
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
                    description: 'Main detail-page image. Cards can optionally use the Card Banner Image below.',
                    width: '50%',
                  },
                },
                {
                  name: 'cardBannerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional image used on home/listing/search cards. Leave empty to use the main image.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cardBannerFit',
                  type: 'select',
                  defaultValue: 'cover',
                  options: [
                    { label: 'Cover - crop to fill card', value: 'cover' },
                    { label: 'Contain - fit whole image', value: 'contain' },
                  ],
                  admin: {
                    description: 'Controls how the card banner image appears inside card rectangles.',
                    width: '50%',
                  },
                },
                {
                  name: 'cardButtonLabel',
                  type: 'text',
                  admin: {
                    description: 'Optional home/card button text. Leave empty to use Join, Download, or Read based on post type.',
                    width: '50%',
                  },
                },
                {
                  name: 'downloadAsset',
                  type: 'relationship',
                  relationTo: 'media',
                  // Gated asset: keep the download target out of public API
                  // responses so it can't be scraped before completing the
                  // lead-capture form. The whitepaper-leads POST route reads it
                  // with overrideAccess and returns the URL after submission.
                  access: {
                    read: isAuthenticatedField,
                  },
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (siblingData.type === 'whitepaper' && !value && !siblingData.externalUrl) {
                      return 'Whitepaper posts need either a download asset or an external URL.'
                    }

                    return true
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'whitepaper',
                    description:
                      'PDF to deliver after the form is submitted — upload a new file or pick one from the Media library. Use THIS for a downloadable PDF, or use the External URL field instead to redirect to any link.',
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
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional. Video/replay/registration link opened after someone registers. Leave empty to just collect registrations.',
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

                    return true
                  },
                  admin: {
                    description:
                      'Optional link opened after the form is submitted. White papers: use this instead of uploading a PDF. Webinars: optional replay/registration link.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'hideTitleOnDetail',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Hide the post title on the public detail page. The title is still used in admin, links, and metadata.',
                    width: '33%',
                  },
                },
                {
                  name: 'webinarSecondaryBanner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional second full-width webinar banner shown below the main hero banner. Use the same wide aspect ratio for the cleanest layout.',
                    width: '33%',
                  },
                },
                {
                  name: 'webinarSecondaryBannerAlt',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional label for the secondary banner when a second visual is used.',
                    width: '33%',
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
                  // Gated delivery target (highest priority in resolveDelivery).
                  // Keep it out of public API responses so it can't be scraped
                  // before the lead form is submitted; the whitepaper-leads POST
                  // route reads it with overrideAccess after capturing the lead.
                  access: {
                    read: isAuthenticatedField,
                  },
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
                      // Gated delivery target (highest priority in resolveDelivery).
                      // Hidden from public API responses; the webinar-registrations
                      // POST route reads it with overrideAccess after the lead is
                      // captured.
                      access: {
                        read: isAuthenticatedField,
                      },
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
                      admin: {
                        width: '25%',
                        description: 'Display label shown on webinar cards (e.g. "Tuesday, June 26, 11 am PT / 2 pm ET").',
                      },
                    },
                    {
                      name: 'eventStartsAt',
                      type: 'date',
                      admin: {
                        width: '25%',
                        date: {
                          pickerAppearance: 'dayAndTime',
                        },
                        description: 'Structured event date/time used to sort upcoming and past webinars.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'webinarPeople',
              label: 'Webinar People',
              type: 'array',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'webinar',
                description:
                  'Choose each webinar person and set how they should appear on the public page: Speaker, Moderator, or Presenter.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'person',
                      type: 'relationship',
                      relationTo: 'authors',
                      required: true,
                      admin: {
                        width: '60%',
                        description: 'Pick a profile from Authors.',
                      },
                    },
                    {
                      name: 'role',
                      type: 'select',
                      required: true,
                      defaultValue: 'speaker',
                      options: [
                        { label: 'Speaker', value: 'speaker' },
                        { label: 'Moderator', value: 'moderator' },
                        { label: 'Presenter', value: 'presenter' },
                      ],
                      admin: {
                        width: '40%',
                        description: 'Controls the heading shown on the webinar page.',
                      },
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
        if (
          doc?.type === 'webinar' &&
          (!Array.isArray(doc.webinarPeople) || doc.webinarPeople.length === 0) &&
          Array.isArray(doc.webinarSpeakerProfiles) &&
          doc.webinarSpeakerProfiles.length
        ) {
          return {
            ...doc,
            webinarPeople: doc.webinarSpeakerProfiles.map((person: unknown, index: number) => ({
              person,
              role:
                doc.webinarSpeakerProfiles.length > 1 && index === doc.webinarSpeakerProfiles.length - 1
                  ? 'moderator'
                  : 'speaker',
            })),
          }
        }

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

        // `type` is now chosen directly in the editor (a select), so the
        // type-conditional fields/validators react immediately on create. Keep the
        // hidden `contentType` relationship in sync — look up the content-type
        // whose key matches the chosen type — so any internal reference stays
        // populated.
        if (nextData.type) {
          const match = await req.payload.find({
            collection: 'content-types',
            where: { key: { equals: nextData.type } },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })
          const matchedId = match.docs[0]?.id
          if (matchedId) {
            nextData.contentType = matchedId
          }
        }

        if (nextData.type === 'webinar') {
          if (nextData.webinarPeople !== undefined) {
            const selectedProfiles = Array.isArray(nextData.webinarPeople)
              ? nextData.webinarPeople
                  .map((item) => getRelationshipId(item?.person))
                  .filter((item): item is string => Boolean(item))
              : []

            nextData.authors = selectedProfiles
            nextData.webinarSpeakerProfiles = selectedProfiles
          }

          // Mirror the Speakers selection into `authors` so the two stay
          // consistent. Only act when this write actually includes the field
          // (undefined = field omitted in a partial update → leave authors
          // alone); an explicit empty array clears authors too, so reducing the
          // speaker list to none can't leave a stale `authors` behind (which the
          // afterRead back-fill would otherwise resurrect).
          if (nextData.webinarPeople === undefined && nextData.webinarSpeakerProfiles !== undefined) {
            const selectedProfiles = Array.isArray(nextData.webinarSpeakerProfiles)
              ? nextData.webinarSpeakerProfiles
                  .map((item) => getRelationshipId(item))
                  .filter((item): item is string => Boolean(item))
              : []

            nextData.authors = selectedProfiles
          }
        } else {
          nextData.webinarPeople = undefined
          nextData.webinarSpeakerProfiles = undefined
        }

        if (nextData.status === 'published' && !nextData.publishedAt) {
          nextData.publishedAt = new Date().toISOString()
        }

        if (nextData.slug && typeof nextData.slug === 'string') {
          const baseSlug = nextData.slug

          // Gather any existing posts whose slug is `baseSlug` or `baseSlug-N`
          // (excluding this doc on update). `like` is a substring match, so we
          // filter precisely in code afterwards.
          const candidates = await req.payload.find({
            collection: 'posts',
            depth: 0,
            limit: 200,
            overrideAccess: true,
            pagination: false,
            where: {
              and: [
                {
                  slug: {
                    like: baseSlug,
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

          const taken = new Set(
            candidates.docs
              .map((docItem) => (docItem as { slug?: string }).slug)
              .filter((value): value is string => typeof value === 'string'),
          )

          // Deterministic: keep baseSlug if free, otherwise append the smallest
          // available -N suffix (-2, -3, ...). Same input always yields the same
          // result. The DB `unique` index remains the backstop for the rare
          // concurrent-write race.
          if (taken.has(baseSlug)) {
            let suffix = 2
            while (taken.has(`${baseSlug}-${suffix}`)) {
              suffix += 1
            }
            nextData.slug = `${baseSlug}-${suffix}`
          }
        }

        return nextData
      },
    ],
  },
}

export default Posts
