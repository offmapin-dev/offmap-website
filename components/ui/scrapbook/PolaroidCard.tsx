import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PolaroidCardProps {
  src: string
  alt: string
  caption: string
  rotation?: number
  size?: 'sm' | 'md' | 'lg'
  washiColor?: 'yellow' | 'blue' | 'pink'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<PolaroidCardProps['size']>, string> = {
  sm: 'w-40',
  md: 'w-56',
  lg: 'w-72',
}

const WASHI_BG: Record<NonNullable<PolaroidCardProps['washiColor']>, string> = {
  yellow: 'bg-yellow/85',
  blue: 'bg-blue-300/75',
  pink: 'bg-pink-300/75',
}

const WASHI_ROTATE: Record<NonNullable<PolaroidCardProps['washiColor']>, string> = {
  yellow: 'rotate-[-2deg]',
  blue: 'rotate-[1.5deg]',
  pink: 'rotate-[-1deg]',
}

export function PolaroidCard({
  src,
  alt,
  caption,
  rotation = 0,
  size = 'md',
  washiColor,
  className,
}: PolaroidCardProps) {
  // Hover adds a slight additional rotation in the same direction
  const hoverRotation = rotation >= 0 ? rotation + 2 : rotation - 2

  return (
    <div
      style={
        {
          '--r': `${rotation}deg`,
          '--hr': `${hoverRotation}deg`,
        } as React.CSSProperties
      }
      className={cn(
        'relative bg-white p-3 pb-8',
        'shadow-[var(--shadow-polaroid)]',
        'rotate-[var(--r)] hover:rotate-[var(--hr)]',
        'transition-transform duration-300 cursor-default',
        SIZE_CLASSES[size],
        className
      )}
    >
      {/* Washi tape strip at top-center */}
      {washiColor && (
        <div
          className={cn(
            'absolute -top-2.5 left-1/2 -translate-x-1/2 z-10',
            'w-12 h-5 rounded-sm',
            WASHI_BG[washiColor],
            WASHI_ROTATE[washiColor]
          )}
        />
      )}

      {/* Photo area */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 160px, 288px"
        />
      </div>

      {/* Caption in Caveat handwriting font */}
      <p className="mt-2 text-center text-gray-500 text-sm font-handwriting leading-tight">
        {caption}
      </p>
    </div>
  )
}
