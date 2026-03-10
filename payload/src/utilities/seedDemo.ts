import type { Payload } from 'payload'

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

function richTextFromParagraphs(paragraphs: string[]) {
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
  }
}

async function upsertBySlug<T extends { id: string }>(
  payload: Payload,
  collection: 'categories' | 'authors' | 'tags' | 'posts' | 'pages',
  slug: string,
  data: Record<string, unknown>,
): Promise<T> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      data,
      depth: 0,
    }) as Promise<T>
  }

  return payload.create({
    collection,
    data,
    depth: 0,
  }) as Promise<T>
}

export async function seedDemoContent(payload: Payload) {
  const seededCategories = await Promise.all(
    categories.map((category) =>
      upsertBySlug<{ id: string }>(payload, 'categories', category.slug, {
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
      upsertBySlug<{ id: string }>(payload, 'authors', author.slug, {
        ...author,
        email: `${author.slug}@example.com`,
      }),
    ),
  )

  const seededTags = await Promise.all(
    tags.map((tag) =>
      upsertBySlug<{ id: string }>(payload, 'tags', tag.slug, {
        ...tag,
      }),
    ),
  )

  const categoryId = (slug: string) => seededCategories.find((item, index) => categories[index].slug === slug)?.id
  const authorIds = {
    editorial: seededAuthors[0]?.id,
    oracle: seededAuthors[1]?.id,
    autodesk: seededAuthors[2]?.id,
  }
  const tagIds = seededTags.map((tag) => tag.id)

  const demoPosts = [
    {
      slug: 'devices-big-and-small-can-learn',
      title: 'Devices Big and Small Can Learn What We Need Them to Learn',
      type: 'insight',
      excerpt: 'How organizations are using connected systems, analytics, and governance to create more adaptive digital experiences.',
      primaryCategory: categoryId('technology'),
      authors: [authorIds.editorial].filter(Boolean),
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
      authors: [authorIds.oracle].filter(Boolean),
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
      authors: [authorIds.editorial].filter(Boolean),
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
      authors: [authorIds.autodesk].filter(Boolean),
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
      authors: [authorIds.oracle].filter(Boolean),
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
      authors: [authorIds.oracle].filter(Boolean),
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
      authors: [authorIds.editorial].filter(Boolean),
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
      authors: [authorIds.oracle].filter(Boolean),
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
      authors: [authorIds.editorial].filter(Boolean),
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
  ] as const

  const seededPosts = await Promise.all(
    demoPosts.map((post) =>
      upsertBySlug<{ id: string }>(payload, 'posts', post.slug, {
        ...post,
        status: 'published',
        categories: post.primaryCategory ? [post.primaryCategory] : [],
        seo: {
          metaTitle: `${post.title} | LeadsBaton`,
          metaDescription: post.excerpt,
        },
      }),
    ),
  )

  const pages = [
    {
      slug: 'contact',
      title: 'Contact',
      template: 'contact',
      status: 'published',
      summary: 'Get in touch with LeadsBaton for editorial, partnership, or support requests.',
      content: richTextFromParagraphs([
        'Contact our team for partnership requests, editorial questions, and support inquiries.',
        'We typically respond within one to two business days.',
      ]),
    },
    {
      slug: 'support',
      title: 'Support',
      template: 'standard',
      status: 'published',
      summary: 'Support resources for readers, subscribers, and webinar attendees.',
      content: richTextFromParagraphs([
        'Support covers access issues, download problems, and webinar registration questions.',
        'For urgent issues, contact the support team directly via the site email address.',
      ]),
    },
    {
      slug: 'legal',
      title: 'Legal',
      template: 'legal',
      status: 'published',
      summary: 'Legal and privacy information for LeadsBaton TechPub.',
      content: richTextFromParagraphs([
        'This page contains privacy, terms, and compliance information related to content access and lead capture forms.',
      ]),
    },
  ] as const

  await Promise.all(
    pages.map((page) =>
      upsertBySlug<{ id: string }>(payload, 'pages', page.slug, {
        ...page,
        featuredPosts: seededPosts.slice(0, 3).map((post) => post.id),
      }),
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
    categories: seededCategories.length,
    authors: seededAuthors.length,
    tags: seededTags.length,
    posts: seededPosts.length,
    pages: pages.length,
  }
}
