import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with OffMap India. Plan your next slow travel adventure.',
})

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children
}
