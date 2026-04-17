import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { consumeRateLimit } from '@/lib/rateLimit'
import { sendEmailJsTemplate } from '@/lib/emailjs'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 15 * 60 * 1000
const LIMIT = 8

type LeadCaptureSettings = {
  enabled?: boolean | null
  formTitle?: string | null
  formDescription?: string | null
  submitLabel?: string | null
  successMessage?: string | null
  newsletterLabel?: string | null
  consentLabel?: string | null
  deliveryMode?: 'read' | 'download' | 'redirect' | null
  deliveryUrl?: string | null
  openDeliveryInNewTab?: boolean | null
}

type WhitepaperPost = {
  id: string
  title: string
  type?: string | null
  status?: string | null
  externalUrl?: string | null
  downloadAsset?: { url?: string | null } | string | null
  leadCapture?: LeadCaptureSettings | null
}

type SiteSettingsShape = {
  contactEmail?: string | null
  leadNotificationEmails?: Array<{ email?: string | null }> | null
}

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `whitepaper-lead:${ip}`
}

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function getLeadCapture(post: WhitepaperPost): LeadCaptureSettings | null {
  if (!post.leadCapture || typeof post.leadCapture !== 'object') {
    return null
  }

  return post.leadCapture
}

function resolveDelivery(post: WhitepaperPost, leadCapture: LeadCaptureSettings | null) {
  const mode = leadCapture?.deliveryMode || 'download'
  const rawTarget =
    trimValue(leadCapture?.deliveryUrl) ||
    (typeof post.externalUrl === 'string' ? post.externalUrl.trim() : '') ||
    (typeof post.downloadAsset === 'object' && post.downloadAsset?.url
      ? post.downloadAsset.url
      : typeof post.downloadAsset === 'string'
        ? post.downloadAsset
        : '')

  if (!rawTarget) {
    return null
  }

  const url =
    rawTarget.startsWith('/')
      ? `${process.env.PAYLOAD_PUBLIC_URL || `http://localhost:${process.env.PORT || '5000'}`}${rawTarget}`
      : rawTarget

  return {
    mode,
    url,
    openInNewTab: Boolean(leadCapture?.openDeliveryInNewTab ?? true),
  }
}

export async function POST(request: NextRequest) {
  const rate = consumeRateLimit(getClientKey(request), LIMIT, WINDOW_MS)

  if (!rate.allowed) {
    return NextResponse.json(
      { message: 'Too many submission attempts. Please try again later.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload.' }, { status: 400 })
  }

  const postId = trimValue(body.postId)
  const name = trimValue(body.name)
  const email = trimValue(body.email).toLowerCase()
  const jobTitle = trimValue(body.jobTitle)
  const company = trimValue(body.company)
  const country = trimValue(body.country)
  const sourceUrl = trimValue(body.sourceUrl)
  const newsletterOptIn = Boolean(body.newsletterOptIn)
  const consentAccepted = Boolean(body.consentAccepted)

  if (!postId) {
    return NextResponse.json({ message: 'White paper reference is required.' }, { status: 400 })
  }

  if (!name || !email || !jobTitle || !company || !country) {
    return NextResponse.json(
      { message: 'Name, email, job title, company, and country are required.' },
      { status: 400 },
    )
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: 'A valid email address is required.' }, { status: 400 })
  }

  if (!consentAccepted) {
    return NextResponse.json(
      { message: 'Privacy and terms consent must be accepted before continuing.' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })
  const post = (await payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 2,
    overrideAccess: true,
  })) as WhitepaperPost

  if (!post || post.type !== 'whitepaper' || post.status !== 'published') {
    return NextResponse.json({ message: 'White paper not found.' }, { status: 404 })
  }

  const leadCapture = getLeadCapture(post)

  if (leadCapture?.enabled === false) {
    return NextResponse.json(
      { message: 'This white paper is configured for direct access and does not accept gated submissions.' },
      { status: 400 },
    )
  }

  const delivery = resolveDelivery(post, leadCapture)

  if (!delivery) {
    return NextResponse.json(
      { message: 'This white paper is missing a delivery target in the CMS.' },
      { status: 422 },
    )
  }

  await payload.create({
    collection: 'leads',
    data: {
      resourceType: 'whitepaper',
      post: post.id,
      name,
      email,
      jobTitle,
      company,
      country,
      newsletterOptIn,
      consentAccepted,
      deliveryMode: delivery.mode,
      deliveryTarget: delivery.url,
      sourceUrl,
      submittedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  if (newsletterOptIn) {
    const existingSubscriber = await payload.find({
      collection: 'subscribers',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingSubscriber.docs[0]) {
      await payload.update({
        collection: 'subscribers',
        id: existingSubscriber.docs[0].id,
        data: {
          email,
          firstName: name.split(' ')[0] || existingSubscriber.docs[0].firstName,
          lastName: name.split(' ').slice(1).join(' ') || existingSubscriber.docs[0].lastName,
          source: 'whitepaper-download',
          status: 'subscribed',
        },
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'subscribers',
        data: {
          email,
          firstName: name.split(' ')[0] || undefined,
          lastName: name.split(' ').slice(1).join(' ') || undefined,
          source: 'whitepaper-download',
          status: 'subscribed',
        },
        overrideAccess: true,
      })
    }
  }

  const settings = (await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    overrideAccess: true,
  })) as SiteSettingsShape

  const adminEmails = [
    ...(settings.leadNotificationEmails?.map((item) => item.email).filter(Boolean) || []),
    settings.contactEmail,
  ].filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index)

  await Promise.all(
    adminEmails.map((adminEmail) =>
      sendEmailJsTemplate({
        to_email: adminEmail,
        resource_title: post.title,
        lead_name: name,
        lead_email: email,
        lead_job_title: jobTitle,
        lead_company: company,
        lead_country: country,
        newsletter_opt_in: newsletterOptIn ? 'Yes' : 'No',
        submitted_at: new Date().toISOString(),
        delivery_mode: delivery.mode,
        delivery_target: delivery.url,
        source_url: sourceUrl,
      }).catch(() => ({ sent: false })),
    ),
  )

  return NextResponse.json(
    {
      message:
        leadCapture?.successMessage ||
        'Your details have been saved. Opening the white paper now.',
      delivery,
    },
    { status: 201 },
  )
}
