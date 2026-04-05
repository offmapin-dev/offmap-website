import { cn } from '@/lib/utils'

interface TornEdgeProps {
  position: 'top' | 'bottom'
  /** Fill color = background color of the NEXT section this tears into */
  color?: string
  className?: string
}

// Jagged path for bottom edge (fills the space above the waveline)
const BOTTOM_PATH =
  'M0,0 L0,20 Q25,42 50,20 Q75,0 100,18 Q125,38 150,18 Q175,0 200,20 Q225,40 250,18 Q275,0 300,22 Q325,42 350,20 Q375,0 400,18 Q425,38 450,20 Q475,0 500,22 Q525,40 550,18 Q575,0 600,20 Q625,42 650,18 Q675,0 700,22 Q725,40 750,18 Q775,0 800,20 Q825,42 850,18 Q875,0 900,22 Q925,40 950,18 Q975,0 1000,20 Q1025,42 1050,18 Q1075,0 1100,22 Q1125,40 1150,18 Q1175,0 1200,20 L1200,0 Z'

// Jagged path for top edge (fills the space below the waveline)
const TOP_PATH =
  'M0,40 L0,20 Q25,0 50,22 Q75,42 100,20 Q125,0 150,22 Q175,42 200,20 Q225,0 250,22 Q275,42 300,20 Q325,0 350,22 Q375,42 400,20 Q425,0 450,22 Q475,42 500,20 Q525,0 550,22 Q575,42 600,20 Q625,0 650,22 Q675,42 700,20 Q725,0 750,22 Q775,42 800,20 Q825,0 850,22 Q875,42 900,20 Q925,0 950,22 Q975,42 1000,20 Q1025,0 1050,22 Q1075,42 1100,20 Q1125,0 1150,22 Q1175,42 1200,20 L1200,40 Z'

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
        viewBox="0 0 1200 40"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path d={path} fill={color} />
      </svg>
    </div>
  )
}
