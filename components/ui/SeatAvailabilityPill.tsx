import { cn } from '@/lib/utils'

interface SeatAvailabilityPillProps {
  seatsLeft: number
  soldOut?: boolean
  className?: string
}

export function SeatAvailabilityPill({ seatsLeft, soldOut, className }: SeatAvailabilityPillProps) {
  if (soldOut || seatsLeft === 0) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-body font-medium',
        'bg-gray-100 text-gray-500 border border-gray-200',
        className
      )}>
        Sold Out
      </span>
    )
  }

  if (seatsLeft <= 3) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-body font-medium animate-pulse',
        'bg-red-50 text-red-700 border border-red-200',
        className
      )}>
        {seatsLeft === 1 ? 'Last seat!' : `Only ${seatsLeft} left!`}
      </span>
    )
  }

  if (seatsLeft <= 7) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-body font-medium',
        'bg-amber-50 text-amber-700 border border-amber-200',
        className
      )}>
        {seatsLeft} seats left
      </span>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-body font-medium',
      'bg-emerald-50 text-emerald-700 border border-emerald-200',
      className
    )}>
      Available
    </span>
  )
}
