import { Resend } from 'resend'
import { studentEnquirySchema } from '@/lib/schemas/student-enquiry'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = studentEnquirySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

  const lines = [
    `School: ${data.school}`,
    `Contact: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Grade / age group: ${data.gradeGroup}`,
    `Students: ${data.studentCount}`,
    `Destination: ${data.destination}`,
    `Preferred dates: ${data.preferredDates}`,
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
      subject: `School trip enquiry: ${data.school}`,
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
