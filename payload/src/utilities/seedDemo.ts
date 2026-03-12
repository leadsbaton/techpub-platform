import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import type {
  Author,
  Category,
  Page,
  Post,
  Subscriber,
  Tag,
} from '../payload-types'

type SeededDoc = {
  id: string
}

type SeedCollection = 'content-types' | 'categories' | 'authors' | 'tags' | 'posts' | 'pages'
type RichTextSeed = NonNullable<Page['content']>
type SeedCta = Post['cta']
type SeedSubscriberData = Pick<Subscriber, 'email' | 'status'> & Partial<Subscriber>

type StoredPostData = Omit<Post, 'id' | 'updatedAt' | 'createdAt' | 'deletedAt' | 'sizes'>

type DemoSeedPost = Omit<SeedPostData, 'cta'>

type SeedPostData = {
  title: string
  slug: string
  type: 'insight' | 'whitepaper' | 'webinar'
  status: 'draft' | 'published' | 'archived'
  excerpt: string
  content: RichTextSeed
  cta: SeedCta
  primaryCategory: string
  authors: string[]
  contentType?: string
  featuredImage: string
  featured?: boolean
  pinned?: boolean
  readingTime?: number
  publishedAt?: string
  tags?: string[]
  externalUrl?: string
  videoUrl?: string
  gallery?: StoredPostData['gallery']
  relatedPosts?: string[]
  seo?: Post['seo']
}
type SeedCollectionData = {
  'content-types': {
    label: string
    key: 'insight' | 'whitepaper' | 'webinar'
    routeBase: string
    active?: boolean | null
    sortOrder?: number | null
  }
  categories: Pick<Category, 'name' | 'slug'> & Partial<Category>
  authors: Pick<Author, 'name' | 'slug'> & Partial<Author>
  tags: Pick<Tag, 'name' | 'slug'> & Partial<Tag>
  posts: SeedPostData
  pages: Pick<Page, 'title' | 'slug' | 'status' | 'template' | 'hero'> & Partial<Page>
}

type SeedContentType = {
  label: string
  key: 'insight' | 'whitepaper' | 'webinar'
  routeBase: string
  sortOrder: number
}

const contentTypes: SeedContentType[] = [
  {
    label: 'Insight',
    key: 'insight',
    routeBase: '/insights',
    sortOrder: 1,
  },
  {
    label: 'White Paper',
    key: 'whitepaper',
    routeBase: '/whitepapers',
    sortOrder: 2,
  },
  {
    label: 'Webinar',
    key: 'webinar',
    routeBase: '/webinars',
    sortOrder: 3,
  },
]

type SeedCategory = {
  name: string
  slug: string
  description: string
  color: string
}

type SeedAuthor = {
  name: string
  slug: string
  role: string
  bio: string
}

type SeedTag = {
  name: string
  slug: string
  description: string
}

type SeedSubscriber = {
  email: string
  firstName: string
  lastName: string
  status: 'subscribed' | 'unsubscribed'
  source: string
  notes: string
}

type SeedMediaAsset = {
  key: string
  alt: string
  caption: string
  credit: string
  filePath: string
}

const categories: SeedCategory[] = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Dive into cutting-edge trends, tools, and insights shaping the future of digital innovation.',
    color: '#1238D6',
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Understand market trends, risks, and opportunities driving smarter financial decisions.',
    color: '#FF2A1F',
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Explore strategies, stories, and campaigns powering high-impact brands.',
    color: '#12A639',
  },
]

const authors: SeedAuthor[] = [
  {
    name: 'LeadsBaton Editorial',
    slug: 'leadsbaton-editorial',
    role: 'Editorial Team',
    bio: 'Editorial team covering technology, finance, marketing, and digital growth topics.',
  },
  {
    name: 'Oracle Research',
    slug: 'oracle-research',
    role: 'Research Contributor',
    bio: 'Contributor focused on analytics, cloud infrastructure, and enterprise operations.',
  },
  {
    name: 'Autodesk Studio',
    slug: 'autodesk-studio',
    role: 'Industry Contributor',
    bio: 'Contributor focused on design systems, industrial tools, and manufacturing workflows.',
  },
]

const tags: SeedTag[] = [
  { name: 'AI', slug: 'ai', description: 'Artificial intelligence, models, and enterprise adoption.' },
  { name: 'Analytics', slug: 'analytics', description: 'Measurement, dashboards, BI, and reporting.' },
  { name: 'Cloud', slug: 'cloud', description: 'Cloud platforms, infrastructure, and modernization.' },
]

const mediaAssets: SeedMediaAsset[] = [
  {
    key: 'dashboard-wide',
    alt: 'Wide newsroom dashboard preview',
    caption: 'Wide editorial interface preview used in hero layouts.',
    credit: 'LeadsBaton Studio',
    filePath: path.resolve(process.cwd(), '../media/Screenshot_20260103_221259 - Copy-1440x900.jpg'),
  },
  {
    key: 'dashboard-card',
    alt: 'Editorial card layout preview',
    caption: 'Card-sized editorial image used for listing views.',
    credit: 'LeadsBaton Studio',
    filePath: path.resolve(process.cwd(), '../media/Screenshot_20260103_221259 - Copy-720x480.jpg'),
  },
  {
    key: 'dashboard-source',
    alt: 'Source dashboard screenshot',
    caption: 'Original dashboard image for supporting galleries.',
    credit: 'LeadsBaton Studio',
    filePath: path.resolve(process.cwd(), '../media/Screenshot_20260103_221259 - Copy.jpg'),
  },
]

const subscribers: SeedSubscriber[] = [
  {
    email: 'reader@leadsbaton-demo.com',
    firstName: 'Demo',
    lastName: 'Reader',
    status: 'subscribed',
    source: 'seed-demo',
    notes: 'Starter subscriber record for UI and admin verification.',
  },
  {
    email: 'marketing@leadsbaton-demo.com',
    firstName: 'Marketing',
    lastName: 'Lead',
    status: 'subscribed',
    source: 'seed-demo',
    notes: 'Starter subscriber record for newsletter verification.',
  },
]

function richTextFromParagraphs(paragraphs: string[]): RichTextSeed {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [
          {
            mode: 'normal',
            text,
            type: 'text',
            version: 1,
            detail: 0,
            format: 0,
            style: '',
          },
        ],
      })),
    },
  } as RichTextSeed
}

function buildPrimaryCta(type: 'insight' | 'whitepaper' | 'webinar'): SeedCta {
  if (type === 'whitepaper') {
    return {
      primary: {
        label: 'Download Now',
        type: 'custom',
        url: '/whitepapers',
        newTab: false,
      },
    }
  }

  if (type === 'webinar') {
    return {
      primary: {
        label: 'Register Now',
        type: 'custom',
        url: '/webinars',
        newTab: false,
      },
    }
  }

  return {
    primary: {
      label: 'Read More',
      type: 'custom',
      url: '/insights',
      newTab: false,
    },
  }
}

function ensureSeededId(label: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing seeded ${label} id`)
  }

  return value
}

function buildPageSeo(title: string, summary: string, slug: string) {
  return {
    metaTitle: `${title} | LeadsBaton`,
    metaDescription: summary,
    canonicalUrl: `https://www.leadsbaton.com/${slug}`,
  }
}

async function upsertBySlug<K extends SeedCollection>(
  payload: Payload,
  collection: K,
  slug: string,
  data: SeedCollectionData[K],
): Promise<SeededDoc> {
  const existing = await payload.find({
    collection,
    where:
      collection === 'content-types'
        ? { key: { equals: slug } }
        : { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    switch (collection) {
      case 'content-types': {
        const updated = await payload.update({
          collection: 'content-types',
          id: existing.docs[0].id,
          data: data as SeedCollectionData['content-types'],
          draft: false,
          depth: 0,
        })

        return { id: String(updated.id) }
      }
      case 'categories': {
        const updated = await payload.update({
          collection: 'categories',
          id: existing.docs[0].id,
          data: data as SeedCollectionData['categories'],
          draft: false,
          depth: 0,
        })

        return { id: String(updated.id) }
      }
      case 'authors': {
        const updated = await payload.update({
          collection: 'authors',
          id: existing.docs[0].id,
          data: data as SeedCollectionData['authors'],
          draft: false,
          depth: 0,
        })

        return { id: String(updated.id) }
      }
      case 'tags': {
        const updated = await payload.update({
          collection: 'tags',
          id: existing.docs[0].id,
          data: data as SeedCollectionData['tags'],
          draft: false,
          depth: 0,
        })

        return { id: String(updated.id) }
      }
      case 'posts': {
        const updated = await payload.update({
          collection: 'posts',
          id: existing.docs[0].id,
          data: data as unknown as StoredPostData,
          draft: false,
          depth: 0,
        })

        return { id: String(updated.id) }
      }
      case 'pages': {
        const updated = await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: data as SeedCollectionData['pages'],
          draft: false,
          depth: 0,
        })

        return { id: String(updated.id) }
      }
    }
  }

  switch (collection) {
    case 'content-types': {
      const created = await payload.create({
        collection: 'content-types',
        data: data as SeedCollectionData['content-types'],
        draft: false,
        depth: 0,
      })

      return { id: String(created.id) }
    }
    case 'categories': {
      const created = await payload.create({
        collection: 'categories',
        data: data as SeedCollectionData['categories'],
        draft: false,
        depth: 0,
      })

      return { id: String(created.id) }
    }
    case 'authors': {
      const created = await payload.create({
        collection: 'authors',
        data: data as SeedCollectionData['authors'],
        draft: false,
        depth: 0,
      })

      return { id: String(created.id) }
    }
    case 'tags': {
      const created = await payload.create({
        collection: 'tags',
        data: data as SeedCollectionData['tags'],
        draft: false,
        depth: 0,
      })

      return { id: String(created.id) }
    }
    case 'posts': {
      const created = await payload.create({
        collection: 'posts',
        data: data as unknown as StoredPostData,
        draft: false,
        depth: 0,
      })

      return { id: String(created.id) }
    }
    case 'pages': {
      const created = await payload.create({
        collection: 'pages',
        data: data as SeedCollectionData['pages'],
        draft: false,
        depth: 0,
      })

      return { id: String(created.id) }
    }
  }

  throw new Error(`Unsupported collection: ${String(collection)}`)
}

async function upsertMediaByFilePath(
  payload: Payload,
  asset: SeedMediaAsset,
): Promise<SeededDoc> {
  const filename = path.basename(asset.filePath)

  if (!fs.existsSync(asset.filePath)) {
    throw new Error(`Missing media seed file: ${asset.filePath}`)
  }

  const existing = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: {
        alt: asset.alt,
        caption: asset.caption,
        credit: asset.credit,
      },
      depth: 0,
      draft: false,
    })

    return { id: String(updated.id) }
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: asset.alt,
      caption: asset.caption,
      credit: asset.credit,
    },
    filePath: asset.filePath,
    depth: 0,
    draft: false,
  })

  return { id: String(created.id) }
}

async function upsertSubscriber(
  payload: Payload,
  email: string,
  data: SeedSubscriberData,
): Promise<SeededDoc> {
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'subscribers',
      id: existing.docs[0].id,
      data,
      draft: false,
      depth: 0,
    })

    return {
      id: String(updated.id),
    }
  }

  const created = await payload.create({
    collection: 'subscribers',
    data,
    draft: false,
    depth: 0,
  })

  return {
    id: String(created.id),
  }
}

async function deletePostsBySlugs(payload: Payload, slugs: string[]) {
  if (!slugs.length) return

  const existing = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        in: slugs,
      },
    },
    limit: slugs.length,
    depth: 0,
  })

  await Promise.all(
    existing.docs.map((doc) =>
      payload.delete({
        collection: 'posts',
        id: doc.id,
        depth: 0,
      }),
    ),
  )
}

async function deletePagesBySlugs(payload: Payload, slugs: string[]) {
  if (!slugs.length) return

  const existing = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        in: slugs,
      },
    },
    limit: slugs.length,
    depth: 0,
  })

  await Promise.all(
    existing.docs.map((doc) =>
      payload.delete({
        collection: 'pages',
        id: doc.id,
        depth: 0,
      }),
    ),
  )
}

export async function seedDemoContent(payload: Payload) {
  const seededContentTypes = await Promise.all(
    contentTypes.map((contentType) =>
      upsertBySlug(payload, 'content-types', contentType.key, {
        ...contentType,
        active: true,
      }),
    ),
  )

  const seededCategories = await Promise.all(
    categories.map((category) =>
      upsertBySlug(payload, 'categories', category.slug, {
        ...category,
        featured: true,
        seo: {
          metaTitle: `${category.name} | LeadsBaton`,
          metaDescription: category.description,
        },
      }),
    ),
  )

  const seededAuthors = await Promise.all(
    authors.map((author) =>
      upsertBySlug(payload, 'authors', author.slug, {
        ...author,
        email: `${author.slug}@example.com`,
      }),
    ),
  )

  const seededTags = await Promise.all(
    tags.map((tag) =>
      upsertBySlug(payload, 'tags', tag.slug, {
        ...tag,
      }),
    ),
  )

  const categoryId = (slug: string) =>
    ensureSeededId(`category:${slug}`, seededCategories.find((item, index) => categories[index].slug === slug)?.id)
  const contentTypeId = (key: SeedContentType['key']) =>
    ensureSeededId(`content-type:${key}`, seededContentTypes.find((item, index) => contentTypes[index].key === key)?.id)
  const authorIds = {
    editorial: ensureSeededId('author:editorial', seededAuthors[0]?.id),
    oracle: ensureSeededId('author:oracle', seededAuthors[1]?.id),
    autodesk: ensureSeededId('author:autodesk', seededAuthors[2]?.id),
  }
  const tagIdBySlug = Object.fromEntries(tags.map((tag, index) => [tag.slug, seededTags[index]?.id]).filter((entry) => Boolean(entry[1]))) as Record<string, string>
  const pickTags = (...slugs: string[]) => slugs.map((slug) => ensureSeededId(`tag:${slug}`, tagIdBySlug[slug]))

  const seededMedia = await Promise.all(mediaAssets.map((asset) => upsertMediaByFilePath(payload, asset)))
  const mediaIdByKey = Object.fromEntries(
    mediaAssets.map((asset, index) => [asset.key, seededMedia[index]?.id]).filter((entry) => Boolean(entry[1])),
  ) as Record<string, string>
  const mediaId = (key: string) => ensureSeededId(`media:${key}`, mediaIdByKey[key])

  const oldDemoPostSlugs = [
    'devices-big-and-small-can-learn',
    'what-is-causing-ai-hallucinations-with-analytics',
    'cloud-for-transforming-bottlenecks-into-breakthroughs',
    'factory-layout-designers-upgrade-guide',
    'smarter-hvac-application-guide',
    'navigating-global-trade-insights',
    'bridging-the-gap-ai-existing-systems',
    'data-architecture-for-2026',
    'trustworthy-ai-models-webinar',
    'ai-governance-playbook-2026',
    'modern-finance-stack-observability',
    'marketing-ops-pipeline-quality-benchmarks',
    'executive-ai-budgeting-checklist',
    'customer-data-platform-buyers-guide',
    'revenue-attribution-in-privacy-first-growth',
    'workflow-automation-roundtable',
    'data-contracts-live-webinar',
    'brand-measurement-qa-session',
  ]

  await deletePostsBySlugs(payload, oldDemoPostSlugs)

  const demoPosts: DemoSeedPost[] = [
    {
      slug: 'ai-governance-playbook-2026',
      title: 'AI Governance Playbook for 2026',
      type: 'insight',
      status: 'published',
      excerpt: 'A field-tested governance model for teams shipping AI features without losing reviewability, compliance, or speed.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.editorial, authorIds.oracle],
      featuredImage: mediaId('dashboard-wide'),
      featured: true,
      pinned: true,
      readingTime: 9,
      publishedAt: '2026-01-15T08:00:00.000Z',
      tags: pickTags('ai', 'analytics', 'cloud'),
      gallery: [
        { image: mediaId('dashboard-card'), caption: 'Editorial listing layout preview' },
        { image: mediaId('dashboard-source'), caption: 'Source dashboard capture' },
      ],
      content: richTextFromParagraphs([
        'Governance becomes practical when product, legal, analytics, and platform teams agree on approval boundaries before launch.',
        'The strongest operating models pair workflow checkpoints with observable datasets, model review notes, and rollback plans.',
      ]),
    },
    {
      slug: 'modern-finance-stack-observability',
      title: 'Modern Finance Stack Observability',
      type: 'insight',
      status: 'published',
      excerpt: 'Finance leaders are moving past spreadsheet-only reporting toward governed operating views that catch cost anomalies early.',
      primaryCategory: categoryId('finance'),
      authors: [authorIds.oracle],
      featuredImage: mediaId('dashboard-card'),
      readingTime: 7,
      publishedAt: '2026-01-08T08:00:00.000Z',
      tags: pickTags('analytics', 'cloud'),
      content: richTextFromParagraphs([
        'Observability in finance is not only about dashboards. It is about trustworthy definitions, reconciled systems, and fast exception handling.',
        'Teams with clear ownership around metric pipelines can close faster and make forecast conversations more reliable.',
      ]),
    },
    {
      slug: 'marketing-ops-pipeline-quality-benchmarks',
      title: 'Marketing Ops Pipeline Quality Benchmarks',
      type: 'insight',
      status: 'draft',
      excerpt: 'An in-progress benchmark piece comparing campaign pipeline quality, routing speed, and content conversion integrity.',
      primaryCategory: categoryId('marketing'),
      authors: [authorIds.editorial],
      featuredImage: mediaId('dashboard-source'),
      readingTime: 6,
      tags: pickTags('analytics'),
      content: richTextFromParagraphs([
        'Pipeline quality is shaped by lead capture design, scoring logic, taxonomy discipline, and human review loops.',
        'This draft article is meant to validate the hidden-from-public workflow in Payload and the frontend published-only queries.',
      ]),
    },
    {
      slug: 'executive-ai-budgeting-checklist',
      title: 'Executive AI Budgeting Checklist',
      type: 'whitepaper',
      status: 'published',
      excerpt: 'A downloadable planning guide for CIOs and finance teams evaluating AI infrastructure, staffing, and governance costs.',
      primaryCategory: categoryId('finance'),
      authors: [authorIds.oracle, authorIds.editorial],
      featuredImage: mediaId('dashboard-wide'),
      featured: true,
      readingTime: 10,
      publishedAt: '2026-02-02T08:00:00.000Z',
      tags: pickTags('ai', 'cloud'),
      externalUrl: 'https://example.com/downloads/executive-ai-budgeting-checklist',
      content: richTextFromParagraphs([
        'Budgeting for AI programs requires a model that covers platform operations, training data quality, change management, and regulatory review.',
        'This resource gives executive teams a structured approach to funding staged adoption instead of one-time experimentation.',
      ]),
    },
    {
      slug: 'customer-data-platform-buyers-guide',
      title: "Customer Data Platform Buyer's Guide",
      type: 'whitepaper',
      status: 'draft',
      excerpt: 'Draft buying framework for teams evaluating CDP fit, activation complexity, and integration overhead.',
      primaryCategory: categoryId('marketing'),
      authors: [authorIds.editorial],
      featuredImage: mediaId('dashboard-card'),
      readingTime: 8,
      tags: pickTags('cloud', 'analytics'),
      externalUrl: 'https://example.com/downloads/customer-data-platform-buyers-guide',
      content: richTextFromParagraphs([
        'Buying guides should clarify the operating tradeoffs between identity resolution, activation latency, privacy controls, and connector depth.',
        'This draft white paper exists to validate draft filtering, preview, and category assignment in the CMS.',
      ]),
    },
    {
      slug: 'revenue-attribution-in-privacy-first-growth',
      title: 'Revenue Attribution in Privacy-First Growth',
      type: 'whitepaper',
      status: 'archived',
      excerpt: 'An older attribution guide retained in CMS history but removed from public discovery after strategy changes.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.oracle],
      featuredImage: mediaId('dashboard-source'),
      readingTime: 11,
      publishedAt: '2025-08-14T08:00:00.000Z',
      tags: pickTags('analytics', 'ai'),
      externalUrl: 'https://example.com/downloads/revenue-attribution-in-privacy-first-growth',
      content: richTextFromParagraphs([
        'Archived resources still matter in the CMS because they preserve editorial history, but they should not continue appearing in live category feeds.',
        'This document is intentionally archived to verify that the frontend only surfaces published entries.',
      ]),
    },
    {
      slug: 'workflow-automation-roundtable',
      title: 'Workflow Automation Roundtable',
      type: 'webinar',
      status: 'published',
      excerpt: 'A recorded roundtable on workflow automation, approval routing, and cross-team operational visibility.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.editorial, authorIds.autodesk],
      featuredImage: mediaId('dashboard-wide'),
      featured: true,
      readingTime: 5,
      publishedAt: '2026-02-10T14:00:00.000Z',
      tags: pickTags('ai', 'cloud'),
      videoUrl: 'https://example.com/webinars/workflow-automation-roundtable',
      externalUrl: 'https://example.com/register/workflow-automation-roundtable',
      content: richTextFromParagraphs([
        'Roundtable sessions are useful for surfacing how workflow automation changes approval paths, reporting expectations, and ownership models.',
        'This published webinar should appear across the homepage and webinar listings after reseeding.',
      ]),
    },
    {
      slug: 'data-contracts-live-webinar',
      title: 'Data Contracts Live Webinar',
      type: 'webinar',
      status: 'draft',
      excerpt: 'A draft webinar landing page for a live session about contracts, schema ownership, and analytics reliability.',
      primaryCategory: categoryId('finance'),
      authors: [authorIds.oracle],
      featuredImage: mediaId('dashboard-card'),
      readingTime: 4,
      tags: pickTags('analytics', 'cloud'),
      videoUrl: 'https://example.com/webinars/data-contracts-live',
      externalUrl: 'https://example.com/register/data-contracts-live-webinar',
      content: richTextFromParagraphs([
        'Data contract programs reduce surprise breakage by documenting expectations between producing and consuming teams.',
        'This draft webinar page is useful for validating pre-publish review in the CMS.',
      ]),
    },
    {
      slug: 'brand-measurement-qa-session',
      title: 'Brand Measurement Q&A Session',
      type: 'webinar',
      status: 'archived',
      excerpt: 'Archived follow-up session covering brand lift, pipeline measurement, and campaign reporting alignment.',
      primaryCategory: categoryId('marketing'),
      authors: [authorIds.editorial],
      featuredImage: mediaId('dashboard-source'),
      readingTime: 4,
      publishedAt: '2025-06-19T10:30:00.000Z',
      tags: pickTags('analytics'),
      videoUrl: 'https://example.com/webinars/brand-measurement-qa-session',
      externalUrl: 'https://example.com/register/brand-measurement-qa-session',
      content: richTextFromParagraphs([
        'Archived webinar entries help test long-term CMS retention without cluttering the public site or current campaign navigation.',
        'This one remains in the admin but should stay out of public webinar queries because its status is archived.',
      ]),
    },
  ]

  const seededPosts = await Promise.all(
    demoPosts.map((post) => {
      const postData = {
        ...post,
        contentType: contentTypeId(post.type),
        cta: buildPrimaryCta(post.type),
        seo: {
          metaTitle: `${post.title} | LeadsBaton`,
          metaDescription: post.excerpt,
        },
      } as unknown as SeedCollectionData['posts']

      return upsertBySlug(payload, 'posts', post.slug, postData)
    }),
  )

  const seededPostIdBySlug = Object.fromEntries(
    demoPosts.map((post, index) => [post.slug, seededPosts[index]?.id]).filter((entry) => Boolean(entry[1])),
  ) as Record<string, string>

  await Promise.all([
    payload.update({
      collection: 'posts',
      id: ensureSeededId('post:ai-governance-playbook-2026', seededPostIdBySlug['ai-governance-playbook-2026']),
      data: {
        relatedPosts: [
          ensureSeededId('post:modern-finance-stack-observability', seededPostIdBySlug['modern-finance-stack-observability']),
          ensureSeededId('post:workflow-automation-roundtable', seededPostIdBySlug['workflow-automation-roundtable']),
        ],
      },
      depth: 0,
      draft: false,
    }),
    payload.update({
      collection: 'posts',
      id: ensureSeededId('post:executive-ai-budgeting-checklist', seededPostIdBySlug['executive-ai-budgeting-checklist']),
      data: {
        relatedPosts: [
          ensureSeededId('post:modern-finance-stack-observability', seededPostIdBySlug['modern-finance-stack-observability']),
        ],
      },
      depth: 0,
      draft: false,
    }),
    payload.update({
      collection: 'posts',
      id: ensureSeededId('post:workflow-automation-roundtable', seededPostIdBySlug['workflow-automation-roundtable']),
      data: {
        relatedPosts: [
          ensureSeededId('post:data-contracts-live-webinar', seededPostIdBySlug['data-contracts-live-webinar']),
        ],
      },
      depth: 0,
      draft: false,
    }),
  ])

  const pages = [
    {
      slug: 'contact',
      title: 'Contact',
      template: 'contact',
      status: 'published',
      hideFromNavigation: true,
      summary: 'Get in touch with LeadsBaton for editorial, partnership, or support requests.',
      hero: {
        eyebrow: 'Contact Us',
        headline: 'Let us know how we can help.',
        description: 'Reach out for editorial partnerships, support requests, or questions about downloads and webinar registration.',
        primaryAction: {
          label: 'Email Support',
          type: 'custom',
          url: 'mailto:info@leadsbaton.com',
          newTab: false,
        },
        secondaryAction: {
          label: 'Browse Insights',
          type: 'custom',
          url: '/insights',
          newTab: false,
        },
      },
      content: richTextFromParagraphs([
        'Contact our team for partnership requests, editorial questions, and support inquiries.',
        'We typically respond within one to two business days.',
        'If your question is related to a webinar registration or white paper download, include the page title and the email address used so the support team can respond faster.',
      ]),
    },
    {
      slug: 'support',
      title: 'Support',
      template: 'support',
      status: 'published',
      hideFromNavigation: true,
      summary: 'Support resources for readers, subscribers, and webinar attendees.',
      hero: {
        eyebrow: 'Support',
        headline: 'Get help with access, downloads, and webinar questions.',
        description: 'Find the fastest route for content access issues, white paper downloads, subscriber changes, and webinar support.',
        primaryAction: {
          label: 'Contact Support',
          type: 'custom',
          url: '/contact',
          newTab: false,
        },
        secondaryAction: {
          label: 'Review Legal',
          type: 'custom',
          url: '/legal',
          newTab: false,
        },
      },
      content: richTextFromParagraphs([
        'Support covers access issues, download problems, and webinar registration questions.',
        'For urgent issues, contact the support team directly via the site email address.',
        'When reporting an issue, include the content title, your browser, and what happened so the team can reproduce the problem quickly.',
      ]),
    },
    {
      slug: 'legal',
      title: 'Legal',
      template: 'legal',
      status: 'published',
      hideFromNavigation: true,
      summary: 'Legal and privacy information for LeadsBaton TechPub.',
      hero: {
        eyebrow: 'Legal',
        headline: 'Privacy, terms, and content access policies.',
        description: 'Review the legal and privacy information that governs subscriptions, content downloads, and webinar access.',
        primaryAction: {
          label: 'Contact Us',
          type: 'custom',
          url: '/contact',
          newTab: false,
        },
        secondaryAction: {
          label: 'Get Support',
          type: 'custom',
          url: '/support',
          newTab: false,
        },
      },
      content: richTextFromParagraphs([
        'This page contains privacy, terms, and compliance information related to content access and lead capture forms.',
        'Subscriber information is stored to manage newsletter preferences, content delivery, and reader support workflows.',
        'Form submissions are used to process requested resources and respond to support or partnership inquiries.',
      ]),
    },
  ] as const

  await Promise.all(
    pages.map((page) =>
      upsertBySlug(payload, 'pages', page.slug, {
        ...page,
        featuredPosts: seededPosts.slice(0, 3).map((post) => post.id),
        seo: buildPageSeo(page.title, page.summary, page.slug),
      }),
    ),
  )

  await deletePagesBySlugs(payload, ['about', 'privacy-policy', 'terms-of-use', 'editorial-policy'])

  const seededSubscribers = await Promise.all(
    subscribers.map((subscriber) =>
      upsertSubscriber(payload, subscriber.email, subscriber),
    ),
  )

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'LeadsBaton',
      siteTagline: 'We Speak Your Language',
      siteDescription: 'Publishing platform for insights, white papers, webinars, and category-led discovery.',
      contactEmail: 'info@leadsbaton.com',
      socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com/leadsbaton' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/leadsbaton' },
        { platform: 'X', url: 'https://x.com/leadsbaton' },
      ],
      headerLinks: [
        { item: { label: 'Home', type: 'custom', url: '/', newTab: false } },
        { item: { label: 'Insights', type: 'custom', url: '/insights', newTab: false } },
        { item: { label: 'White Papers', type: 'custom', url: '/whitepapers', newTab: false } },
        { item: { label: 'Webinars', type: 'custom', url: '/webinars', newTab: false } },
      ],
      footerSections: [
        {
          title: 'Learn more',
          links: [
            { item: { label: 'Insights', type: 'custom', url: '/insights', newTab: false } },
            { item: { label: 'White Papers', type: 'custom', url: '/whitepapers', newTab: false } },
            { item: { label: 'Webinars', type: 'custom', url: '/webinars', newTab: false } },
          ],
        },
        {
          title: 'Support',
          links: [
            { item: { label: 'Contact', type: 'custom', url: '/contact', newTab: false } },
            { item: { label: 'Support', type: 'custom', url: '/support', newTab: false } },
            { item: { label: 'Legal', type: 'custom', url: '/legal', newTab: false } },
          ],
        },
      ],
      newsletter: {
        enabled: true,
        title: 'Subscribe for weekly insights',
        description: 'Join the LeadsBaton audience for fresh analysis, webinars, and white papers.',
        submitLabel: 'Subscribe',
      },
      seo: {
        metaTitle: 'LeadsBaton TechPub',
        metaDescription: 'Publishing platform for insights, white papers, webinars, and category-led discovery.',
      },
    },
  })

  return {
    contentTypes: seededContentTypes.length,
    categories: seededCategories.length,
    authors: seededAuthors.length,
    tags: seededTags.length,
    posts: seededPosts.length,
    pages: pages.length,
    subscribers: seededSubscribers.length,
  }
}
