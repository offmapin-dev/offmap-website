import { cn } from '@/lib/utils'

interface JournalNoteProps {
  text: string
  type?: 'sticky' | 'torn'
  className?: string
}

export function JournalNote({ text, type = 'sticky', className }: JournalNoteProps) {
  if (type === 'sticky') {
    return (
      <div
        className={cn(
          'relative w-36 p-3',
          'bg-yellow/90',
          'shadow-[2px_4px_12px_rgba(0,0,0,0.15)]',
          'rotate-[-2deg]',
          // Top fold corner effect
          'before:content-[""] before:absolute before:top-0 before:right-0',
          'before:border-t-[16px] before:border-r-[16px]',
          'before:border-t-white/30 before:border-r-transparent',
          className
        )}
      >
        <p className="font-handwriting text-dark/80 text-sm leading-snug">
          {text}
        </p>
      </div>
    )
  }

  // Torn notebook paper
  return (
    <div
      className={cn(
        'relative w-44 pb-4',
        'bg-white',
        'shadow-[1px_2px_8px_rgba(0,0,0,0.1)]',
        // Torn bottom edge via clip-path
        '[clip-path:polygon(0%_0%,100%_0%,100%_80%,97%_88%,94%_82%,91%_90%,88%_84%,85%_92%,82%_86%,79%_93%,76%_87%,73%_94%,70%_88%,67%_95%,64%_89%,61%_96%,58%_90%,55%_97%,52%_91%,49%_98%,46%_92%,43%_99%,40%_93%,37%_100%,34%_94%,31%_100%,28%_94%,25%_100%,22%_93%,19%_99%,16%_93%,13%_99%,10%_92%,7%_98%,4%_91%,0%_95%)]',
        className
      )}
    >
      {/* Lined paper rule */}
      <div className="border-b border-blue-100 mb-0" />
      <div className="px-3 pt-2">
        <p className="font-handwriting text-dark/75 text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}
