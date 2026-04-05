export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  region: string | null
  regionSlug: string | null
  date: string
  readTime: string
  image: string
  featured: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'bir-barot-slow-trek',
    title: 'A 4-Day Slow Trek Through Bir to Barot Valley',
    excerpt:
      "We didn't plan every step. We just walked. And somewhere between the apple orchards and the pine forests, we found exactly what we were looking for.",
    category: 'Destinations',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    date: 'March 15, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    featured: true,
  },
  {
    slug: 'jawai-rajasthan-secret',
    title: "Why Jawai is Rajasthan's Best Kept Secret",
    excerpt:
      'Everyone goes to Jaipur. Everyone photographs Udaipur. But Jawai — the land of leopards and ancient temples — stays quietly off every tourist map.',
    category: 'Travel Guides',
    region: 'Rajasthan',
    regionSlug: 'rajasthan',
    date: 'February 8, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80',
    featured: false,
  },
  {
    slug: 'slow-travel-what-it-means',
    title: 'Traveling Slow: What It Actually Means',
    excerpt:
      "Slow travel isn't about moving less. It's about being more present wherever you are. Here's how we think about it at OffMap.",
    category: 'Travel Philosophy',
    region: null,
    regionSlug: null,
    date: 'January 22, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80',
    featured: false,
  },
  {
    slug: 'rajgundha-valley-hidden',
    title: 'Rajgundha Valley: The Meadow Nobody Talks About',
    excerpt:
      "Above Barot, beyond the treeline, there's a valley that shepherds have known for centuries. We spent three days there and barely wanted to leave.",
    category: 'Destinations',
    region: 'Himachal Pradesh',
    regionSlug: 'himachal-pradesh',
    date: 'December 10, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    featured: false,
  },
  {
    slug: 'kasar-devi-uttarakhand',
    title: 'Kasar Devi and the Quiet Hills of Uttarakhand',
    excerpt:
      "There's a reason artists, philosophers and wanderers have been coming to these hills for decades. The silence here has texture.",
    category: 'Destinations',
    region: 'Uttarakhand',
    regionSlug: 'uttarakhand',
    date: 'November 5, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    featured: false,
  },
  {
    slug: 'group-travel-strangers',
    title: 'What Happens When You Travel With Strangers',
    excerpt:
      "Most of our travelers come alone. Almost none of them leave feeling that way. Here's what actually happens on a group trip.",
    category: 'Travel Philosophy',
    region: null,
    regionSlug: null,
    date: 'October 18, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    featured: false,
  },
]

export const CATEGORIES = ['All', 'Destinations', 'Travel Guides', 'Travel Philosophy'] as const

export type BlogCategoryFilter = (typeof CATEGORIES)[number]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const post = getBlogPostBySlug(slug)
  if (!post) return []
  return BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post.category).slice(0, limit)
}
