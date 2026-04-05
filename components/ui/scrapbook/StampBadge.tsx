import { cn } from '@/lib/utils'

interface StampBadgeProps {
  text: string
  color?: string
  rotation?: number
  className?: string
}

export function StampBadge({
  text,
  color = '#1B4FD8',
  rotation = -5,
  className,
}: StampBadgeProps) {
  return (
    <div
      style={
        {
          '--stamp-color': color,
          '--stamp-r': `${rotation}deg`,
        } as React.CSSProperties
      }
      className={cn(
        'inline-flex items-center justify-center',
        'rotate-[var(--stamp-r)]',
        'px-3 py-1.5',
        // Rubber stamp: double border with slight spacing for the worn look
        'border-[3px] border-[var(--stamp-color)]',
        'outline outline-[1px] outline-offset-[3px] outline-[var(--stamp-color)]/40',
        // Semi-transparent fills
        'bg-[var(--stamp-color)]/5',
        // Text styling
        'text-[var(--stamp-color)] font-heading font-bold text-xs uppercase tracking-[0.2em]',
        // Slight blur on border for worn/inked look
        '[filter:drop-shadow(0_0_1px_var(--stamp-color))]',
        className
      )}
    >
      {text}
    </div>
  )
}
