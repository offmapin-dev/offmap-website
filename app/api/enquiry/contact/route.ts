import { Resend } from 'resend'
import { contactEnquirySchema } from '@/lib/schemas/contact-enquiry'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = contactEnquirySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const apiKey = process.env.RESEND_API_KEY
  // Use verified domain in production; Resend onboarding address works for dev testing.
  const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Destination: ${data.destination}`,
    `Experience: ${data.experienceType}`,
    '',
    data.message,
  ]

  if (!apiKey) {
    return Response.json(
      { ok: false, error: 'Email service is not configured' },
      { status: 503 }
    )
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: 'info@offmap.in',
      subject: `OffMap contact: ${data.name}`,
      text: lines.join('\n'),
      html: `<pre style="font-family:system-ui,sans-serif">${lines.map((l) => `${l}\n`).join('')}</pre>`,
    })

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Failed to send email' }, { status: 500 })
  }
}
