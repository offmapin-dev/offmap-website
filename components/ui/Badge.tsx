import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-0.5',
  {
    variants: {
      variant: {
        default: 'bg-border text-muted',
        primary: 'bg-primary text-white',
        yellow: 'bg-yellow text-dark',
        'seats-left': 'bg-yellow text-dark',
        himachal: 'bg-himachal-bg text-himachal-primary',
        rajasthan: 'bg-rajasthan-bg text-rajasthan-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  className?: string
}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
