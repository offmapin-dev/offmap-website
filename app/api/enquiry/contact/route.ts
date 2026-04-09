import { Resend } from 'resend'
import { render } from '@react-email/components'
import { contactEnquirySchema } from '@/lib/schemas/contact-enquiry'
import { EnquiryNotificationEmail } from '@/lib/emails/enquiry-notification'

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

  if (!apiKey) {
    return Response.json(
      { ok: false, error: 'Email service is not configured' },
      { status: 503 }
    )
  }

  try {
    const html = await render(EnquiryNotificationEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.experienceType,
      destination: data.destination,
      message: data.message,
      source: 'contact',
    }))

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: 'info@offmap.in',
      subject: `New Enquiry — ${data.experienceType} — ${data.name}`,
      html,
    })

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false, error: 'Failed to send email' }, { status: 500 })
  }
}
