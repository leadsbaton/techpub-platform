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

type DemoSeedPost = Omit<SeedPostData, 'cta' | 'status'>

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
  featured?: boolean
  pinned?: boolean
  readingTime?: number
  publishedAt?: string
  tags?: string[]
  externalUrl?: string
  videoUrl?: string
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
  const tagIds = seededTags.map((tag) => tag.id)

  const demoPosts: DemoSeedPost[] = [
    {
      slug: 'devices-big-and-small-can-learn',
      title: 'Devices Big and Small Can Learn What We Need Them to Learn',
      type: 'insight',
      excerpt: 'How organizations are using connected systems, analytics, and governance to create more adaptive digital experiences.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.editorial],
      featured: true,
      readingTime: 6,
      publishedAt: '2025-12-24T08:00:00.000Z',
      tags: tagIds,
      content: richTextFromParagraphs([
        'Organizations are redesigning workflows around connected devices, data feedback loops, and AI-assisted decision-making.',
        'The biggest gains come from pairing modern tooling with clear governance, operational alignment, and measurable business outcomes.',
      ]),
    },
    {
      slug: 'what-is-causing-ai-hallucinations-with-analytics',
      title: 'What Is Causing AI Hallucinations With Analytics?',
      type: 'insight',
      excerpt: 'A practical look at why analytical systems drift from reality and how live enterprise data changes the outcome.',
      primaryCategory: categoryId('finance'),
      authors: [authorIds.oracle],
      featured: false,
      readingTime: 7,
      publishedAt: '2025-09-30T08:00:00.000Z',
      tags: tagIds,
      content: richTextFromParagraphs([
        'AI hallucinations in analytics occur when models generate confident but fabricated answers because they lack access to trusted live data.',
        'Teams reduce risk by grounding prompts in governed systems, auditable sources, and workflow-aware business rules.',
      ]),
    },
    {
      slug: 'cloud-for-transforming-bottlenecks-into-breakthroughs',
      title: 'Cloud For Transforming Bottlenecks Into Breakthroughs',
      type: 'insight',
      excerpt: 'Why cloud-first modernization is helping teams move faster across analytics, data operations, and customer delivery.',
      primaryCategory: categoryId('marketing'),
      authors: [authorIds.editorial],
      featured: false,
      readingTime: 5,
      publishedAt: '2025-11-24T08:00:00.000Z',
      tags: tagIds,
      content: richTextFromParagraphs([
        'Cloud operating models help reduce bottlenecks in cross-functional teams by making infrastructure, data, and reporting easier to share.',
        'The result is better iteration speed, clearer measurement, and stronger coordination between product, sales, and marketing teams.',
      ]),
    },
    {
      slug: 'factory-layout-designers-upgrade-guide',
      title: 'Top Reasons Factory Layout Designers Upgrade From AutoCAD To The Product Design & Manufacturing Collection',
      type: 'whitepaper',
      excerpt: 'A practical resource for industrial teams modernizing workflows, design collaboration, and manufacturing planning.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.autodesk],
      featured: false,
      readingTime: 8,
      publishedAt: '2025-09-30T08:00:00.000Z',
      tags: tagIds,
      externalUrl: '/whitepapers/factory-layout-designers-upgrade-guide',
      content: richTextFromParagraphs([
        'Manufacturing teams are consolidating toolchains to shorten review cycles, reduce rework, and improve handoff quality.',
        'This guide outlines where unified collections improve layout design, design collaboration, and production readiness.',
      ]),
    },
    {
      slug: 'smarter-hvac-application-guide',
      title: 'Get The Application Guide: Controls And Communication In Commercial Buildings',
      type: 'whitepaper',
      excerpt: 'A white paper on control systems, communications, and smarter building operations.',
      primaryCategory: categoryId('finance'),
      authors: [authorIds.oracle],
      featured: false,
      readingTime: 8,
      publishedAt: '2025-09-30T08:00:00.000Z',
      tags: tagIds,
      externalUrl: '/whitepapers/smarter-hvac-application-guide',
      content: richTextFromParagraphs([
        'Modern building operations depend on visibility across devices, controls, and communication layers.',
        'This guide explains the operating model behind resilient commercial building infrastructure and better decision-making.',
      ]),
    },
    {
      slug: 'navigating-global-trade-insights',
      title: 'Navigating Global Trade: 3 Insights For Leaders',
      type: 'whitepaper',
      excerpt: 'A resource for operations, finance, and HR leaders navigating fast-changing trade and supply chain pressures.',
      primaryCategory: categoryId('marketing'),
      authors: [authorIds.oracle],
      featured: false,
      readingTime: 9,
      publishedAt: '2025-09-30T08:00:00.000Z',
      tags: tagIds,
      externalUrl: '/whitepapers/navigating-global-trade-insights',
      content: richTextFromParagraphs([
        'Leaders are being forced to rethink planning models as regulation, logistics, and customer expectations continue to shift.',
        'This report highlights three strategic lenses to help teams adapt with greater operational confidence.',
      ]),
    },
    {
      slug: 'bridging-the-gap-ai-existing-systems',
      title: 'Bridging the Gap: Integrating AI into Existing Systems and Workflows',
      type: 'webinar',
      excerpt: 'A webinar on integrating AI into legacy systems, workflow design, and organizational adoption.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.editorial],
      featured: false,
      readingTime: 4,
      publishedAt: '2025-12-10T08:00:00.000Z',
      videoUrl: 'https://example.com/webinars/bridging-the-gap',
      externalUrl: '/webinars/bridging-the-gap-ai-existing-systems',
      tags: tagIds,
      content: richTextFromParagraphs([
        'This session explores where AI creates practical value in existing systems, and where adoption typically fails.',
        'Topics include governance, workflow design, trust, and how to align AI initiatives with operational teams.',
      ]),
    },
    {
      slug: 'data-architecture-for-2026',
      title: "What's Ahead in Data Architecture for 2026",
      type: 'webinar',
      excerpt: 'Upcoming webinar covering data architecture priorities, platform choices, and scale readiness.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.oracle],
      featured: false,
      readingTime: 4,
      publishedAt: '2025-12-04T08:00:00.000Z',
      videoUrl: 'https://example.com/webinars/data-architecture-2026',
      externalUrl: '/webinars/data-architecture-for-2026',
      tags: tagIds,
      content: richTextFromParagraphs([
        'Teams planning for 2026 are balancing modernization with cost control, compliance, and delivery speed.',
        'This webinar outlines the architectures and operating patterns leaders should evaluate next.',
      ]),
    },
    {
      slug: 'trustworthy-ai-models-webinar',
      title: 'Explainability and Interpretability: Building Trustworthy AI Models',
      type: 'webinar',
      excerpt: 'A webinar focused on explainability, trust, and operational accountability in AI systems.',
      primaryCategory: categoryId('marketing'),
      authors: [authorIds.editorial],
      featured: false,
      readingTime: 4,
      publishedAt: '2025-07-09T08:00:00.000Z',
      videoUrl: 'https://example.com/webinars/trustworthy-ai-models',
      externalUrl: '/webinars/trustworthy-ai-models-webinar',
      tags: tagIds,
      content: richTextFromParagraphs([
        'Trust in AI systems depends on transparency, explainability, and operational safeguards that make outputs reviewable.',
        'This session covers the organizational and technical patterns behind responsible deployment.',
      ]),
    },
  ]

  const seededPosts = await Promise.all(
    demoPosts.map((post) => {
      const postData = {
        ...post,
        contentType: contentTypeId(post.type),
        status: 'published',
        cta: buildPrimaryCta(post.type),
        seo: {
          metaTitle: `${post.title} | LeadsBaton`,
          metaDescription: post.excerpt,
        },
      } as unknown as SeedCollectionData['posts']

      return upsertBySlug(payload, 'posts', post.slug, postData)
    }),
  )

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
