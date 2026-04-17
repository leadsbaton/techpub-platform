type EmailJsPayload = {
  to_email: string
  resource_title: string
  lead_name: string
  lead_email: string
  lead_job_title: string
  lead_company: string
  lead_country: string
  newsletter_opt_in: string
  submitted_at: string
  delivery_mode: string
  delivery_target: string
  source_url: string
}

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const EMAILJS_TIMEOUT_MS = 10_000

export function getEmailJsConfigStatus() {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  return {
    configured: Boolean(serviceId && templateId && publicKey && privateKey),
    serviceId,
    templateId,
    publicKey,
    privateKey,
  }
}

export async function sendEmailJsTemplate(
  templateParams: EmailJsPayload,
): Promise<{ sent: boolean; reason?: string }> {
  const { configured, serviceId, templateId, publicKey, privateKey } = getEmailJsConfigStatus()

  if (!configured || !serviceId || !templateId || !publicKey || !privateKey) {
    return { sent: false, reason: 'missing_credentials' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), EMAILJS_TIMEOUT_MS)

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      return { sent: false, reason: `emailjs_${response.status}` }
    }

    return { sent: true }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { sent: false, reason: 'emailjs_timeout' }
    }

    return { sent: false, reason: 'emailjs_request_failed' }
  } finally {
    clearTimeout(timeout)
  }
}
