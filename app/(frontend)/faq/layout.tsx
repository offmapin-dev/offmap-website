import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'FAQ',
  description: 'Frequently asked questions about OffMap trips, stays, bookings, and cancellations.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
