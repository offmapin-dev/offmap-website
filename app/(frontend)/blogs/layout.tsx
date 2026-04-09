import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Blog',
  description: 'Stories, guides, and reflections from the road. Slow travel writing from the OffMap team.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
