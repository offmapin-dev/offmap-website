import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Stays',
  description: 'Handpicked stays in the mountains, desert and forests. Every place personally visited by the OffMap team.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
