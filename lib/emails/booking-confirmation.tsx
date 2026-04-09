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

interface BookingConfirmationProps {
  bookingId: string
  travelerName: string
  tripName: string
  batchDates: string
  travelers: number
  totalAmount: number
  advancePaid: number
  gstAmount: number
  remainingAmount: number
}

export function BookingConfirmationEmail({
  bookingId,
  travelerName,
  tripName,
  batchDates,
  travelers,
  totalAmount,
  advancePaid,
  gstAmount,
  remainingAmount,
}: BookingConfirmationProps) {
  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

  return (
    <Html>
      <Head />
      <Preview>Booking Confirmed — {tripName}</Preview>
      <Body style={{ backgroundColor: '#F5F0E8', fontFamily: 'system-ui, sans-serif', padding: '40px 0' }}>
        <Container style={{ backgroundColor: '#FFFFFF', maxWidth: '560px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#0F172A', padding: '24px 32px' }}>
            <Text style={{ color: '#FFD60A', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              OffMap India
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '32px' }}>
            <Heading as="h1" style={{ fontSize: '28px', color: '#0F172A', marginBottom: '8px' }}>
              Booking Confirmed!
            </Heading>
            <Text style={{ color: '#64748B', fontSize: '16px', marginTop: 0 }}>
              Hey {travelerName}, you&apos;re all set.
            </Text>

            {/* Booking ID */}
            <Section style={{ backgroundColor: '#FFF8E7', borderRadius: '8px', padding: '16px', marginTop: '24px', textAlign: 'center' as const }}>
              <Text style={{ color: '#64748B', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: 0 }}>
                Booking ID
              </Text>
              <Text style={{ color: '#0F172A', fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0' }}>
                {bookingId}
              </Text>
            </Section>

            {/* Trip Details */}
            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '12px' }}>Trip Details</Text>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Trip</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{tripName}</Text></Column></Row>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Dates</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{batchDates}</Text></Column></Row>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Travelers</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{travelers}</Text></Column></Row>

            {/* Payment */}
            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '12px' }}>Payment Summary</Text>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Total Trip Cost</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{formatINR(totalAmount)}</Text></Column></Row>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Advance Paid (30% + GST)</Text></Column><Column><Text style={{ color: '#2D6A4F', fontWeight: 'bold', margin: '4px 0', textAlign: 'right' as const }}>{formatINR(advancePaid)}</Text></Column></Row>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>GST (5%)</Text></Column><Column><Text style={{ color: '#0F172A', margin: '4px 0', textAlign: 'right' as const }}>{formatINR(gstAmount)}</Text></Column></Row>
            <Row><Column><Text style={{ color: '#64748B', margin: '4px 0' }}>Remaining (pay before trip)</Text></Column><Column><Text style={{ color: '#C1440E', fontWeight: 'bold', margin: '4px 0', textAlign: 'right' as const }}>{formatINR(remainingAmount)}</Text></Column></Row>

            {/* Reminders */}
            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>Before You Go</Text>
            <Text style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              {'\u2022'} Carry a valid photo ID{'\n'}
              {'\u2022'} Full payment is due 7 days before the trip{'\n'}
              {'\u2022'} Pack light — we&apos;ll send a detailed packing list{'\n'}
              {'\u2022'} For cancellations, refer to our policy on the website
            </Text>

            {/* Contact */}
            <Section style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
              <Text style={{ color: '#0F172A', fontWeight: 'bold', margin: '0 0 8px' }}>Questions?</Text>
              <Text style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
                Reply to this email, call us at +91 92114 71385, or{' '}
                <Link href="https://wa.me/919211471385" style={{ color: '#1B4FD8' }}>
                  WhatsApp us
                </Link>.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#0F172A', padding: '20px 32px', textAlign: 'center' as const }}>
            <Text style={{ color: '#94A3B8', fontSize: '12px', margin: 0 }}>
              OffMap India &middot; Travel Slow, Go OffMap
            </Text>
            <Text style={{ color: '#64748B', fontSize: '11px', margin: '4px 0 0' }}>
              info@offmap.in &middot; +91 92114 71385
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
