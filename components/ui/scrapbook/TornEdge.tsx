import { cn } from '@/lib/utils'

interface TornEdgeProps {
  position: 'top' | 'bottom'
  /** Fill color = background color of the NEXT section this tears into */
  color?: string
  className?: string
}

// More dramatic jagged torn paper edges — irregular, pronounced tears
const BOTTOM_PATH =
  'M0,0 L0,30 L20,20 L40,35 L60,15 L90,40 L120,20 L150,38 L180,18 L210,42 L240,22 L280,38 L320,15 L360,40 L400,18 L440,35 L480,12 L520,38 L560,22 L600,40 L640,18 L680,35 L720,15 L760,42 L800,20 L840,38 L880,15 L920,40 L960,22 L1000,38 L1040,18 L1080,42 L1120,20 L1160,35 L1200,15 L1240,38 L1280,25 L1320,40 L1360,18 L1400,35 L1440,22 L1440,0 Z'

// Top edge — mirror of bottom, fills downward
const TOP_PATH =
  'M0,60 L0,30 L20,40 L40,25 L60,45 L90,20 L120,40 L150,22 L180,42 L210,18 L240,38 L280,22 L320,45 L360,20 L400,42 L440,25 L480,48 L520,22 L560,38 L600,20 L640,42 L680,25 L720,45 L760,18 L800,40 L840,22 L880,45 L920,20 L960,38 L1000,22 L1040,42 L1080,18 L1120,40 L1160,25 L1200,45 L1240,22 L1280,35 L1320,20 L1360,42 L1400,25 L1440,38 L1440,60 Z'

export function TornEdge({ position, color = '#FDFAF5', className }: TornEdgeProps) {
  const path = position === 'bottom' ? BOTTOM_PATH : TOP_PATH

  return (
    <div
      className={cn(
        'w-full h-10 overflow-hidden leading-none',
        position === 'bottom' ? '-mb-px' : '-mt-px',
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  )
}
