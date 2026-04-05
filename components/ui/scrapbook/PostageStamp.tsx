import { REGION_THEMES, type RegionThemeKey } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PostageStampProps {
  region: RegionThemeKey
  text?: string
  className?: string
}

export function PostageStamp({ region, text, className }: PostageStampProps) {
  const theme = REGION_THEMES[region]

  return (
    <div
      className={cn('relative w-16 h-20 rotate-[-5deg] flex-none', className)}
    >
      {/*
        Perforated border technique:
        - Outer div has radial-gradient dots (stamp-perforation class)
        - --stamp-color CSS var sets the dot color
        - 6px padding = the visible "perforation" strip
        - Inner div is solid-colored, covering center dots
      */}
      <div
        style={{ '--stamp-color': theme.primary } as React.CSSProperties}
        className="absolute inset-0 p-1.5 stamp-perforation"
      >
        {/* Solid inner content area — covers the center portion of the dots */}
        <div
          style={{ backgroundColor: theme.bg } as React.CSSProperties}
          className="w-full h-full flex flex-col items-center justify-center gap-0.5"
        >
          <span className="text-xl leading-none">{theme.emoji}</span>
          {text && (
            <span
              style={{ color: theme.primary } as React.CSSProperties}
              className="text-[8px] font-handwriting font-bold text-center leading-tight px-0.5"
            >
              {text}
            </span>
          )}
          <span
            style={{ color: theme.primary } as React.CSSProperties}
            className="text-[7px] font-handwriting opacity-70 uppercase tracking-tight"
          >
            INDIA
          </span>
        </div>
      </div>
    </div>
  )
}
