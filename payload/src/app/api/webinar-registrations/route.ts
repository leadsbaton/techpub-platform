import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { sendEmailJsTemplate } from '@/lib/emailjs'
import { consumeRateLimit } from '@/lib/rateLimit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 15 * 60 * 1000
const LIMIT = 8

type WebinarRegistrationSettings = {
  enabled?: boolean | null
  formTitle?: string | null
  formDescription?: string | null
  submitLabel?: string | null
  successMessage?: string | null
  newsletterLabel?: string | null
  consentLabel?: string | null
  ctaLabel?: string | null
  deliveryMode?: 'register' | 'watch' | 'download' | 'redirect' | null
  deliveryUrl?: string | null
  openDeliveryInNewTab?: boolean | null
  sponsor?: string | null
  eventDateLabel?: string | null
  eventSummary?: string | null
  agendaPoints?: Array<{ point?: string | null }> | null
  speakers?: Array<{
    name?: string | null
    role?: string | null
    company?: string | null
    photo?: unknown
  }> | null
  moderatorName?: string | null
  moderatorRole?: string | null
  moderatorCompany?: string | null
  moderatorPhoto?: unknown
}

type WebinarPost = {
  id: string
  title: string
  type?: string | null
  status?: string | null
  externalUrl?: string | null
  videoUrl?: string | null
  webinarRegistration?: WebinarRegistrationSettings | null
}

type SiteSettingsShape = {
  contactEmail?: string | null
  leadNotificationEmails?: Array<{ email?: string | null }> | null
}

type NotificationStatus = 'pending' | 'sent' | 'partial' | 'failed' | 'skipped'

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `webinar-registration:${ip}`
}

function trimValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function resolveDelivery(post: WebinarPost) {
  const mode =
    post.webinarRegistration?.deliveryMode ||
    (post.videoUrl ? 'watch' : 'register')
  const rawTarget =
    trimValue(post.webinarRegistration?.deliveryUrl) ||
    trimValue(post.externalUrl) ||
    trimValue(post.videoUrl)

  if (!rawTarget) {
    return null
  }

  return {
    mode,
    url: rawTarget,
    openInNewTab: Boolean(post.webinarRegistration?.openDeliveryInNewTab ?? true),
  }
}

export async function POST(request: NextRequest) {
  const rate = consumeRateLimit(getClientKey(request), LIMIT, WINDOW_MS)

  if (!rate.allowed) {
    return NextResponse.json(
      { message: 'Too many registration attempts. Please try again later.' },
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
    return NextResponse.json({ message: 'Webinar reference is required.' }, { status: 400 })
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
    return NextResponse.json({ message: 'Consent is required before registering.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const post = (await payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 2,
    overrideAccess: true,
  })) as WebinarPost

  if (!post || post.type !== 'webinar' || post.status !== 'published') {
    return NextResponse.json({ message: 'Webinar not found.' }, { status: 404 })
  }

  if (post.webinarRegistration?.enabled === false) {
    return NextResponse.json(
      { message: 'This webinar is configured for direct access and does not accept registrations.' },
      { status: 400 },
    )
  }

  const delivery = resolveDelivery(post)

  if (!delivery) {
    return NextResponse.json(
      { message: 'This webinar is missing a delivery target in the CMS.' },
      { status: 422 },
    )
  }

  const submissionRecord = await payload.create({
    collection: 'submissions',
    data: {
      submissionType: 'webinar',
      post: post.id,
      name,
      email,
      jobTitle,
      company,
      country,
      newsletterOptIn,
      consentAccepted,
      sourceUrl,
      submittedAt: new Date().toISOString(),
      deliveryMode: delivery.mode,
      deliveryTarget: delivery.url,
      notificationStatus: 'pending',
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
          source: 'webinar-registration',
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
          source: 'webinar-registration',
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

  const notificationResults = await Promise.all(
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
      })
        .then((result) => ({ adminEmail, ...result }))
        .catch(() => ({ adminEmail, sent: false, reason: 'emailjs_request_failed' })),
    ),
  )

  const sentCount = notificationResults.filter((result) => result.sent).length
  let notificationStatus: NotificationStatus = 'skipped'

  if (adminEmails.length > 0) {
    if (sentCount === adminEmails.length) {
      notificationStatus = 'sent'
    } else if (sentCount > 0) {
      notificationStatus = 'partial'
    } else {
      notificationStatus = 'failed'
    }
  }

  await payload.update({
    collection: 'submissions',
    id: submissionRecord.id,
    data: {
      notificationStatus,
      notificationRecipients: adminEmails.join(', '),
      notificationError: notificationResults
        .filter((result) => !result.sent)
        .map((result) => `${result.adminEmail}: ${result.reason || 'unknown_error'}`)
        .join('\n'),
    },
    overrideAccess: true,
  })

  return NextResponse.json(
    {
      message:
        post.webinarRegistration?.successMessage ||
        'Your registration has been saved successfully.',
      delivery,
    },
    { status: 201 },
  )
}
