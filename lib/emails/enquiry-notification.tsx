import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Preview,
  Heading,
  Row,
  Column,
} from '@react-email/components'

interface EnquiryNotificationProps {
  name: string
  email: string
  phone: string
  type: string
  destination?: string
  message: string
  source: string
}

export function EnquiryNotificationEmail({
  name,
  email,
  phone,
  type,
  destination,
  message,
  source,
}: EnquiryNotificationProps) {
  const whatsappUrl = `https://wa.me/91${phone.replace(/\D/g, '').replace(/^91/, '')}?text=${encodeURIComponent(`Hi ${name}, thanks for reaching out to OffMap India!`)}`

  return (
    <Html>
      <Head />
      <Preview>New Enquiry from {name}</Preview>
      <Body style={{ backgroundColor: '#F5F0E8', fontFamily: 'system-ui, sans-serif', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#FFFFFF', maxWidth: '560px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#0F172A', padding: '24px 32px' }}>
            <Text style={{ color: '#FFD60A', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              OffMap India
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: '12px', margin: '4px 0 0' }}>
              Internal Notification
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Heading as="h1" style={{ fontSize: '24px', color: '#0F172A', marginBottom: '8px' }}>
              New Enquiry Received
            </Heading>
            <Text style={{ color: '#64748B', fontSize: '14px', marginTop: 0 }}>
              Via {source} form
            </Text>

            {/* Contact Info */}
            <Section style={{ backgroundColor: '#FFF8E7', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
              <Text style={{ color: '#0F172A', fontWeight: 'bold', fontSize: '18px', margin: '0 0 4px' }}>
                {name}
              </Text>
              <Text style={{ color: '#64748B', fontSize: '14px', margin: '2px 0' }}>
                <Link href={`mailto:${email}`} style={{ color: '#1B4FD8' }}>{email}</Link>
              </Text>
              <Text style={{ color: '#64748B', fontSize: '14px', margin: '2px 0' }}>
                {phone}
              </Text>
            </Section>

            {/* Enquiry Details */}
            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '12px' }}>Enquiry Details</Text>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Type</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{type}</Text></Column></Row>
            {destination ? (
              <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Destination</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{destination}</Text></Column></Row>
            ) : null}

            {/* Message */}
            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>Message</Text>
            <Text style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' as const }}>
              {message}
            </Text>

            {/* Quick Actions */}
            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '12px' }}>Quick Actions</Text>
            <Section>
              <Link
                href={`mailto:${email}?subject=Re: Your OffMap Enquiry&body=Hi ${encodeURIComponent(name)},%0A%0AThanks for reaching out to OffMap India!%0A%0A`}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#1B4FD8',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  marginRight: '8px',
                }}
              >
                Reply via Email
              </Link>
              <Link
                href={whatsappUrl}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                WhatsApp
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#0F172A', padding: '20px 32px', textAlign: 'center' as const }}>
            <Text style={{ color: '#94A3B8', fontSize: '12px', margin: 0 }}>
              OffMap India &middot; Internal Notification
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
