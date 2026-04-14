'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DestinationTab {
  label: string
  href: string
  icon: string
  trending?: boolean
}

const TABS: DestinationTab[] = [
  { label: 'Explore All', href: '/destinations', icon: '/icons/activities.png' },
  { label: 'Himachal Pradesh', href: '/destinations/himachal-pradesh', icon: '/icons/hiking.png', trending: true },
  { label: 'Rajasthan', href: '/destinations/rajasthan', icon: '/icons/cultural.png' },
  { label: 'Kashmir', href: '/destinations/kashmir', icon: '/icons/camping.png' },
  { label: 'Uttarakhand', href: '/destinations/uttarakhand', icon: '/icons/wildlife.png' },
]

export function DestinationTabBar() {
  const pathname = usePathname()

  const showTabBar = pathname === '/' || pathname.startsWith('/destinations')
  if (!showTabBar) return null

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex gap-1 py-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {TABS.map((tab) => {
            const isActive =
              tab.href === '/destinations'
                ? pathname === '/destinations'
                : pathname.startsWith(tab.href)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-5 py-1 flex-shrink-0 group relative',
                  'transition-colors duration-200'
                )}
              >
                <div className="relative">
                  <Image
                    src={tab.icon}
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain group-hover:scale-110 transition-transform duration-200"
                  />
                  {tab.trending && (
                    <span className="absolute -top-1 -right-3 bg-[#0D78A8] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      Trending
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs whitespace-nowrap transition-colors duration-200',
                    isActive
                      ? 'font-semibold text-[#0D78A8]'
                      : 'font-medium text-gray-500 group-hover:text-[#0D78A8]'
                  )}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0D78A8] rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
