import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Destinations',
  description: 'Discover OffMap destinations across India. Himachal Pradesh, Rajasthan, Uttarakhand, and Kashmir.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
