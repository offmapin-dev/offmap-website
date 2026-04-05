import { cn } from '@/lib/utils'

const BOTTOM_PATH =
  'M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1350,20 1440,40 L1440,80 L0,80 Z'
const TOP_PATH =
  'M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1350,60 1440,40 L1440,0 L0,0 Z'

interface WavyDividerProps {
  fill: string
  position?: 'top' | 'bottom'
  className?: string
}

export function WavyDivider({ fill, position = 'bottom', className }: WavyDividerProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden leading-none',
        position === 'bottom' && '-mb-px',
        className
      )}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-14 md:h-20 block"
      >
        <path d={position === 'top' ? TOP_PATH : BOTTOM_PATH} fill={fill} />
      </svg>
    </div>
  )
}
