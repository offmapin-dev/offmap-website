import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'About Us',
  description: 'Meet the team behind OffMap India. We travel first, then design trips.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
