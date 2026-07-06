// Flexible template params so callers can match whatever variable names the
// configured EmailJS template expects (e.g. `name`, `email`, `job_title`).
type EmailJsPayload = Record<string, string>

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const EMAILJS_TIMEOUT_MS = 10_000

export function getEmailJsConfigStatus() {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  return {
    configured: Boolean(serviceId && templateId && publicKey),
    serviceId,
    templateId,
    publicKey,
    privateKey,
  }
}

export async function sendEmailJsTemplate(
  templateParams: EmailJsPayload,
  templateIdOverride?: string,
): Promise<{ sent: boolean; reason?: string }> {
  const { configured, serviceId, templateId, publicKey, privateKey } = getEmailJsConfigStatus()
  const effectiveTemplateId = templateIdOverride || templateId

  if (!configured || !serviceId || !effectiveTemplateId || !publicKey) {
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
        template_id: effectiveTemplateId,
        user_id: publicKey,
        ...(privateKey ? { accessToken: privateKey } : {}),
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
