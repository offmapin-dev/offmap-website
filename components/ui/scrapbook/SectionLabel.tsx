import { cn } from '@/lib/utils'
import { StampBadge } from './StampBadge'

interface SectionLabelProps {
  text: string
  style?: 'stamp' | 'handwritten' | 'tag'
  className?: string
}

export function SectionLabel({ text, style = 'tag', className }: SectionLabelProps) {
  if (style === 'stamp') {
    return <StampBadge text={text} className={className} />
  }

  if (style === 'handwritten') {
    return (
      <span
        className={cn(
          'font-handwriting text-blue text-xl font-bold',
          'inline-flex items-center gap-1',
          className
        )}
      >
        {text}
        <span className="text-blue/60 text-lg">→</span>
      </span>
    )
  }

  // tag (default)
  return (
    <span
      className={cn(
        'inline-block px-3 py-1',
        'border border-current text-dark/60',
        'text-[10px] font-heading font-semibold uppercase tracking-[0.18em]',
        'rounded-sm',
        className
      )}
    >
      {text}
    </span>
  )
}
