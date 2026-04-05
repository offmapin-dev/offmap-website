import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-data'
import type { RegionThemeKey } from '@/lib/constants'
import { PostageStamp, WashiTape } from '@/components/ui/scrapbook'
import { cn } from '@/lib/utils'

function washiColorForCategory(category: string): 'green' | 'blue' | 'yellow' {
  if (category === 'Destinations') return 'green'
  if (category === 'Travel Guides') return 'blue'
  return 'yellow'
}

interface BlogCardProps {
  post: BlogPost
  large?: boolean
  tilt?: 'left' | 'right'
  className?: string
}

export function BlogCard({ post, large = false, tilt, className }: BlogCardProps) {
  const washi = washiColorForCategory(post.category)
  const metaLine =
    post.region != null
      ? `${post.category} · ${post.region}`
      : post.category

  return (
    <article
      className={cn(
        'group bg-white rounded-2xl overflow-hidden h-full flex flex-col',
        'shadow-[var(--shadow-card)]',
        'hover:-translate-y-1 hover:shadow-[var(--shadow-polaroid)]',
        'transition-all duration-200',
        tilt === 'left' && 'rotate-[0.5deg]',
        tilt === 'right' && 'rotate-[-0.5deg]',
        className
      )}
    >
      <Link href={`/blogs/${post.slug}`} className="block flex flex-col h-full min-h-0">
        <div
          className={cn(
            'relative w-full shrink-0 overflow-hidden bg-gray-100',
            large ? 'h-64 md:h-72' : 'h-52 md:h-56'
          )}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={large ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          />
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <WashiTape color={washi} rotation={-2} width="w-20" className="opacity-95" />
            <span className="sr-only">{post.category}</span>
          </div>
          {post.regionSlug != null ? (
            <div className="absolute top-3 right-3 z-10 pointer-events-none scale-90 origin-top-right">
              <PostageStamp region={post.regionSlug as RegionThemeKey} />
            </div>
          ) : null}
        </div>

        <div className={cn('flex flex-col flex-1 min-h-0', large ? 'p-6' : 'p-4')}>
          <p className="font-handwriting text-xs text-gray-400 leading-tight">
            {metaLine}
          </p>
          <h3
            className={cn(
              'font-display font-bold text-dark leading-tight mt-1',
              large ? 'text-2xl' : 'text-lg'
            )}
          >
            {post.title}
          </h3>
          <p className="font-body text-gray-500 text-sm line-clamp-2 mt-2">
            {post.excerpt}
          </p>
          <div className="flex justify-between items-center mt-4">
            <span className="font-handwriting text-sm text-gray-400">{post.date}</span>
            <span className="font-handwriting text-sm text-gray-400">{post.readTime}</span>
          </div>
          <span className="font-handwriting text-blue font-bold mt-3 inline-flex items-center gap-1 group-hover:text-dark transition-colors">
            Read Journal →
          </span>
        </div>
      </Link>
    </article>
  )
}
