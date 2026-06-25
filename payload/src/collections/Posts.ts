import { ValidationError, type CollectionConfig } from 'payload'

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
  useContentSections?: boolean | null
  webinarEventStartsAt?: string | null
  webinarSessionStatus?: 'upcoming' | 'past' | 'unscheduled' | null
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

function getWebinarSessionStatus(eventStartsAt?: string | null): 'upcoming' | 'past' | 'unscheduled' {
  if (!eventStartsAt) return 'unscheduled'
  const eventDate = new Date(eventStartsAt)
  if (Number.isNaN(eventDate.getTime())) return 'unscheduled'
  return eventDate.getTime() >= Date.now() ? 'upcoming' : 'past'
}

function getEventStartsAt(data?: PostFormData, originalDoc?: PostDocument): string | null {
  return data?.webinarRegistration?.eventStartsAt ?? originalDoc?.webinarRegistration?.eventStartsAt ?? null
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'webinarSessionStatus', 'webinarEventStartsAt', 'primaryCategory', 'status', 'publishedAt'],
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

            // ─── 1. Type & Status ──────────────────────────────────────────────
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
                    description: 'Pick the post type first — controls which fields appear below and the public URL.',
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
                    description: 'Draft is hidden from the public site. Published is live. Archived is stored but excluded from queries.',
                    width: '50%',
                  },
                },
              ],
            },
            // Hidden — kept in sync with `type` by the beforeChange hook.
            {
              name: 'contentType',
              type: 'relationship',
              relationTo: 'content-types',
              admin: { hidden: true },
            },

            // ─── 2. Title & Reading Time ───────────────────────────────────────
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Public headline — shown in cards, SEO title, and the detail page.',
                    width: '75%',
                  },
                },
                {
                  name: 'readingTime',
                  type: 'number',
                  admin: {
                    description: 'Read time (min)',
                    width: '25%',
                  },
                },
              ],
            },

            // ─── 3. Slug & Publish Date ────────────────────────────────────────
            {
              type: 'row',
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  hooks: {
                    beforeValidate: [slugHook('title')],
                  },
                  admin: {
                    description: 'URL segment — auto-generated from title. Change only if you need a custom URL.',
                    width: '60%',
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
                    description: 'Required when publishing. Auto-set to now on first publish.',
                    date: { pickerAppearance: 'dayAndTime' },
                    width: '40%',
                  },
                },
              ],
            },

            // ─── 4. Category & Authors ─────────────────────────────────────────
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryCategory',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  admin: {
                    description: 'Main taxonomy used in UI filters (Finance, Marketing, Technology…).',
                    width: '50%',
                  },
                },
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
                    condition: (_, siblingData) => siblingData?.type === 'insight',
                    description: 'Insight byline authors.',
                    width: '50%',
                  },
                },
              ],
            },

            // ─── 5. Excerpt ────────────────────────────────────────────────────
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short summary shown on listing pages, hero cards, and search results.',
              },
            },

            // ─── 6. Content (single block or sections) ─────────────────────────
            {
              name: 'useContentSections',
              type: 'checkbox',
              label: 'Use multiple Content Sections (instead of a single content block)',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'webinar',
                description: 'ON → build with up to 5 sections, each with its own rich text and speakers. OFF → use the single content field below.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.type !== 'webinar' || !siblingData?.useContentSections,
              },
            },

            // ─── 7. Webinar People ────────────────────────────────────────────────
            {
              name: 'webinarPeople',
              label: 'Webinar People',
              type: 'array',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'webinar',
                description: 'Speakers, moderators, and presenters — shown on cards and the public page. Also used in the single-content view below.',
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
                        description: 'Controls the label shown on the webinar page.',
                      },
                    },
                  ],
                },
              ],
            },

            // ─── 8. Content Sections ──────────────────────────────────────────────
            {
              name: 'webinarSections',
              label: 'Content Sections',
              type: 'array',
              maxRows: 5,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'webinar',
                description: 'Up to 5 sections — each with its own rich text and people, separated by a divider on the public page. Only active when the toggle above is ON.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'content',
                  label: 'Section Content',
                  type: 'richText',
                },
                {
                  name: 'people',
                  label: 'Section People',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'person',
                          type: 'relationship',
                          relationTo: 'authors',
                          required: true,
                          admin: { width: '60%' },
                        },
                        {
                          name: 'role',
                          type: 'select',
                          required: true,
                          defaultValue: 'presenter',
                          options: [
                            { label: 'Speaker', value: 'speaker' },
                            { label: 'Moderator', value: 'moderator' },
                            { label: 'Presenter', value: 'presenter' },
                          ],
                          admin: { width: '40%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            // ─── 9. Images — Top Banner · Card Banner · Secondary Banner ────────
            {
              type: 'row',
              fields: [
                {
                  name: 'featuredImage',
                  label: 'Top Banner',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Main detail-page image.',
                    width: '33%',
                  },
                },
                {
                  name: 'cardBannerImage',
                  label: 'Card Banner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional — used on cards. Falls back to Top Banner if empty.',
                    width: '33%',
                  },
                },
                {
                  name: 'webinarSecondaryBanner',
                  label: 'Secondary Banner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Optional second full-width banner shown below the main image on the webinar page.',
                    width: '34%',
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
                    { label: 'Cover — crop to fill card', value: 'cover' },
                    { label: 'Contain — fit whole image', value: 'contain' },
                  ],
                  admin: {
                    description: 'Card Banner display mode.',
                    width: '34%',
                  },
                },
                {
                  name: 'cardButtonLabel',
                  type: 'text',
                  admin: {
                    description: 'Card button text. Leave empty for auto (Join / Download / Read).',
                    width: '33%',
                  },
                },
                {
                  name: 'webinarSecondaryBannerAlt',
                  label: 'Secondary Banner Alt Text',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Accessibility label for the secondary banner.',
                    width: '33%',
                  },
                },
              ],
            },

            // ─── 10. Assets & Links ────────────────────────────────────────────
            {
              type: 'row',
              fields: [
                {
                  name: 'downloadAsset',
                  label: 'PDF Asset',
                  type: 'relationship',
                  relationTo: 'media',
                  access: { read: isAuthenticatedField },
                  validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                    if (siblingData.type === 'whitepaper' && !value && !siblingData.externalUrl) {
                      return 'White papers need either a PDF asset or an External URL.'
                    }
                    return true
                  },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'whitepaper',
                    description: 'PDF delivered after lead form. Use this OR the External URL below.',
                    width: '50%',
                  },
                },
                {
                  name: 'videoUrl',
                  label: 'Video / Replay URL',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'webinar',
                    description: 'Video or replay link — opened after a successful registration.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'externalUrl',
              label: 'External URL',
              type: 'text',
              validate: (value: unknown, { siblingData }: { siblingData: PostFormData }) => {
                if (siblingData.type === 'whitepaper' && !value && !siblingData.downloadAsset) {
                  return 'White papers need either an External URL or a PDF asset.'
                }
                return true
              },
              admin: {
                description: 'External destination. White paper: redirect instead of uploading PDF. Webinar: optional additional link.',
              },
            },

            // ─── 11. Flags ─────────────────────────────────────────────────────
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'pinned',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Pin to Trending / priority rails.',
                    width: '33%',
                  },
                },
                {
                  name: 'hideTitleOnDetail',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Hide the title on the public detail page (still used in admin & metadata).',
                    width: '34%',
                  },
                },
              ],
            },

            // ─── 12. White Paper: Lead Capture ─────────────────────────────────
            {
              name: 'leadCapture',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'whitepaper',
                description: 'Controls the gated white paper form and post-submit delivery.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      label: 'Lead Form Enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '20%' },
                    },
                    {
                      name: 'openDeliveryInNewTab',
                      label: 'Open in New Tab',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '20%' },
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
                      admin: { width: '60%' },
                    },
                  ],
                },
                {
                  name: 'deliveryUrl',
                  label: 'Delivery URL Override',
                  type: 'text',
                  access: { read: isAuthenticatedField },
                  admin: {
                    description: 'Optional URL opened after form submission. Overrides the PDF asset / external URL if set.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'formTitle',
                      type: 'text',
                      defaultValue: 'Access this white paper',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'submitLabel',
                      type: 'text',
                      defaultValue: 'Submit and continue',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'formDescription',
                  type: 'textarea',
                  defaultValue: 'Complete the form below to unlock this white paper.',
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
                      admin: { width: '50%' },
                    },
                    {
                      name: 'consentLabel',
                      type: 'textarea',
                      defaultValue: 'By requesting this resource, you agree to our terms of use and privacy notice.',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },

            // ─── 13. Webinar: Registration ─────────────────────────────────────
            {
              name: 'webinarRegistration',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'webinar',
                description: 'Event scheduling, registration form copy, and post-submit delivery.',
              },
              fields: [
                // Event date always at the top — required for all webinars
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'eventStartsAt',
                      label: 'Event Date & Time',
                      type: 'date',
                      validate: (value: unknown, { data }: { data?: PostFormData }) => {
                        if (data?.type === 'webinar' && !value) {
                          return 'Event date/time is required for webinars.'
                        }
                        return true
                      },
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayAndTime' },
                        description: 'Required. Determines upcoming vs past status automatically.',
                      },
                    },
                    {
                      name: 'eventDateLabel',
                      label: 'Display Date Label',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Human-readable label shown on cards — e.g. "Tuesday, June 26 · 11 am PT / 2 pm ET".',
                      },
                    },
                  ],
                },
                // Registration toggle & CTA
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      label: 'Registration Enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '20%' },
                    },
                    {
                      name: 'ctaLabel',
                      label: 'CTA Button',
                      type: 'text',
                      defaultValue: 'Register now',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'formTitle',
                      label: 'Form Heading',
                      type: 'text',
                      defaultValue: 'Register for this webinar',
                      admin: { width: '50%' },
                    },
                  ],
                },
                // Delivery
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'deliveryMode',
                      type: 'select',
                      defaultValue: 'register',
                      options: [
                        { label: 'Register Only (no link)', value: 'register' },
                        { label: 'Watch Video', value: 'watch' },
                        { label: 'Download PDF', value: 'download' },
                        { label: 'Redirect URL', value: 'redirect' },
                      ],
                      admin: { width: '35%' },
                    },
                    {
                      name: 'openDeliveryInNewTab',
                      label: 'Open in New Tab',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: { width: '15%' },
                    },
                    {
                      name: 'deliveryUrl',
                      label: 'Delivery URL Override',
                      type: 'text',
                      access: { read: isAuthenticatedField },
                      admin: {
                        width: '50%',
                        description: 'URL opened after submission. Leave empty to use the Video URL or External URL above.',
                      },
                    },
                  ],
                },
                {
                  name: 'formDescription',
                  label: 'Form Description',
                  type: 'textarea',
                },
                {
                  name: 'successMessage',
                  label: 'Success Message',
                  type: 'textarea',
                  defaultValue: 'Your registration has been saved successfully.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'submitLabel',
                      label: 'Submit Button',
                      type: 'text',
                      defaultValue: 'Submit',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'newsletterLabel',
                      label: 'Newsletter Checkbox',
                      type: 'text',
                      defaultValue: 'Tick this box to receive our newsletter',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'consentLabel',
                      label: 'Consent Text',
                      type: 'textarea',
                      defaultValue: 'By requesting this resource, you agree to our terms of use. All data is protected by our Privacy Notice.',
                      admin: { width: '34%' },
                    },
                  ],
                },
              ],
            },

            // ─── 14. Discovery ─────────────────────────────────────────────────
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
                description: 'Optional related content shown near this post.',
              },
            },

            // ─── Legacy (hidden — afterRead hook uses this for back-compat) ─────
            {
              name: 'webinarSpeakerProfiles',
              label: 'Legacy Speakers',
              type: 'relationship',
              relationTo: 'authors',
              hasMany: true,
              admin: { hidden: true },
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

    // ─── Sidebar (read-only mirrors for admin list view) ──────────────────────
    {
      name: 'webinarEventStartsAt',
      label: 'Webinar Event Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Mirrors the event date for admin list filtering and sorting.',
      },
    },
    {
      name: 'webinarSessionStatus',
      label: 'Webinar Session',
      type: 'select',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Past', value: 'past' },
        { label: 'Unscheduled', value: 'unscheduled' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Mirrors upcoming/past state for admin list filtering.',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc, req }) => {
        const nextData = data as PostFormData | undefined
        const currentDoc = originalDoc as PostDocument | undefined
        const postType = nextData?.type ?? currentDoc?.type

        if (postType === 'webinar' && !getEventStartsAt(nextData, currentDoc)) {
          throw new ValidationError({
            collection: 'posts',
            errors: [
              {
                path: 'webinarRegistration.eventStartsAt',
                message: 'Event date/time is required for webinars.',
              },
            ],
            id: currentDoc?.id,
            req,
          })
        }

        return data
      },
    ],
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

          if (nextData.webinarPeople === undefined && nextData.webinarSpeakerProfiles !== undefined) {
            const selectedProfiles = Array.isArray(nextData.webinarSpeakerProfiles)
              ? nextData.webinarSpeakerProfiles
                  .map((item) => getRelationshipId(item))
                  .filter((item): item is string => Boolean(item))
              : []

            nextData.authors = selectedProfiles
          }

          const eventStartsAt =
            nextData.webinarRegistration?.eventStartsAt ??
            (originalDoc as PostDocument | undefined)?.webinarRegistration?.eventStartsAt ??
            null
          nextData.webinarEventStartsAt = eventStartsAt
          nextData.webinarSessionStatus = getWebinarSessionStatus(eventStartsAt)
        } else {
          nextData.webinarPeople = undefined
          nextData.webinarSpeakerProfiles = undefined
          nextData.webinarEventStartsAt = null
          nextData.webinarSessionStatus = null
        }

        if (nextData.status === 'published' && !nextData.publishedAt) {
          nextData.publishedAt = new Date().toISOString()
        }

        if (nextData.slug && typeof nextData.slug === 'string') {
          const baseSlug = nextData.slug

          const candidates = await req.payload.find({
            collection: 'posts',
            depth: 0,
            limit: 200,
            overrideAccess: true,
            pagination: false,
            where: {
              and: [
                { slug: { like: baseSlug } },
                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
              ],
            },
          })

          const taken = new Set(
            candidates.docs
              .map((docItem) => (docItem as { slug?: string }).slug)
              .filter((value): value is string => typeof value === 'string'),
          )

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
