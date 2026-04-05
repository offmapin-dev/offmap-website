import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { StampBadge } from '@/components/ui/scrapbook'
import { getExperienceIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ExperienceCardData {
  name: string
  region: string
  regionSlug: string
  type: string
  days: string
  price: string
  description: string
  image: string
  featured?: boolean
  comingSoon?: boolean
}

interface ExperienceCardProps extends ExperienceCardData {
  className?: string
}

export function ExperienceCard({
  name,
  region,
  regionSlug,
  type,
  days,
  price,
  description,
  image,
  comingSoon = false,
  className,
}: ExperienceCardProps) {
  const theme = REGION_THEMES[regionSlug as RegionThemeKey]
  const primary = theme?.primary ?? '#1B4FD8'
  const bg = theme?.bg ?? '#F8F9FA'
  const emoji = theme?.emoji ?? '📍'

  return (
    <div
      className={cn(
        'group bg-white rounded-2xl overflow-hidden',
        'shadow-[var(--shadow-card)]',
        'hover:-translate-y-1 hover:shadow-[var(--shadow-polaroid)]',
        'transition-all duration-200',
        comingSoon && 'opacity-70',
        className
      )}
      style={{ borderLeft: `4px solid ${primary}` }}
    >
      {/* ── Image ── */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            comingSoon && 'grayscale'
          )}
        />

        {/* Dark hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

        {/* Type badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {!comingSoon && (
            <Image
              src={getExperienceIcon(type)}
              alt={type}
              width={16}
              height={16}
              className="mix-blend-multiply"
            />
          )}
          <StampBadge
            text={comingSoon ? 'Coming Soon' : type}
            color={comingSoon ? '#94A3B8' : primary}
            rotation={-3}
          />
        </div>

        {/* Coming Soon overlay */}
        {comingSoon && (
          <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
            <span className="font-handwriting text-dark/60 text-lg rotate-[-10deg]">
              coming soon…
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Region tag */}
        <div
          style={
            {
              '--tag-bg': bg,
              '--tag-color': primary,
            } as React.CSSProperties
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--tag-bg)] border border-[var(--tag-color)] mb-2"
        >
          <span className="text-xs leading-none">{emoji}</span>
          <span
            style={{ color: primary }}
            className="font-body text-xs font-medium"
          >
            {region}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-heading font-semibold text-dark text-base leading-snug mb-1">
          {name}
        </h3>

        {/* Description */}
        <p className="font-body text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="font-handwriting text-gray-400 text-sm flex items-center gap-1">
            <MapPin size={12} className="flex-none" />
            {days}
          </span>
          <span
            style={{ color: primary }}
            className="font-display font-bold text-base"
          >
            {price === 'Coming Soon' ? (
              <span className="font-handwriting text-sm text-gray-400">
                coming soon
              </span>
            ) : (
              <>From {price}</>
            )}
          </span>
        </div>

        {/* CTA button */}
        <Link
          href={comingSoon ? '#' : `/destinations/${regionSlug}`}
          style={
            {
              '--btn-color': primary,
            } as React.CSSProperties
          }
          className={cn(
            'block w-full mt-3 py-2 text-center',
            'border-2 border-[var(--btn-color)]',
            'text-[var(--btn-color)] font-body text-sm font-medium',
            'rounded-xl',
            'hover:bg-[var(--btn-color)] hover:text-white',
            'transition-colors duration-200',
            comingSoon && 'pointer-events-none opacity-40'
          )}
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
