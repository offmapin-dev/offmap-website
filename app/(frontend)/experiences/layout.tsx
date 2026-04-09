import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Experiences',
  description: 'Explore curated travel experiences across Himachal Pradesh, Rajasthan, Uttarakhand and Kashmir.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
