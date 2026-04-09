import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Work With Us',
  description: 'Partner with OffMap India as a trip leader, content creator, homestay owner, or experience host.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
