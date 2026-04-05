import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', centered && 'text-center', className)}>
      <h2 className="font-heading text-3xl font-bold text-dark md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-3 text-muted text-lg max-w-2xl', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
