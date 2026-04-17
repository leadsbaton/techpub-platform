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

export async function sendEmailJsTemplate(
  templateParams: EmailJsPayload,
): Promise<{ sent: boolean; reason?: string }> {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return { sent: false, reason: 'missing_credentials' }
  }

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
  })

  if (!response.ok) {
    return { sent: false, reason: `emailjs_${response.status}` }
  }

  return { sent: true }
}
