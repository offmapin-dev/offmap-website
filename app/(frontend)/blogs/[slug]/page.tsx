import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getRelatedPosts, BLOG_POSTS } from '@/lib/blog-data'
import { WashiTape, JournalNote } from '@/components/ui/scrapbook'
import { BlogCard } from '@/components/ui/BlogCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Post | OffMap India' }
  return {
    title: `${post.title} | OffMap India`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 2)

  return (
    <main>
      <section className="relative min-h-[60vh] flex items-end">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-14 md:pb-20">
          <div className="relative inline-block mb-4">
            <WashiTape color="yellow" rotation={-2} width="w-32" />
            <span className="absolute inset-0 flex items-center justify-center font-handwriting text-white text-sm pointer-events-none">
              {post.category}
            </span>
          </div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl max-w-2xl leading-tight">
            {post.title}
          </h1>
          <p className="font-handwriting text-white/75 text-lg mt-3">{post.date}</p>
        </div>
      </section>

      <section className="bg-[#F5F0E8]">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="paper-lines bg-white/80 rounded-2xl p-8 shadow-[var(--shadow-card)]">
            <JournalNote text="Full story coming soon 📝" type="sticky" className="mb-6" />
            <p className="font-body italic text-gray-600 text-base leading-relaxed">{post.excerpt}</p>
          </div>
          <Link
            href="/blogs"
            className="font-handwriting text-blue text-lg mt-10 inline-block hover:text-dark transition-colors"
          >
            ← Back to The Chronicle
          </Link>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-[#FFF8E7] py-16 md:py-20 border-t border-dashed border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="font-display font-bold text-dark text-2xl mb-8">More from The Chronicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p, index) => (
                <BlogCard
                  key={p.slug}
                  post={p}
                  tilt={index % 2 === 0 ? 'left' : 'right'}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
