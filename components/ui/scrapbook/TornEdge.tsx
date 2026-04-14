import { cn } from '@/lib/utils'

interface TornEdgeProps {
  position: 'top' | 'bottom'
  /** Fill color = background color of the NEXT section this tears into */
  color?: string
  className?: string
}

const BOTTOM_PATH =
  'M0,0 L0,30 C60,45 120,15 180,35 C240,55 300,20 360,38 C420,56 480,18 540,32 C600,46 660,22 720,40 C780,58 840,16 900,34 C960,52 1020,20 1080,36 C1140,52 1200,24 1260,38 C1320,52 1380,28 1440,35 L1440,0 Z'

const TOP_PATH =
  'M0,60 L0,30 C60,15 120,45 180,25 C240,5 300,40 360,22 C420,4 480,42 540,28 C600,14 660,38 720,20 C780,2 840,44 900,26 C960,8 1020,40 1080,24 C1140,8 1200,36 1260,22 C1320,8 1380,32 1440,25 L1440,60 Z'

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
