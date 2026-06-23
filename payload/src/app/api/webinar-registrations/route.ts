import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { jsonWithCors, optionsWithCors } from '@/lib/cors'
import { sendEmailJsTemplate } from '@/lib/emailjs'
import { consumeRateLimit, getClientIp } from '@/lib/rateLimit'
import { createOrUpdateSubscriber } from '@/lib/subscribers'

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
  eventStartsAt?: string | null
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
  content?: unknown
  webinarRegistration?: WebinarRegistrationSettings | null
}

const webinarMonthIndexes: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

function getWebinarEventDate(label?: string | null, referenceDate = new Date()): Date | null {
  if (!label?.trim()) return null

  const match = label.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/i,
  )
  if (!match) return null

  const month = webinarMonthIndexes[match[1].toLowerCase()]
  const day = Number(match[2])
  const year = match[3] ? Number(match[3]) : referenceDate.getFullYear()
  if (month === undefined || !day || Number.isNaN(year)) return null

  const eventDate = new Date(year, month, day)
  return Number.isNaN(eventDate.getTime()) ? null : eventDate
}

function getTextFromRichTextNode(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const value = node as { text?: unknown; children?: unknown }
  const ownText = typeof value.text === 'string' ? value.text : ''
  const childText = Array.isArray(value.children)
    ? value.children.map(getTextFromRichTextNode).join(' ')
    : ''

  return `${ownText} ${childText}`.trim()
}

function getTextFromRichText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  const root = (content as { root?: unknown }).root
  if (!root || typeof root !== 'object') return ''

  const children = (root as { children?: unknown }).children
  return Array.isArray(children)
    ? children.map(getTextFromRichTextNode).join(' ').replace(/\s+/g, ' ').trim()
    : ''
}

function extractWebinarEventLabelFromContent(content: unknown): string | null {
  const text = getTextFromRichText(content)
  if (!text) return null

  const datePattern =
    /\b(?:(?:mon|tues|wednes|thurs|fri|satur|sun)day,\s*)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?(?:,\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[A-Z]{2}(?:\s*\/\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)(?:\s*[A-Z]{2})?)?)?/gi
  const labels = Array.from(text.matchAll(datePattern), (match) => match[0].trim())
  if (!labels.length) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = labels.find((label) => {
    const eventDate = getWebinarEventDate(label)
    if (!eventDate) return false
    eventDate.setHours(0, 0, 0, 0)
    return eventDate >= today
  })

  return upcoming || labels[labels.length - 1] || null
}

function isUpcomingWebinar(registration?: WebinarRegistrationSettings | null, content?: unknown, referenceDate = new Date()): boolean {
  const structuredDate = registration?.eventStartsAt ? new Date(registration.eventStartsAt) : null
  const eventDate =
    structuredDate && !Number.isNaN(structuredDate.getTime())
      ? structuredDate
      : getWebinarEventDate(
          registration?.eventDateLabel || extractWebinarEventLabelFromContent(content),
          referenceDate,
        )
  if (!eventDate) return false

  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  return eventDate >= today
}

type SiteSettingsShape = {
  contactEmail?: string | null
  leadNotificationEmails?: Array<{ email?: string | null }> | null
}

type NotificationStatus = 'pending' | 'sent' | 'partial' | 'failed' | 'skipped'

function getClientKey(request: NextRequest) {
  return `webinar-registration:${getClientIp(request)}`
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

  // `url` may be an empty string when the webinar only collects registrations
  // (no replay/redirect link configured). The frontend treats an empty url as
  // "no redirect" and just shows the success message.
  return {
    mode,
    url: rawTarget,
    openInNewTab: Boolean(post.webinarRegistration?.openDeliveryInNewTab ?? true),
  }
}

export async function POST(request: NextRequest) {
  const rate = await consumeRateLimit(getClientKey(request), LIMIT, WINDOW_MS)

  if (!rate.allowed) {
    return jsonWithCors(
      request,
      { message: 'Too many registration attempts. Please try again later.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return jsonWithCors(request, { message: 'Invalid JSON payload.' }, { status: 400 })
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
    return jsonWithCors(request, { message: 'Webinar reference is required.' }, { status: 400 })
  }

  if (!name || !email || !jobTitle || !company || !country) {
    return jsonWithCors(
      request,
      { message: 'Name, email, job title, company, and country are required.' },
      { status: 400 },
    )
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonWithCors(request, { message: 'A valid email address is required.' }, { status: 400 })
  }

  if (!consentAccepted) {
    return jsonWithCors(request, { message: 'Consent is required before registering.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const post = (await payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 2,
    overrideAccess: true,
  })) as WebinarPost

  if (!post || post.type !== 'webinar' || post.status !== 'published') {
    return jsonWithCors(request, { message: 'Webinar not found.' }, { status: 404 })
  }

  if (post.webinarRegistration?.enabled === false) {
    return jsonWithCors(
      request,
      { message: 'This webinar is configured for direct access and does not accept registrations.' },
      { status: 400 },
    )
  }

  if (!isUpcomingWebinar(post.webinarRegistration, post.content)) {
    return jsonWithCors(
      request,
      { message: 'Registration is closed for this webinar.' },
      { status: 400 },
    )
  }

  // Delivery is optional: a webinar can simply collect registrations without a
  // replay/redirect link, so `delivery` may be null.
  const delivery = resolveDelivery(post)

  // One registration per email per webinar. The same email may register for
  // OTHER webinars, but not for this same one a second time.
  const existingRegistration = await payload.find({
    collection: 'submissions',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { submissionType: { equals: 'webinar' } },
        { post: { equals: post.id } },
        { email: { equals: email } },
      ],
    },
  })

  if (existingRegistration.docs[0]) {
    return jsonWithCors(
      request,
      {
        message: 'This email is already registered for this webinar.',
        delivery,
        alreadyRegistered: true,
      },
      { status: 200 },
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
      await createOrUpdateSubscriber(payload, {
        email,
        firstName: name.split(' ')[0] || undefined,
        lastName: name.split(' ').slice(1).join(' ') || undefined,
        source: 'webinar-registration',
        status: 'subscribed',
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
        // Names matching the configured EmailJS template (template_sgg6gwp).
        form_name: post.title,
        name,
        email,
        job_title: jobTitle,
        company,
        country,
        newsletter: newsletterOptIn ? 'Yes' : 'No',
        time: new Date().toLocaleString(),
        // Legacy/extra params (ignored by templates that don't use them).
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

  return jsonWithCors(
    request,
    {
      message:
        post.webinarRegistration?.successMessage ||
        'Your registration has been saved successfully.',
      delivery,
    },
    { status: 201 },
  )
}

export function OPTIONS(request: NextRequest) {
  return optionsWithCors(request)
}
