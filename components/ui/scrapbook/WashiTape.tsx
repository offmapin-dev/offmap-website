import { cn } from '@/lib/utils'

interface WashiTapeProps {
  color?: 'yellow' | 'blue' | 'pink' | 'green'
  rotation?: number
  width?: string
  className?: string
}

const COLOR_CLASSES: Record<NonNullable<WashiTapeProps['color']>, string> = {
  yellow: 'bg-yellow/85',
  blue: 'bg-blue-300/75',
  pink: 'bg-pink-300/75',
  green: 'bg-green-300/75',
}

export function WashiTape({
  color = 'yellow',
  rotation = -2,
  width = 'w-24',
  className,
}: WashiTapeProps) {
  return (
    <div
      style={{ '--washi-r': `${rotation}deg` } as React.CSSProperties}
      className={cn(
        'h-5 rotate-[var(--washi-r)]',
        // Slightly rough edges via clip-path (scalloped look)
        '[clip-path:polygon(0%_15%,2%_0%,5%_8%,8%_0%,11%_8%,94%_8%,97%_0%,100%_8%,100%_85%,98%_100%,95%_92%,92%_100%,89%_92%,6%_92%,3%_100%,0%_92%)]',
        COLOR_CLASSES[color],
        width,
        className
      )}
    />
  )
}
