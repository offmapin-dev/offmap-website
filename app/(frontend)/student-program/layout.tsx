import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Student Program',
  description: 'Experiential learning programs for schools and colleges. Designed for exploration beyond the classroom.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
