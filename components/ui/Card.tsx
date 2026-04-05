import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  hover?: boolean
}

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card',
        hover && 'transition-shadow duration-200 hover:shadow-card-hover',
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CardBody({ className, ...props }: CardBodyProps) {
  return <div className={cn('p-6', className)} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('p-6 pt-0 flex items-center', className)}
      {...props}
    />
  )
}
